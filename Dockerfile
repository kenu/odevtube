FROM node:20-alpine

WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# 웹 애플리케이션 의존성 설치
COPY web/package*.json ./web/
RUN cd web && npm install

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production

# 포트 노출
EXPOSE 4000

# 앱 실행
CMD ["node", "web/bin/odevtube.js"]
