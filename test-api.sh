#!/bin/bash

echo "=== 지출 내역 입력 테스트 ==="
echo "1. 스타벅스 지출 입력"
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"text": "6월 24일 스타벅스에서 6,000원 썼어"}' | jq '.'

echo -e "\n2. 교통비 지출 입력"
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"text": "오늘 지하철에서 1,350원 썼어"}' | jq '.'

echo -e "\n3. 쇼핑 지출 입력"
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"text": "마트에서 15,000원 쇼핑했어"}' | jq '.'

echo -e "\n=== 지출 내역 조회 ==="
curl http://localhost:3000/expenses | jq '.'

echo -e "\n=== 월별 통계 조회 ==="
curl http://localhost:3000/expenses/stats | jq '.'

echo -e "\n=== 전체 통계 조회 ==="
curl http://localhost:3000/expenses/stats/all | jq '.' 