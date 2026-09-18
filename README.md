# ODevTube

개발자를 위한 YouTube 채널 큐레이션 플랫폼

## 주요 기능

### 1. 카테고리별 비디오 큐레이션
- **개발(dev)**: 프로그래밍, 개발 관련 영상
- **요리(food)**: 요리 관련 영상
- **K-POP**: K-POP 관련 영상
- **배우(actor)**: 배우 관련 영상
- 한국어/영어 다국어 지원

### 2. 사용자 맞춤 채널 관리
- GitHub OAuth 로그인
- 개인 YouTube 채널 등록 및 관리
- `/@username` 형식의 개인 피드 페이지
- 채널별 최신 비디오 자동 수집

### 3. 채널 공개 여부 관리 🆕
- **Public/Private 토글 기능**
  - 🌍 Public: 모든 사용자에게 공개
  - 🔒 Private: 본인에게만 보임
- 채널 관리 페이지(`/@username/manage`)에서 즉시 전환 가능
- 개인 정보 보호 및 콘텐츠 큐레이션 자유도 향상

### 4. 구독 티어
- **Free Tier**: 최대 5개 채널 등록
- **Premium Tier**: 무제한 채널 등록 (Stripe 결제 연동)

### 5. 통계 및 분석
- 전체 비디오/채널 통계
- 연도별/월별 비디오 통계
- 카테고리별 분포
- 인기 채널 Top 10

## 설치 및 실행

### 사전 요구사항
- Node.js v18+
- MariaDB
- YouTube Data API v3 키
- GitHub OAuth App 설정

### 1. YouTube API 설정
- Google Developers Console에 접속하여 새 프로젝트 생성
  - https://console.cloud.google.com/
- YouTube Data API v3 활성화
- API 키 생성
  - 환경변수 `YOUTUBE_API_KEY` 설정

### 2. GitHub OAuth 설정
- https://github.com/settings/developers
- New OAuth App 생성
- `GITHUB_CLIENT_ID` 및 `GITHUB_CLIENT_SECRET` 환경변수 설정

### 3. 데이터베이스 설정
```bash
cd docker-compose
docker-compose up -d
```

또는 직접 설정:
```sql
create database odevtube default character set utf8mb4 collate utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON odevtube.* TO devuser@localhost IDENTIFIED BY 'devpass';
```

데이터베이스 마이그레이션:
```bash
node migrate-channels.js
```

### 4. 환경 변수 설정
`web/.env` 파일 생성 (`.env.sample` 참고):
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
HOST=http://localhost:4000
YOUDB_NAME=odevtube
YOUDB_USER=devuser
YOUDB_PASS=devpass
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_GTAG=your_gtag
YOUTUBE_SENTRY=your_sentry
YOUTUBE_WCS=your_wcs
WEBHOOK_DISCORD_MP4_URL=your_webhook_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
```

### 5. 의존성 설치 및 실행
```bash
# 루트 디렉토리
npm install

# web 디렉토리
cd web
npm install
npm run dev
```

서버는 `http://localhost:4000`에서 실행됩니다.

## API 응답 예시

```javascript
{
  channelId: 'UCsvqVGtbbyHaMoevxPAq9Fg',
  title: '00 Git 그리고 VS Code',
  videoId: 'GfccCjzhDU4',
  publishedAt: '2024-03-06T01:05:26Z'
}
```

## 주요 라우트

- `/` - 개발 비디오 홈페이지 (한국어)
- `/en` - 개발 비디오 홈페이지 (영어)
- `/food` - 요리 비디오
- `/kpop` - K-POP 비디오
- `/actor` - 배우 비디오
- `/login` - GitHub 로그인
- `/@username` - 사용자 피드
- `/@username/manage` - 채널 관리 (Public/Private 토글 포함)
- `/statistics` - 통계 페이지

## 기술 스택

- **Backend**: Node.js, Express
- **Database**: MariaDB, Sequelize ORM
- **Authentication**: Passport.js (GitHub OAuth)
- **Payment**: Stripe
- **YouTube API**: Google APIs
- **View Engine**: EJS
- **AI**: Google Gemini (요약 기능)

## 데이터베이스 스키마

- `Accounts` - 사용자 정보
- `Channels` - YouTube 채널 정보 (isPublic, accountId 포함)
- `Videos` - 비디오 정보
- `UserVideos` - 사용자-비디오 관계
- `UserChannels` - 사용자-채널 관계

## LICENSE

MIT License
