# Netlify 서버 기능 가이드

## Netlify Functions (서버리스 함수)

### 1. 기본 개념
- AWS Lambda 기반 서버리스 함수
- `/netlify/functions/` 디렉토리에 함수 파일 생성
- JavaScript/TypeScript 지원

### 2. 제한사항
- **실행 시간**: 10초 (무료), 26초 (Pro)
- **메모리**: 1024MB
- **요청 크기**: 6MB
- **응답 크기**: 6MB
- **월 실행 횟수**: 125,000회 (무료), 무제한 (Pro)

### 3. Next.js API Routes와의 차이점

#### Netlify Functions 예제:
```javascript
// netlify/functions/create-invoice.js
exports.handler = async (event, context) => {
  const { body } = event;
  const data = JSON.parse(body);
  
  // 데이터베이스 저장, 이메일 발송 등
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'Invoice created',
      id: 'INV-001' 
    })
  };
};
```

#### Next.js API Routes (Vercel):
```javascript
// app/api/create-invoice/route.js
export async function POST(request) {
  const data = await request.json();
  
  // 더 유연한 처리 가능
  
  return Response.json({ 
    message: 'Invoice created',
    id: 'INV-001' 
  });
}
```

## 서버 기능이 필요한 경우별 솔루션

### 1. 데이터베이스 연동
**Netlify Functions + 외부 DB**
```javascript
// netlify/functions/get-invoices.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event) => {
  const invoices = await prisma.invoice.findMany();
  
  return {
    statusCode: 200,
    body: JSON.stringify(invoices)
  };
};
```

### 2. 이메일 발송
**Netlify Functions + SendGrid**
```javascript
// netlify/functions/send-invoice.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  const { email, pdfUrl } = JSON.parse(event.body);
  
  const msg = {
    to: email,
    from: 'invoice@company.com',
    subject: '견적서 발송',
    html: `<p>견적서를 확인해주세요: <a href="${pdfUrl}">다운로드</a></p>`,
  };
  
  await sgMail.send(msg);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

### 3. 파일 업로드/저장
**제한적 - 대안 필요**
- Netlify Functions는 임시 파일만 처리 가능
- 영구 저장은 외부 서비스 (S3, Cloudinary) 필요

### 4. 실시간 기능
**불가능 - 대안 필요**
- WebSocket 지원 안 함
- 대안: Pusher, Ably, Supabase Realtime

## 권장 아키텍처

### 1. 하이브리드 접근
```
┌─────────────────┐     ┌──────────────────┐
│  Netlify (정적) │     │ 외부 서비스      │
│  - React App    │────▶│ - Supabase (DB)  │
│  - PDF 생성     │     │ - SendGrid       │
│  - UI/UX        │     │ - Cloudinary     │
└─────────────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐
│ Netlify Func.   │
│ - API Gateway   │
│ - 인증 처리     │
│ - 데이터 검증   │
└─────────────────┘
```

### 2. Next.js Edge Functions (실험적)
```javascript
// netlify.toml 추가 설정
[[edge_functions]]
  path = "/api/*"
  function = "api-handler"
```

## Vercel과 비교

| 기능 | Netlify | Vercel |
|------|---------|---------|
| API Routes | Netlify Functions | Native Next.js API |
| 실행 시간 | 10초 (무료) | 10초 (무료) |
| 파일 시스템 | 읽기 전용 | 임시 쓰기 가능 |
| 데이터베이스 | 외부 연동 | Vercel Postgres/KV |
| 실시간 | 불가능 | 제한적 가능 |
| 가격 | 저렴 | 비쌈 |

## 추천 시나리오

### Netlify 유지
- 간단한 CRUD API
- 이메일 발송
- 외부 서비스 연동
- 비용 절감 중요

### Vercel 전환 고려
- 복잡한 서버 로직
- Next.js 전체 기능 활용
- 실시간 기능 필요
- 통합 데이터베이스 필요

## 마이그레이션 준비

### 1. 현재 설정 백업
```bash
# 정적 사이트 모드 해제
# next.config.js에서 output: 'export' 제거
```

### 2. API 폴더 구조
```
app/
├── api/
│   ├── invoices/
│   │   └── route.js
│   └── email/
│       └── route.js
```

### 3. 환경 변수
```
# Netlify
NETLIFY_FUNCTION_URL=/.netlify/functions

# Vercel
NEXT_PUBLIC_API_URL=/api
```