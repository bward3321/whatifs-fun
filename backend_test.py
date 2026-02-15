#!/usr/bin/env python3
"""Backend API Testing for Too Fast To Click Game"""

import requests
import sys
import json
from datetime import datetime

class TooFastToClickAPITester:
    def __init__(self, base_url="https://click-chaos-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name, passed, details=""):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
        else:
            print(f"❌ {test_name}: FAILED - {details}")
        
        self.results.append({
            "test": test_name,
            "passed": passed,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/", timeout=10)
            expected_message = "Too Fast To Click API"
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == expected_message:
                    self.log_result("API Root Endpoint", True)
                    return True
                else:
                    self.log_result("API Root Endpoint", False, f"Expected message '{expected_message}', got '{data.get('message')}'")
            else:
                self.log_result("API Root Endpoint", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_result("API Root Endpoint", False, f"Exception: {str(e)}")
        
        return False

    def test_submit_score(self):
        """Test score submission endpoint"""
        try:
            test_score = {
                "player_name": "TestPlayer",
                "mode": "classic",
                "score": 42,
                "longest_streak": 8,
                "survival_time": 35.5,
                "max_speed": 2.3
            }
            
            response = requests.post(
                f"{self.base_url}/api/scores",
                json=test_score,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                # Check if required fields are present
                required_fields = ["id", "player_name", "mode", "score", "created_at"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    if data["score"] == test_score["score"] and data["mode"] == test_score["mode"]:
                        self.log_result("Score Submission", True)
                        return data["id"]  # Return score ID for further tests
                    else:
                        self.log_result("Score Submission", False, "Score data mismatch")
                else:
                    self.log_result("Score Submission", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Score Submission", False, f"Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Score Submission", False, f"Exception: {str(e)}")
        
        return None

    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        try:
            # Test classic mode leaderboard
            response = requests.get(
                f"{self.base_url}/api/scores/leaderboard?mode=classic&limit=5",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Leaderboard Endpoint", True)
                    return True
                else:
                    self.log_result("Leaderboard Endpoint", False, "Response is not a list")
            else:
                self.log_result("Leaderboard Endpoint", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_result("Leaderboard Endpoint", False, f"Exception: {str(e)}")
        
        return False

    def test_global_stats(self):
        """Test global stats endpoint"""
        try:
            response = requests.get(
                f"{self.base_url}/api/scores/stats",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                expected_fields = ["total_games", "avg_survival_time", "avg_score", "top_score"]
                missing_fields = [field for field in expected_fields if field not in data]
                
                if not missing_fields:
                    # Check if values are reasonable
                    if (isinstance(data["total_games"], int) and 
                        isinstance(data["avg_survival_time"], (int, float)) and
                        isinstance(data["avg_score"], (int, float)) and
                        isinstance(data["top_score"], int)):
                        self.log_result("Global Stats Endpoint", True)
                        return True
                    else:
                        self.log_result("Global Stats Endpoint", False, "Invalid data types")
                else:
                    self.log_result("Global Stats Endpoint", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Global Stats Endpoint", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_result("Global Stats Endpoint", False, f"Exception: {str(e)}")
        
        return False

    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            response = requests.options(f"{self.base_url}/api/scores", timeout=10)
            
            if response.status_code in [200, 204]:
                headers = response.headers
                if 'Access-Control-Allow-Origin' in headers:
                    self.log_result("CORS Configuration", True)
                    return True
                else:
                    self.log_result("CORS Configuration", False, "Missing CORS headers")
            else:
                self.log_result("CORS Configuration", False, f"Options request failed: {response.status_code}")
                
        except Exception as e:
            self.log_result("CORS Configuration", False, f"Exception: {str(e)}")
        
        return False

    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🧪 Starting Backend API Tests for Too Fast To Click")
        print(f"🌐 Testing endpoint: {self.base_url}")
        print("="*60)
        
        # Test API availability
        if not self.test_api_root():
            print("\n⚠️  API root endpoint failed. Continuing with other tests...")
        
        # Test score submission
        score_id = self.test_submit_score()
        if not score_id:
            print("\n⚠️  Score submission failed. Some features may not work.")
        
        # Test leaderboard
        self.test_leaderboard()
        
        # Test global stats  
        self.test_global_stats()
        
        # Test CORS
        self.test_cors_headers()
        
        # Print summary
        print("\n" + "="*60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = TooFastToClickAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())