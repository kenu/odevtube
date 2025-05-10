# Docker를 이용한 ODevTube 배포 가이드

이 문서는 Docker와 Docker Compose를 사용하여 ODevTube 애플리케이션을 배포하는 방법을 설명합니다.

## 사전 요구사항

- [Docker](https://docs.docker.com/get-docker/) 설치
- [Docker Compose](https://docs.docker.com/compose/install/) 설치

## 배포 단계

### 1. 환경 변수 설정

`.env.example` 파일을 `.env` 파일로 복사하고 필요한 환경 변수를 설정합니다:

```bash
cp .env.example .env
```

그리고 `.env` 파일을 열어 다음 값들을 설정합니다:
- `GITHUB_CLIENT_ID`: GitHub OAuth 애플리케이션의 클라이언트 ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 애플리케이션의 클라이언트 시크릿
- 필요한 경우 다른 환경 변수들도 수정

### 2. Docker 이미지 빌드 및 컨테이너 실행

다음 명령어로 Docker 이미지를 빌드하고 컨테이너를 실행합니다:

```bash
docker-compose up -d
```

이 명령어는 백그라운드에서 애플리케이션과 데이터베이스를 실행합니다.

### 3. 애플리케이션 접속

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인합니다.

## 관리 명령어

### 로그 확인

```bash
docker-compose logs -f app
```

### 컨테이너 중지

```bash
docker-compose down
```

### 컨테이너 재시작

```bash
docker-compose restart
```

### 이미지 재빌드 및 컨테이너 재시작

코드를 변경한 후 이미지를 재빌드하고 컨테이너를 재시작하려면:

```bash
docker-compose up -d --build
```

## 데이터베이스 백업 및 복원

### 데이터베이스 백업

```bash
docker exec -it odevtube_db_1 mysqldump -u odevtube -podevtube_password odevtube > backup.sql
```

### 데이터베이스 복원

```bash
cat backup.sql | docker exec -i odevtube_db_1 mysql -u odevtube -podevtube_password odevtube
```

## 프로덕션 배포 시 고려사항

1. 보안을 위해 프로덕션 환경에서는 강력한 비밀번호를 사용하세요.
2. HTTPS를 설정하여 통신을 암호화하세요.
3. 정기적으로 데이터베이스를 백업하세요.
4. 컨테이너 오케스트레이션 도구(예: Kubernetes)를 고려하세요.
