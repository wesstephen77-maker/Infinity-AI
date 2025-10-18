#!/bin/bash
# Full Infinity AI test with debug
# Save this as full-test-debug.sh and run `chmod +x full-test-debug.sh`

BASE_URL="http://localhost:3000"

echo "🔹 Starting Infinity AI full-feature test with debug..."

# Create output directory
mkdir -p test-output

# 1️⃣ Get all leads
echo "GET /api/leads"
curl -s -w "\nHTTP STATUS: %{http_code}\n" "$BASE_URL/api/leads" -o test-output/leads.json
LEADS_STATUS=$(tail -n1 test-output/leads.json | awk '{print $3}')
if [[ "$LEADS_STATUS" == "200" ]]; then
  echo -e "GET /api/leads: \e[32mPASS\e[0m"
else
  echo -e "GET /api/leads: \e[31mFAIL\e[0m (HTTP $LEADS_STATUS)"
  cat test-output/leads.json
fi

# 2️⃣ Get a single lead
echo "GET /api/leads/1"
curl -s -w "\nHTTP STATUS: %{http_code}\n" "$BASE_URL/api/leads/1" -o test-output/lead1.json
LEAD1_STATUS=$(tail -n1 test-output/lead1.json | awk '{print $3}')
if [[ "$LEAD1_STATUS" == "200" ]]; then
  echo -e "GET /api/leads/1: \e[32mPASS\e[0m"
else
  echo -e "GET /api/leads/1: \e[31mFAIL\e[0m (HTTP $LEAD1_STATUS)"
  cat test-output/lead1.json
fi

# 3️⃣ Update lead status
echo "PUT /api/leads/1 (status update)"
curl -s -w "\nHTTP STATUS: %{http_code}\n" -X PUT "$BASE_URL/api/leads/1" \
  -H "Content-Type: application/json" \
  -d '{"status":"followed-up"}' \
  -o test-output/lead1-update.json
LEAD1_UPDATE_STATUS=$(tail -n1 test-output/lead1-update.json | awk '{print $3}')
if [[ "$LEAD1_UPDATE_STATUS" == "200" ]]; then
  echo -e "PUT /api/leads/1 (status update): \e[32mPASS\e[0m"
else
  echo -e "PUT /api/leads/1 (status update): \e[31mFAIL\e[0m (HTTP $LEAD1_UPDATE_STATUS)"
  cat test-output/lead1-update.json
fi

# 4️⃣ Get emails before AI generation
echo "GET /api/emails (baseline)"
curl -s -w "\nHTTP STATUS: %{http_code}\n" "$BASE_URL/api/emails" -o test-output/emails.json
EMAILS_STATUS=$(tail -n1 test-output/emails.json | awk '{print $3}')
if [[ "$EMAILS_STATUS" == "200" ]]; then
  echo -e "GET /api/emails (baseline): \e[32mPASS\e[0m"
else
  echo -e "GET /api/emails (baseline): \e[31mFAIL\e[0m (HTTP $EMAILS_STATUS)"
  cat test-output/emails.json
fi

# 5️⃣ Trigger AI email generation
echo "PUT /api/leads/2 (AI email generation)"
curl -s -w "\nHTTP STATUS: %{http_code}\n" -X PUT "$BASE_URL/api/leads/2" \
  -H "Content-Type: application/json" \
  -d '{"status":"followed-up"}' \
  -o test-output/lead2-update.json
LEAD2_UPDATE_STATUS=$(tail -n1 test-output/lead2-update.json | awk '{print $3}')
if [[ "$LEAD2_UPDATE_STATUS" == "200" ]]; then
  echo -e "PUT /api/leads/2 (AI email generation): \e[32mPASS\e[0m"
else
  echo -e "PUT /api/leads/2 (AI email generation): \e[31mFAIL\e[0m (HTTP $LEAD2_UPDATE_STATUS)"
  cat test-output/lead2-update.json
fi

# 6️⃣ Get emails after AI generation
echo "GET /api/emails after AI generation"
curl -s -w "\nHTTP STATUS: %{http_code}\n" "$BASE_URL/api/emails" -o test-output/emails-after.json
EMAILS_AFTER_STATUS=$(tail -n1 test-output/emails-after.json | awk '{print $3}')
if [[ "$EMAILS_AFTER_STATUS" == "200" ]]; then
  echo -e "GET /api/emails after AI generation: \e[32mPASS\e[0m"
else
  echo -e "GET /api/emails after AI generation: \e[31mFAIL\e[0m (HTTP $EMAILS_AFTER_STATUS)"
  cat test-output/emails-after.json
fi

echo "✅ Full Infinity AI debug test completed."
echo "Check JSON outputs in test-output/ for detailed responses."

