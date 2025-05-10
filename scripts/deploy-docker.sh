#!/bin/zsh
. ~/.zshrc

echo "🚀 Docker 배포 시작..."

# 프로젝트 디렉토리로 이동
cd ~/git/odevtube

# 최신 코드 가져오기
git pull origin main

# Docker 컨테이너 재시작
echo "🐳 Docker 컨테이너 재시작 중..."
docker-compose down
docker-compose up -d --build

# 배포 상태 확인
echo "✅ 배포 상태 확인:"
docker-compose ps

echo "📦 Docker 배포 완료!"

# Discord 웹훅 알림 (기존 웹훅 URL 사용)
curl -X POST -H 'Content-type: application/json' --data '{"content":"🐳 Docker 배포 완료!\nhttps://mp4.okdevtv.com/"}' $WEBHOOK_DISCORD_MP4_URL
