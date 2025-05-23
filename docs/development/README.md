# 개발 가이드

## 개발 환경 설정

### 필수 요구사항
- Node.js (v14 이상)
- npm 또는 pnpm
- Git

### 로컬 개발 환경 구성

1. 저장소 클론
```bash
git clone https://github.com/username/odevtube.git
cd odevtube
```

2. 의존성 설치
```bash
pnpm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 API 키와 설정 추가
```

4. 개발 서버 실행
```bash
pnpm start
```

## 코드 구조

```
odevtube/
├── cron/               # 크론 작업 스크립트
├── scripts/            # 유틸리티 스크립트
├── services/           # 백엔드 서비스
├── tests/              # 테스트 코드
├── web/                # 프론트엔드 코드
├── channels.js         # 채널 관련 기능
├── dailyDao.js         # 일일 데이터 액세스 객체
├── youtube.js          # YouTube API 연동
└── youtubeDao.js       # YouTube 데이터 액세스 객체
```

## 브랜치 전략

- `main`: 프로덕션 환경에 배포되는 안정적인 코드
- `develop`: 개발 중인 코드가 통합되는 브랜치
- `feature/*`: 새로운 기능 개발 브랜치
- `bugfix/*`: 버그 수정 브랜치
- `release/*`: 릴리스 준비 브랜치

## 코딩 컨벤션

- JavaScript 표준 스타일 가이드를 따릅니다
- Prettier를 사용하여 코드 포맷팅을 유지합니다
- 함수와 변수에는 명확한 이름을 사용합니다
- 주요 함수와 클래스에는 JSDoc 주석을 추가합니다

## 테스트

테스트는 `tests` 디렉토리에 위치하며 다음 명령으로 실행할 수 있습니다:

```bash
pnpm test
```

## Pull Request 프로세스

1. 기능 개발 또는 버그 수정 후 `develop` 브랜치로 PR을 생성합니다
2. 코드 리뷰를 통과해야 합니다
3. 모든 테스트가 통과해야 합니다
4. 승인 후 `develop` 브랜치에 병합됩니다
