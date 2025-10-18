#!/bin/bash
# ---------------------------------------------
# Infinity AI Full-Feature Debug Test Script
# ---------------------------------------------
# This script tests all API endpoints and AI features
# Prints HTTP status + response, simple PASS/FAIL
# ---------------------------------------------

BASE_URL="http://localhost:3000"

echo "🔹 Starting Infinity AI full-feature debug test..."

# Helper function to test endpoints
function test_endpoint() {
    METHOD=$1
    URL=$2
    DESC=$3
    DATA=$4

    if [ "$METHOD" == "GET" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" "$URL")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X "$METHOD" -H "Content-Type: application/json" -d "$DATA" "$URL")
    fi

    BODY=$(echo "$RESPONSE" | sed '$d')
    STATUS=$(echo "$RESPONSE" | tail -n1)

    echo -e "\n$DESC"
    echo "URL: $URL"
    echo "HTTP STATUS: $STATUS"
    echo "Response:"
    echo "$BODY"

    if [ "$STATUS" -ge 200 ] && [ "$STATUS" -lt 300 ]; then
        echo -e "$DESC: \e[32mPASS\e[0m"
    else
        echo -e "$DESC: \e[31mFAIL\e[0m"
    fi
}

# 1️⃣ Get all leads
test_endpoint "GET" "$BASE_URL/api/leads" "GET /api/leads"

# 2️⃣ Get a single lead
test_endpoint "GET" "$BASE_URL/api/leads/1" "GET /api/leads/1"

# 3️⃣ Update a lead status
UPDATE_DATA='{"status":"followed-up"}'
test_endpoint "PUT" "$BASE_URL/api/leads/1" "PUT /api/leads/1 (status update)" "$UPDATE_DATA"

# 4️⃣ Get all emails
test_endpoint "GET" "$BASE_URL/api/emails" "GET /api/emails (baseline)"

# 5️⃣ Trigger AI email generation
test_endpoint "PUT" "$BASE_URL/api/leads/2" "PUT /api/leads/2 (AI email generation)"

# 6️⃣ Get all emails after AI generation
test_endpoint "GET" "$BASE_URL/api/emails" "GET /api/emails after AI generation"

echo -e "\n✅ Full Infinity AI debug test completed."
echo "Check the responses above to verify AI-generated content and endpoint behavior."

