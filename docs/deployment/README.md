# 배포 가이드

## 배포 환경

ODevTube는 Docker를 사용하여 AWS EC2 인스턴스에 배포됩니다. GitHub Actions를 통한 CI/CD 파이프라인이 구성되어 있어 자동화된 빌드 및 배포가 가능합니다.

## 배포 아키텍처

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│   GitHub    │────▶│    AWS EC2   │
│ Repository  │     │   Actions   │     │    Server    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Docker    │
                                        │ Containers  │
                                        └─────────────┘
```

## 필수 요구사항

- AWS EC2 인스턴스
- Docker 및 Docker Compose 설치
- GitHub 저장소 접근 권한
- AWS 접근 키 (IAM 사용자)

## 배포 프로세스

### 수동 배포

1. 서버에 SSH 접속
```bash
ssh user@your-ec2-instance
```

2. 프로젝트 디렉토리로 이동
```bash
cd /path/to/odevtube
```

3. 최신 코드 가져오기
```bash
git pull origin main
```

4. Docker 컨테이너 빌드 및 실행
```bash
docker-compose up -d --build
```

### GitHub Actions를 통한 자동 배포

ODevTube는 GitHub Actions를 사용하여 자동 배포 파이프라인이 구성되어 있습니다. `main` 브랜치에 변경사항이 푸시되면 다음 과정이 자동으로 실행됩니다:

1. 코드 체크아웃
2. 의존성 설치
3. 테스트 실행
4. Docker 이미지 빌드
5. AWS EC2 서버에 배포

## 배포 설정 파일

### Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 4000

CMD ["pnpm", "start"]
```

### docker-compose.yml
```yaml
version: '3'
services:
  odevtube:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
    restart: always
```

### GitHub Actions 워크플로우 (.github/workflows/deploy.yml)
```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm install -g pnpm && pnpm install
        
      - name: Run tests
        run: pnpm test
        
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_PRIVATE_KEY }}
          script: |
            cd /path/to/odevtube
            git pull origin main
            docker-compose up -d --build
```

## 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수를 설정해야 합니다:

- `NODE_ENV`: 애플리케이션 환경 (production)
- `PORT`: 애플리케이션 포트
- `YOUTUBE_API_KEY`: YouTube API 키
- 기타 필요한 환경 변수

## 모니터링 및 로깅

- Docker 로그 확인:
```bash
docker-compose logs -f
```

- 애플리케이션 상태 확인:
```bash
docker-compose ps
```
