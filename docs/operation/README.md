# 운영 가이드

## 시스템 모니터링

### 서버 상태 모니터링

ODevTube 애플리케이션의 상태를 모니터링하기 위한 방법입니다:

1. Docker 컨테이너 상태 확인
```bash
docker ps
docker stats
```

2. 로그 확인
```bash
docker logs -f odevtube
```

3. 시스템 리소스 모니터링
```bash
htop
df -h
```

## 백업 및 복구

### 데이터 백업

정기적인 데이터 백업을 위한 절차:

1. 데이터베이스 백업
```bash
# 데이터베이스 백업 명령어 (사용 중인 DB에 맞게 수정)
```

2. 설정 파일 백업
```bash
cp .env .env.backup
cp docker-compose.yml docker-compose.yml.backup
```

3. 백업 파일 외부 저장소 전송
```bash
# AWS S3, Google Drive 등에 백업 파일 전송
```

### 복구 절차

시스템 장애 발생 시 복구 절차:

1. 최신 백업에서 데이터 복원
2. 애플리케이션 재시작
```bash
docker-compose down
docker-compose up -d
```

## 정기 유지보수

### 업데이트 및 패치

1. 보안 업데이트 적용
```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 이미지 업데이트
docker-compose pull
docker-compose up -d
```

2. 의존성 패키지 업데이트
```bash
pnpm update
```

### 로그 관리

1. 로그 순환 설정
```bash
# logrotate 설정 예시
```

2. 오래된 로그 정리
```bash
find /path/to/logs -name "*.log" -mtime +30 -delete
```

## 장애 대응

### 일반적인 문제 해결

1. 애플리케이션이 응답하지 않는 경우
```bash
# 컨테이너 재시작
docker-compose restart

# 로그 확인
docker-compose logs -f
```

2. 메모리 부족 문제
```bash
# 메모리 사용량 확인
free -m

# 캐시 정리
echo 3 > /proc/sys/vm/drop_caches
```

3. 디스크 공간 부족
```bash
# 디스크 사용량 확인
df -h

# 불필요한 파일 정리
docker system prune -a
```

### 에스컬레이션 절차

1. 1차 대응: 시스템 관리자
2. 2차 대응: 개발팀
3. 3차 대응: 외부 전문가 지원

## 성능 최적화

### 성능 모니터링

1. 애플리케이션 성능 지표
   - 응답 시간
   - 처리량
   - 오류율

2. 시스템 성능 지표
   - CPU 사용률
   - 메모리 사용량
   - 디스크 I/O
   - 네트워크 트래픽

### 최적화 방안

1. 캐싱 전략
2. 데이터베이스 쿼리 최적화
3. 정적 자산 최적화
4. 로드 밸런싱 구성

## 보안 관리

### 보안 점검 항목

1. 정기적인 보안 업데이트 적용
2. 방화벽 규칙 검토
3. 액세스 로그 모니터링
4. 취약점 스캔 실행

### 보안 사고 대응

1. 사고 감지 및 보고
2. 영향 평가
3. 격리 및 복구
4. 사후 분석 및 예방 조치

## API 키 관리

1. YouTube API 키 관리
   - 정기적인 키 순환
   - 사용량 모니터링
   - 할당량 관리

2. 기타 외부 서비스 인증 정보 관리
