# Moneybook-BE

## 📖 프로젝트 소개

**Moneybook-BE**는 사용자가 자연어로 지출 내역을 입력하면, AI(규칙 기반 파싱)가 금액, 항목, 날짜, 카테고리를 자동 추출하여 가계부에 저장하고, 리스트 및 통계로 보여주는 백엔드 서비스입니다.

- 자연어 입력 예시: `6월 24일 스타벅스에서 6,000원 썼어`
- 카테고리 자동 분류: 식비, 교통비, 쇼핑 등
- DB: SQLite (로컬 파일)

---

## 🚀 실행 방법

1. **의존성 설치**

```bash
npm install
```

2. **서버 실행**

```bash
npm run start:dev
```

3. **API 테스트**

- cURL 또는 Postman 사용
- 또는 제공된 스크립트 실행:

```bash
./test-api.sh
```

---

## 🛠️ 주요 API

### 1. 지출 내역 입력
- **POST** `/expenses`
- **Body**: `{ "text": "6월 24일 스타벅스에서 6,000원 썼어" }`
- **Response**: 저장된 지출 내역 객체

### 2. 지출 내역 전체 조회
- **GET** `/expenses`
- **Response**: 최신순 지출 내역 리스트

### 3. 월별 통계 조회
- **GET** `/expenses/stats?year=2025&month=6`
- **Response**: 해당 월의 총합, 카테고리별 합계 등

### 4. 전체 통계 조회
- **GET** `/expenses/stats/all`
- **Response**: 전체 데이터 기준 통계

---

## 📝 예시

### 지출 입력 예시
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"text": "6월 24일 스타벅스에서 6,000원 썼어"}'
```

### 지출 리스트 조회
```bash
curl http://localhost:3000/expenses
```

### 월별 통계 조회
```bash
curl http://localhost:3000/expenses/stats?year=2025&month=6
```

### 전체 통계 조회
```bash
curl http://localhost:3000/expenses/stats/all
```

---

## ⚙️ 기술스택
- Node.js (NestJS)
- TypeORM
- SQLite

---

## 📌 참고사항
- MVP 버전에서는 로그인/회원가입, 데이터 백업, 음성/OCR 입력 등은 미지원
- 카테고리 분류는 규칙 기반(추후 AI로 확장 가능)
- DB 파일(`moneybook.db`)은 프로젝트 루트에 생성됨
