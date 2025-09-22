#!/usr/bin/env python3
"""
Test script to verify the Lambda function endpoints work correctly.
Run this after deploying the updated Lambda function.
"""

import requests
import json
import sys

# Your API Gateway URL
API_URL = "https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/metrics"

def test_endpoint(endpoint, description, method="GET", data=None):
    """Test a single endpoint"""
    url = f"{API_URL}{endpoint}"
    print(f"\nTesting {description}: {url}")
    
    try:
        if method == "POST":
            response = requests.post(url, json=data, timeout=10)
        else:
            response = requests.get(url, timeout=10)
            
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)[:200]}...")
            
            # Special validation for main metrics endpoint
            if endpoint == "" and method == "POST":
                required_keys = ["cards", "charts", "anomalies", "securityFindings", "savings", "meta"]
                missing_keys = [key for key in required_keys if key not in response_data]
                if missing_keys:
                    print(f"⚠️  Missing required keys: {missing_keys}")
                    return False
                else:
                    print("✅ All required keys present")
            
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False

def test_cors_preflight(endpoint):
    """Test CORS preflight request"""
    url = f"{API_URL}{endpoint}"
    print(f"\nTesting CORS preflight for: {url}")
    
    try:
        response = requests.options(url, timeout=10)
        print(f"OPTIONS Status: {response.status_code}")
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        print(f"CORS Headers: {cors_headers}")
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"CORS preflight failed: {e}")
        return False

def main():
    print("Testing JohnnyCloud Lambda Function Endpoints")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        ("", "Main Metrics (POST)", "POST", {"timeRange": "7d", "dataSource": "both"}),
        ("/summary", "Dashboard Summary"),
        ("/efficiency", "Efficiency Metrics"),
        ("/reliability", "Reliability Metrics"),
        ("/cost/summary", "Cost Summary"),
        ("/security/guardduty", "GuardDuty Security"),
        ("/network/exposure", "Network Exposure")
    ]
    
    results = []
    
    for endpoint_info in endpoints:
        if len(endpoint_info) == 4:
            endpoint, description, method, data = endpoint_info
            success = test_endpoint(endpoint, description, method, data)
        else:
            endpoint, description = endpoint_info
            success = test_endpoint(endpoint, description)
        
        results.append((endpoint, success))
        
        # Test CORS preflight
        cors_success = test_cors_preflight(endpoint)
        if not cors_success:
            print(f"⚠️  CORS preflight failed for {endpoint}")
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    for endpoint, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {endpoint}")
    
    all_passed = all(success for _, success in results)
    
    if all_passed:
        print("\n🎉 All tests passed! Your Lambda function is working correctly.")
        print("The CORS errors and data structure issues in your frontend should now be resolved.")
    else:
        print("\n⚠️  Some tests failed. Check the Lambda function deployment.")
        sys.exit(1)

if __name__ == "__main__":
    main()
