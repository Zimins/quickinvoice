# Netlify 배포 가이드

## 배포 단계

### 1. GitHub 리포지토리 연결
1. [Netlify](https://www.netlify.com) 에 로그인
2. "Add new site" → "Import an existing project" 선택
3. GitHub 계정 연동 및 리포지토리 선택

### 2. 빌드 설정
이미 `netlify.toml` 파일이 설정되어 있으므로 자동으로 다음 설정이 적용됩니다:
- Build command: `npm run build`
- Publish directory: `out`

### 3. 환경 변수 설정 (필요한 경우)
Site settings → Environment variables에서 필요한 환경 변수 추가

### 4. 배포
- 자동 배포: main 브랜치에 push하면 자동으로 배포됨
- 수동 배포: Netlify 대시보드에서 "Trigger deploy" 클릭

## 현재 설정

### Next.js 설정 (`next.config.js`)
- `output: 'export'` - 정적 사이트 생성 모드
- `images.unoptimized: true` - 이미지 최적화 비활성화 (정적 사이트용)

### Netlify 설정 (`netlify.toml`)
- Next.js 플러그인 사용
- 빌드 명령어 및 출력 디렉토리 설정

## 주의사항

1. **정적 사이트 제한사항**
   - 서버사이드 기능 사용 불가 (API Routes, SSR, ISR 등)
   - 모든 페이지가 빌드 시점에 생성됨

2. **PDF 생성**
   - 클라이언트 사이드에서 생성되므로 문제없이 작동

3. **환경 변수**
   - 클라이언트에서 사용할 환경 변수는 `NEXT_PUBLIC_` 접두사 필요

## 로컬 테스트

배포 전 로컬에서 정적 빌드 테스트:
```bash
npm run build
npx serve out
```

## 문제 해결

1. **빌드 실패 시**
   - Node.js 버전 확인 (18.x 이상 권장)
   - 의존성 설치 확인: `npm ci`

2. **404 에러**
   - 라우팅이 제대로 작동하는지 확인
   - `next.config.js`의 `output: 'export'` 설정 확인

3. **폰트/스타일 문제**
   - 외부 리소스 (폰트, CDN) 접근 가능한지 확인
   - CORS 설정 확인