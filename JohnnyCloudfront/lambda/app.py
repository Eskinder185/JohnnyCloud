import json, os, datetime as dt
import boto3
from botocore.exceptions import ClientError

def _resp(body, status=200):
    return {"statusCode": status, "headers": {
        "content-type":"application/json",
        "access-control-allow-origin": os.getenv("CORS_ORIGIN","*"),
        "access-control-allow-methods":"GET,OPTIONS"
    }, "body": json.dumps(body, default=str)}

def _dates():
    today = dt.date.today()
    start_m = today.replace(day=1).strftime("%Y-%m-%d")
    tomorrow = (today + dt.timedelta(days=1)).strftime("%Y-%m-%d")
    last30 = (today - dt.timedelta(days=30)).strftime("%Y-%m-%d")
    return start_m, tomorrow, last30

def cost_summary():
    ce = boto3.client("ce")
    start_m, end_today, last30 = _dates()
    out = {}

    try:
        m = ce.get_cost_and_usage(TimePeriod={"Start": start_m, "End": end_today},
                                  Granularity="MONTHLY", Metrics=["UnblendedCost"])
        out["mtdUSD"] = float(m["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"])
    except ClientError as e:
        return {"error":"ce:GetCostAndUsage", "detail": str(e)}

    try:
        f = ce.get_cost_forecast(TimePeriod={"Start": end_today,
                                             "End": (dt.date.today().replace(day=28)+dt.timedelta(days=8)).replace(day=1).strftime("%Y-%m-%d")},
                                 Metric="UNBLENDED_COST", Granularity="MONTHLY")
        out["forecastUSD"] = float(f["ForecastResultsByTime"][0]["MeanValue"])
    except ClientError:
        out["forecastUSD"] = None

    # daily trend (last 30d)
    try:
        t = ce.get_cost_and_usage(TimePeriod={"Start": last30, "End": end_today},
                                  Granularity="DAILY", Metrics=["UnblendedCost"])
        out["daily"] = [
          {"date": d["TimePeriod"]["Start"], "usd": float(d["Total"]["UnblendedCost"]["Amount"])}
          for d in t["ResultsByTime"]
        ]
    except ClientError:
        out["daily"] = []

    # top 5 services (MTD)
    try:
        g = ce.get_cost_and_usage(TimePeriod={"Start": start_m, "End": end_today},
                                  Granularity="MONTHLY",
                                  Metrics=["UnblendedCost"],
                                  GroupBy=[{"Type":"DIMENSION","Key":"SERVICE"}])
        groups = g["ResultsByTime"][0].get("Groups", [])
        svc = sorted(
            [{"service":i["Keys"][0], "usd": float(i["Metrics"]["UnblendedCost"]["Amount"])} for i in groups],
            key=lambda x: x["usd"], reverse=True
        )[:5]
        out["topServices"] = svc
    except ClientError:
        out["topServices"] = []

    return out

def cost_anomalies():
    ce = boto3.client("ce")
    start_m, end_today, last30 = _dates()
    try:
        res = ce.get_anomalies(DateInterval={"StartDate": last30, "EndDate": end_today}, MaxResults=50)
        anns = []
        for a in res.get("Anomalies", []):
            anns.append({
                "start": a["AnomalyStartDate"], "end": a.get("AnomalyEndDate"),
                "impactUSD": a["Impact"]["TotalImpact"],
                "score": a["AnomalyScore"]["MaxScore"],
                "rootCauses": a.get("RootCauses", [])
            })
        return {"anomalies": anns}
    except ClientError as e:
        return {"error":"ce:GetAnomalies", "detail": str(e)}

def guardduty_summary():
    gd = boto3.client("guardduty")
    try:
        dets = gd.list_detectors()["DetectorIds"]
        if not dets: return {"enabled": False}
        det = dets[0]
        ids = gd.list_findings(DetectorId=det, FindingCriteria={
            "Criterion":{"service.eventLastSeen":{"Gte": (dt.datetime.utcnow()-dt.timedelta(days=7)).isoformat()+"Z"}}
        }, MaxResults=100)["FindingIds"]
        if not ids: return {"enabled": True, "counts": {"low":0,"medium":0,"high":0}, "latest":[]}
        f = gd.get_findings(DetectorId=det, FindingIds=ids)["Findings"]
        counts = {"low":0,"medium":0,"high":0}
        latest = []
        for x in f:
            sev = x["Severity"]
            bucket = "high" if sev>=7 else "medium" if sev>=4 else "low"
            counts[bucket]+=1
            latest.append({"title": x["Title"], "severity": sev, "lastSeen": x["Service"]["EventLastSeen"]})
        latest.sort(key=lambda z: z["lastSeen"], reverse=True)
        return {"enabled": True, "counts": counts, "latest": latest[:5]}
    except ClientError as e:
        return {"error":"guardduty", "detail": str(e)}

