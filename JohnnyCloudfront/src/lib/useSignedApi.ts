import React from "react";
import { getAwsCreds } from "@/lib/creds";
import { signedFetch } from "@/lib/signedFetch";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const API = `${API_BASE}/metrics`;

export function useSignedGet<T>(path: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  const run = React.useCallback(async () => {
    setLoading(true); 
    setErr(null);
    
    const id = sessionStorage.getItem("ID_TOKEN"); 
    if (!id) { 
      setErr("not_authenticated"); 
      setLoading(false); 
      return; 
    }
    
    try { 
      const creds = await getAwsCreds(id); 
      const r = await signedFetch(API + path, creds); 
      const j = await r.json(); 
      setData(j); 
    } catch (e: any) { 
      setErr(e?.message || "fetch_failed"); 
    } finally { 
      setLoading(false); 
    }
  }, [path]);
  
  React.useEffect(() => { 
    run(); 
  }, [run]);
  
  return { data, err, loading, refetch: run };
}











