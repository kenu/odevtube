# odevtube
- 개발자를 위한 YouTube API를 사용한 동영상 정보 조회 서비스

## Prerequisites

- Docker
- Docker Compose
- Node.js v18+
- Video API
  - Google Developers Console에 접속하여 새 프로젝트를 생성
    - https://console.cloud.google.com/
  - YouTube Data API v3를 활성화
  - 프로젝트에서 신규 API 키를 생성

## Build and Run

- .env 파일을 생성하고 YOUTUBE_API_KEY를 설정 # .env.example 참고
- docker compose를 사용하여 MariaDB 실행
```sh
cd docker compose
docker compose up -d
```
- web 폴더에서 npm install 후 npm run dev 실행
```sh
cd web
npm install
npm run dev
```

## Batch

- 1시간마다 cron으로 실행

## LICENSE

- MIT License