def securityhub_failed_controls():
    sh = boto3.client("securityhub")
    try:
        resp = sh.get_findings(
            Filters={
              "ComplianceStatus":[{"Value":"FAILED","Comparison":"EQUALS"}],
              "UpdatedAt":[{"DateRange":{"Value":7,"Unit":"DAYS"}}]
            }, MaxResults=50
        )
        f = resp.get("Findings", [])
        by_std = {}
        for x in f:
            std = (x.get("ProductFields", {}).get("StandardsArn") or "Unknown").split("/")[-1]
            by_std[std] = by_std.get(std, 0) + 1
        top = sorted(by_std.items(), key=lambda kv: kv[1], reverse=True)[:5]
        return {"enabled": True, "failedByStandard": [{"standard":k,"count":v} for k,v in top]}
    except ClientError as e:
        code = e.response.get("Error",{}).get("Code","")
        if code in ("InvalidAccessException","AccessDeniedException"):
            return {"enabled": False}
        return {"error":"securityhub", "detail": str(e)}

def iam_hygiene():
    iam = boto3.client("iam")
    out = {"passwordPolicy":"present"}
    try:
        iam.get_account_password_policy()
    except iam.exceptions.NoSuchEntityException:
        out["passwordPolicy"] = "missing"

    no_mfa, old_keys = [], []
    try:
        for u in iam.list_users()["Users"]:
            if not iam.list_mfa_devices(UserName=u["UserName"])["MFADevices"]:
                no_mfa.append(u["UserName"])
            for k in iam.list_access_keys(UserName=u["UserName"])["AccessKeyMetadata"]:
                last = iam.get_access_key_last_used(AccessKeyId=k["AccessKeyId"])["AccessKeyLastUsed"].get("LastUsedDate")
                if last and (dt.date.today()-last.date()).days > 90:
                    old_keys.append({"user":u["UserName"],"key":k["AccessKeyId"]})
    except ClientError as e:
        return {"error":"iam", "detail": str(e)}
    out["noMFA"] = no_mfa
    out["oldKeys"] = old_keys
    return out

def net_exposure():
    ec2 = boto3.client("ec2"); s3 = boto3.client("s3")
    open_sgs = []
    try:
        for sg in ec2.describe_security_groups()["SecurityGroups"]:
            for p in sg.get("IpPermissions", []):
                rng = [r.get("CidrIp") for r in p.get("IpRanges",[])]
                if "0.0.0.0/0" in rng and (p.get("FromPort") in [22,3389,80,443,None]):
                    open_sgs.append({"group": sg["GroupId"], "from": p.get("FromPort"), "to": p.get("ToPort")})
    except ClientError as e:
        open_sgs = [{"error": str(e)}]

    public_buckets = 0
    try:
        for b in s3.list_buckets()["Buckets"]:
            name = b["Name"]
            pab = None
            try:
                pab = s3.get_public_access_block(Bucket=name)["PublicAccessBlockConfiguration"]
            except ClientError:
                pab = {}
            try:
                pol = s3.get_bucket_policy_status(Bucket=name)["PolicyStatus"]["IsPublic"]
            except ClientError:
                pol = False
            if (not pab) or (not all(pab.values())) or pol:
                public_buckets += 1
    except ClientError as e:
        pass
    return {"openSecurityGroups": open_sgs[:50], "publicBucketsCount": public_buckets}

def handler(event, context):
    path = (event.get("rawPath") or event.get("path") or "/").lower()
    try:
        if path.endswith("/cost/summary"):      return _resp(cost_summary())
        if path.endswith("/cost/anomalies"):    return _resp(cost_anomalies())
        if path.endswith("/security/guardduty"):return _resp(guardduty_summary())
        if path.endswith("/security/hub"):      return _resp(securityhub_failed_controls())
        if path.endswith("/security/iam"):      return _resp(iam_hygiene())
        if path.endswith("/network/exposure"):  return _resp(net_exposure())
        return _resp({"endpoints":[
          "/cost/summary","/cost/anomalies",
          "/security/guardduty","/security/hub","/security/iam",
          "/network/exposure"
        ]})
    except Exception as e:
        return _resp({"error":"unhandled","detail":str(e)}, 500)
