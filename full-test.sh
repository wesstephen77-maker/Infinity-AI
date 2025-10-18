#!/bin/bash
# Infinity AI Full Test Script
# ---------------------------
BASE_URL="http://localhost:3000"
PASS="\e[32mPASS\e[0m"
FAIL="\e[31mFAIL\e[0m"

echo "🔹 Starting Infinity AI full-feature test..."

# Utility function for HTTP status check
check_status() {
  CODE=$1
  STEP=$2
  if [ "$CODE" -ge 200 ] && [ "$CODE" -lt 300 ]; then
    echo -e "$STEP: $PASS (HTTP $CODE)"
  else
    echo -e "$STEP: $FAIL (HTTP $CODE)"
  fi
}

# 1️⃣ GET all leads
STATUS=$(curl -s -o leads.json -w "%{http_code}" $BASE_URL/api/leads)
check_status $STATUS "GET /api/leads"

# 2️⃣ GET single lead (id=1)
STATUS=$(curl -s -o lead1.json -w "%{http_code}" $BASE_URL/api/leads/1)
check_status $STATUS "GET /api/leads/1"

# 3️⃣ Update lead to trigger AI email generation
STATUS=$(curl -s -X PUT $BASE_URL/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}' \
  -w "%{http_code}" -o lead1-update.json)
check_status $STATUS "PUT /api/leads/1 (status update)"

# 4️⃣ GET all emails (check baseline)
STATUS=$(curl -s -o emails.json -w "%{http_code}" $BASE_URL/api/emails)
check_status $STATUS "GET /api/emails (baseline)"

# 5️⃣ Trigger AI-generated email for another lead
STATUS=$(curl -s -X PUT $BASE_URL/api/leads/2 \
  -H "Content-Type: application/json" \
  -d '{"status":"followup"}' \
  -w "%{http_code}" -o lead2-update.json)
check_status $STATUS "PUT /api/leads/2 (AI email generation)"

# 6️⃣ GET emails again after AI generation
STATUS=$(curl -s -o emails-after.json -w "%{http_code}" $BASE_URL/api/emails)
check_status $STATUS "GET /api/emails after AI generation"

# 7️⃣ Validate AI-generated emails exist
AI_EMAIL=$(jq -r '.[] | select(.leadId==2) | .body' emails-after.json)
if [[ -n "$AI_EMAIL" ]]; then
  echo -e "AI-generated email content exists: $PASS"
  echo "Preview: ${AI_EMAIL:0:100}..."
else
  echo -e "AI-generated email content exists: $FAIL"
fi

# 8️⃣ Validate all leads have a user assigned
LEAD_USER_FAIL=0
for USER_ID in $(jq -r '.[] | .userId' leads.json); do
  if [[ "$USER_ID" == "null" ]]; then
    LEAD_USER_FAIL=1
  fi
done
if [[ $LEAD_USER_FAIL -eq 0 ]]; then
  echo -e "All leads associated with users: $PASS"
else
  echo -e "All leads associated with users: $FAIL"
fi

# 9️⃣ Validate emails are associated with leads and users
EMAIL_FAIL=0
for ROW in $(jq -c '.[]' emails-after.json); do
  LEAD=$(echo $ROW | jq -r '.leadId')
  USER=$(echo $ROW | jq -r '.userId')
  if [[ "$LEAD" == "null" ]] || [[ "$USER" == "null" ]]; then
    EMAIL_FAIL=1
  fi
done
if [[ $EMAIL_FAIL -eq 0 ]]; then
  echo -e "All emails linked to leads and users: $PASS"
else
  echo -e "All emails linked to leads and users: $FAIL"
fi

echo "✅ Full Infinity AI test completed."
echo "Check output files if needed: leads.json, emails.json, emails-after.json"

