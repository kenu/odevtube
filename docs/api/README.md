# API 문서

## API 개요

ODevTube는 YouTube 채널 및 동영상 데이터에 접근할 수 있는 RESTful API를 제공합니다. 이 문서는 API의 엔드포인트, 요청 및 응답 형식, 그리고 사용 예시를 설명합니다.

## 기본 URL

```
https://api.odevtube.com/v1
```

## 인증

API 요청에는 인증이 필요할 수 있습니다. 인증 방식은 다음과 같습니다:

```
Authorization: Bearer <API_KEY>
```

## 엔드포인트

### 채널 관련 API

#### 채널 목록 조회

```
GET /channels
```

**요청 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | integer | 아니오 | 페이지 번호 (기본값: 1) |
| limit | integer | 아니오 | 페이지당 항목 수 (기본값: 20, 최대: 100) |
| category | string | 아니오 | 카테고리별 필터링 |

**응답 예시**

```json
{
  "status": "success",
  "data": {
    "channels": [
      {
        "id": "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
        "title": "Channel Name",
        "description": "Channel description",
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "subscriberCount": 1000000,
        "videoCount": 500,
        "category": "programming"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

#### 특정 채널 조회

```
GET /channels/{channelId}
```

**응답 예시**

```json
{
  "status": "success",
  "data": {
    "channel": {
      "id": "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
      "title": "Channel Name",
      "description": "Channel description",
      "thumbnailUrl": "https://example.com/thumbnail.jpg",
      "subscriberCount": 1000000,
      "videoCount": 500,
      "category": "programming",
      "createdAt": "2010-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

### 동영상 관련 API

#### 채널별 동영상 목록 조회

```
GET /channels/{channelId}/videos
```

**요청 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | integer | 아니오 | 페이지 번호 (기본값: 1) |
| limit | integer | 아니오 | 페이지당 항목 수 (기본값: 20, 최대: 100) |
| sort | string | 아니오 | 정렬 기준 (publishedAt, viewCount) |
| order | string | 아니오 | 정렬 순서 (asc, desc) |

**응답 예시**

```json
{
  "status": "success",
  "data": {
    "videos": [
      {
        "id": "dQw4w9WgXcQ",
        "title": "Video Title",
        "description": "Video description",
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "publishedAt": "2023-01-01T00:00:00Z",
        "viewCount": 10000000,
        "likeCount": 500000,
        "duration": "PT4M20S"
      }
    ],
    "pagination": {
      "total": 500,
      "page": 1,
      "limit": 20,
      "pages": 25
    }
  }
}
```

#### 특정 동영상 조회

```
GET /videos/{videoId}
```

**응답 예시**

```json
{
  "status": "success",
  "data": {
    "video": {
      "id": "dQw4w9WgXcQ",
      "channelId": "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
      "title": "Video Title",
      "description": "Video description",
      "thumbnailUrl": "https://example.com/thumbnail.jpg",
      "publishedAt": "2023-01-01T00:00:00Z",
      "viewCount": 10000000,
      "likeCount": 500000,
      "commentCount": 100000,
      "duration": "PT4M20S",
      "tags": ["programming", "tutorial"]
    }
  }
}
```

### 카테고리 관련 API

#### 카테고리 목록 조회

```
GET /categories
```

**응답 예시**

```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "programming",
        "name": "Programming",
        "description": "Programming tutorials and guides",
        "channelCount": 50
      }
    ]
  }
}
```

## 오류 응답

API 요청이 실패하면 다음과 같은 형식의 오류 응답이 반환됩니다:

```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

**오류 코드**

| 코드 | 설명 |
|------|------|
| BAD_REQUEST | 잘못된 요청 파라미터 |
| UNAUTHORIZED | 인증 실패 |
| FORBIDDEN | 접근 권한 없음 |
| NOT_FOUND | 리소스를 찾을 수 없음 |
| INTERNAL_SERVER_ERROR | 서버 내부 오류 |

## 사용 예시

### cURL

```bash
curl -X GET "https://api.odevtube.com/v1/channels?category=programming" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### JavaScript

```javascript
fetch('https://api.odevtube.com/v1/channels?category=programming', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
