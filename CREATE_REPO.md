# GitHub 저장소 생성 방법

## 방법 1: gh CLI 사용 (권장)

### 1. GitHub CLI 로그인
```bash
# 웹 브라우저를 통한 로그인
gh auth login

# 다음 옵션 선택:
# - GitHub.com
# - HTTPS
# - Login with a web browser
# - 브라우저에서 코드 입력 후 인증
```

### 2. 저장소 생성 및 푸시
```bash
# 공개 저장소로 생성하고 바로 푸시
gh repo create quickinvoice --public --source=. --remote=origin --push

# 또는 프라이빗 저장소로 생성
gh repo create quickinvoice --private --source=. --remote=origin --push
```

## 방법 2: 수동으로 생성 후 연결

### 1. GitHub.com에서 저장소 생성
1. https://github.com/new 접속
2. Repository name: `quickinvoice`
3. Public/Private 선택
4. "Create repository" 클릭

### 2. 로컬 프로젝트와 연결
```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/quickinvoice.git

# 푸시
git push -u origin main
```

## 방법 3: gh CLI 인증 후 사용

### Personal Access Token으로 인증
```bash
# 1. GitHub에서 토큰 생성
# https://github.com/settings/tokens/new
# - repo 권한 체크
# - 토큰 복사

# 2. gh CLI에 토큰으로 로그인
gh auth login --with-token < token.txt

# 3. 저장소 생성
gh repo create quickinvoice --public --source=. --remote=origin --push
```

## 추천 명령어

인증이 완료된 후:
```bash
# 저장소 생성, 원격 설정, 푸시를 한 번에
gh repo create quickinvoice \
  --public \
  --description "웹 개발 견적서 생성기 - Next.js & React PDF" \
  --source=. \
  --remote=origin \
  --push
```

## 저장소 생성 후 Netlify 연동

1. Netlify 대시보드에서 "Add new site"
2. "Import an existing project"
3. GitHub 선택 후 `quickinvoice` 저장소 선택
4. 자동 배포 시작

---

**참고**: gh CLI가 설치되어 있지만 인증이 필요한 상태입니다. 
위 방법 중 하나를 선택하여 진행하세요.