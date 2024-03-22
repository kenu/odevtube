## Youtube API

- Node.js v18+
- Google Developers Console에 접속하여 새 프로젝트를 생성
  - https://console.cloud.google.com/
- YouTube Data API v3를 활성화
- 프로젝트에서 신규 API 키를 생성
  - 환경변수 YOUTUBE_API_KEY 설정
- [package.json](https://github.com/kenu/youtb/blob/main/package.json)에 youtube-api를 추가 `"googleapis": "^134.0.0"`

```
  {
    channelId: ''
    title: '00 Git 그리고 VS Code',
    videoId: 'GfccCjzhDU4',
    publishedAt: '2024-03-06T01:05:26Z'
  }
```

## DB

```sql
create database youtubedb default character set utf8mb4 collate utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON youtubedb.* TO devuser@localhost IDENTIFIED BY 'devpass';
```

## LICENSE

- MIT License
