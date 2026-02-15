#!/usr/bin/env python3
"""
Backend API Testing for True or Totally Fake Trivia Game
Tests all API endpoints using the public URL
"""

import requests
import json
import time
import sys
from datetime import datetime

# Use public endpoint for testing
BASE_URL = "https://trivia-rush-3.preview.emergentagent.com/api"

class TriviaAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def run_test(self, name, method, endpoint, expected_status=200, data=None, timeout=30):
        """Run a single API test"""
        url = f"{BASE_URL}/{endpoint}"
        self.tests_run += 1
        self.log(f"Testing {name} - {method} {endpoint}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, timeout=timeout)
            elif method == 'POST':
                response = self.session.post(url, json=data, timeout=timeout)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}", "ERROR")
                try:
                    error_detail = response.json()
                    self.log(f"   Error details: {error_detail}", "ERROR")
                except:
                    self.log(f"   Response text: {response.text[:200]}", "ERROR")
                return False, {}
                
        except requests.Timeout:
            self.log(f"❌ {name} - Request timeout after {timeout}s", "ERROR")
            return False, {}
        except Exception as e:
            self.log(f"❌ {name} - Error: {str(e)}", "ERROR")
            return False, {}
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "")
    
    def test_categories_endpoint(self):
        """Test categories endpoint"""
        success, data = self.run_test("Get Categories", "GET", "categories")
        if success and 'categories' in data:
            categories = data['categories']
            if len(categories) == 6:
                self.log(f"✅ Found all 6 categories: {[c['name'] for c in categories]}")
                # Verify specific categories exist
                category_ids = [c['id'] for c in categories]
                expected_ids = ['animals', 'geography', 'history', 'food', 'space', 'pop_culture']
                missing = set(expected_ids) - set(category_ids)
                if not missing:
                    self.log("✅ All expected category IDs found")
                    return True, categories
                else:
                    self.log(f"❌ Missing category IDs: {missing}", "ERROR")
            else:
                self.log(f"❌ Expected 6 categories, got {len(categories)}", "ERROR")
        return success, data
    
    def test_question_generation(self):
        """Test question generation with different parameters"""
        test_cases = [
            {"category": "animals", "difficulty": "chill", "description": "Animals - Chill"},
            {"category": "geography", "difficulty": "spicy", "description": "Geography - Spicy"}, 
            {"category": "history", "difficulty": "savage", "description": "History - Savage"},
            {"category": "mix", "difficulty": "spicy", "description": "Mix - Spicy"},
        ]
        
        all_success = True
        questions = []
        
        for test_case in test_cases:
            self.log(f"Testing question generation: {test_case['description']}")
            success, data = self.run_test(
                f"Generate Question ({test_case['description']})", 
                "POST", 
                "questions/generate",
                200,
                {
                    "category": test_case["category"],
                    "difficulty": test_case["difficulty"],
                    "exclude_ids": []
                },
                timeout=45  # Give more time for LLM generation
            )
            
            if success and data:
                # Verify question structure
                required_fields = ['id', 'statement', 'is_true', 'explanation', 'category', 'difficulty', 'confidence']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.log(f"✅ Question structure valid - Statement: '{data['statement'][:50]}...'")
                    self.log(f"   Category: {data['category']}, Difficulty: {data['difficulty']}, Is True: {data['is_true']}")
                    questions.append(data)
                else:
                    self.log(f"❌ Missing fields in question: {missing_fields}", "ERROR")
                    all_success = False
            else:
                all_success = False
                
            # Small delay between requests
            time.sleep(2)
            
        return all_success, questions
    
    def test_question_generation_edge_cases(self):
        """Test question generation edge cases"""
        test_cases = [
            {"category": "invalid_category", "difficulty": "spicy", "expected_status": 400, "description": "Invalid Category"},
            {"category": "animals", "difficulty": "invalid_diff", "expected_status": 200, "description": "Invalid Difficulty (should use default)"},
        ]
        
        for test_case in test_cases:
            self.run_test(
                f"Edge Case - {test_case['description']}",
                "POST",
                "questions/generate", 
                test_case["expected_status"],
                {
                    "category": test_case["category"],
                    "difficulty": test_case["difficulty"]
                }
            )
    
    def test_question_batch(self):
        """Test batch question endpoint"""
        success, data = self.run_test(
            "Get Question Batch",
            "GET", 
            "questions/batch?category=animals&difficulty=spicy&count=3",
            timeout=60  # Batch generation may take longer
        )
        
        if success and 'questions' in data:
            questions = data['questions']
            if len(questions) <= 3:  # May be less if not enough cached questions
                self.log(f"✅ Batch endpoint returned {len(questions)} questions")
                return True, questions
            else:
                self.log(f"❌ Expected max 3 questions, got {len(questions)}", "ERROR")
        
        return success, data
    
    def test_save_session(self):
        """Test saving game session"""
        session_data = {
            "category": "animals",
            "difficulty": "spicy", 
            "streak": 5,
            "accuracy": 75.5,
            "questions_answered": 8
        }
        
        success, data = self.run_test(
            "Save Game Session",
            "POST",
            "sessions",
            200,
            session_data
        )
        
        if success and data:
            required_fields = ['id', 'category', 'difficulty', 'streak', 'accuracy', 'questions_answered']
            missing_fields = [field for field in required_fields if field not in data]
            if not missing_fields:
                self.log(f"✅ Session saved with ID: {data['id']}")
                return True, data
            else:
                self.log(f"❌ Missing fields in saved session: {missing_fields}", "ERROR")
        
        return success, data
    
    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        return self.run_test("Get Leaderboard", "GET", "leaderboard?limit=5")
    
    def test_stats(self):
        """Test stats endpoint"""
        success, data = self.run_test("Get Stats", "GET", "stats")
        
        if success and data:
            expected_fields = ['total_questions', 'total_sessions', 'questions_by_category']
            missing_fields = [field for field in expected_fields if field not in data]
            if not missing_fields:
                self.log(f"✅ Stats: {data['total_questions']} questions, {data['total_sessions']} sessions")
                return True, data
            else:
                self.log(f"❌ Missing stats fields: {missing_fields}", "ERROR")
        
        return success, data

def main():
    print("=" * 60)
    print("STARTING BACKEND API TESTS")
    print("=" * 60)
    
    tester = TriviaAPITester()
    
    # Test basic connectivity
    tester.log("Testing basic API connectivity...")
    if not tester.test_root_endpoint()[0]:
        tester.log("❌ Cannot connect to API. Stopping tests.", "CRITICAL")
        return 1
    
    # Test categories
    tester.log("\nTesting categories endpoint...")
    tester.test_categories_endpoint()
    
    # Test question generation (most important)
    tester.log("\nTesting question generation...")
    question_success, questions = tester.test_question_generation()
    if not question_success:
        tester.log("❌ Question generation failed. This is critical for gameplay.", "CRITICAL")
    
    # Test edge cases
    tester.log("\nTesting edge cases...")
    tester.test_question_generation_edge_cases()
    
    # Test batch questions
    tester.log("\nTesting batch questions...")
    tester.test_question_batch()
    
    # Test session saving
    tester.log("\nTesting session saving...")
    tester.test_save_session()
    
    # Test other endpoints
    tester.log("\nTesting additional endpoints...")
    tester.test_leaderboard()
    tester.test_stats()
    
    # Print final results
    print("\n" + "=" * 60)
    print("BACKEND TEST RESULTS")
    print("=" * 60)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        failed = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())