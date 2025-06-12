# GitHub 및 Netlify 배포 가이드

## 1. GitHub 리포지토리 생성

### GitHub에서 새 리포지토리 생성
1. [GitHub](https://github.com)에 로그인
2. 오른쪽 상단 '+' 버튼 → "New repository" 클릭
3. Repository 설정:
   - Repository name: `quickinvoice`
   - Description: "웹 개발 견적서 생성기 - Web Development Quote Generator"
   - Public/Private 선택
   - "Create repository" 클릭

### 로컬 프로젝트와 연결
```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/quickinvoice.git

# 브랜치 이름 확인 및 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 2. Netlify 배포

### Netlify에서 GitHub 리포지토리 연결
1. [Netlify](https://app.netlify.com) 로그인
2. "Add new site" → "Import an existing project" 클릭
3. "Deploy with GitHub" 선택
4. GitHub 계정 인증 및 리포지토리 선택

### 배포 설정 확인
`netlify.toml` 파일이 있으므로 자동으로 설정됨:
- Build command: `npm run build`
- Publish directory: `out`

### 배포 시작
"Deploy site" 버튼을 클릭하면 자동으로 빌드 및 배포가 시작됩니다.

## 3. 배포 후 확인사항

### 사이트 URL
- Netlify가 자동으로 생성한 URL (예: `https://amazing-site-123.netlify.app`)
- Site settings에서 커스텀 도메인 설정 가능

### 빌드 상태 확인
- Netlify 대시보드에서 빌드 로그 확인
- 빌드 실패 시 에러 메시지 확인

## 4. 지속적 배포

### 자동 배포
main 브랜치에 푸시하면 자동으로 재배포됩니다:
```bash
git add .
git commit -m "Update features"
git push origin main
```

### 브랜치 배포
다른 브랜치도 자동으로 프리뷰 URL이 생성됩니다:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

## 5. 트러블슈팅

### 빌드 실패 시
1. Node.js 버전 확인 (18.x 이상 필요)
2. 의존성 설치 확인: `npm ci`
3. 빌드 명령어 로컬 테스트: `npm run build`

### 404 에러
- `next.config.js`의 `output: 'export'` 설정 확인
- 정적 파일 경로 확인

### 한글 폰트 문제
- PDF 생성 시 Nanum Gothic 폰트가 Google Fonts CDN에서 로드되는지 확인