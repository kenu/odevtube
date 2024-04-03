import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // 생성한 API 키를 여기에 입력합니다.
})

export default youtube
