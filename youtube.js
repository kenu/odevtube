import { google } from 'googleapis'
import dao from './youtubeDao.js'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // 생성한 API 키를 여기에 입력합니다.
})

async function getLatestVideos(channelId) {
  try {
    const response = await youtube.search.list({
      channelId: channelId,
      maxResults: 3, // 가져올 동영상의 최대 수
      order: 'date', // 최신 순으로 정렬
      part: 'snippet', // 필요한 정보를 지정합니다.
    })

    const videos = response.data.items.map((item) => {
      return {
        channelId,
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
      }
    })

    return videos
  } catch (error) {
    console.error('Error:', error)
  }
}

const channels = [
  // 'UCQNE2JmbasNYbjGAcuBiRRg',
  // 'UCajnLt9NyrPI8txIiefinzw',
  // 'UCHbXBo1fQAg7j0D7HKKYHJg',
  // 'UCCv0FlNbZYXlnP9Mt8dXeLQ',
  // 'UCMt-NBCvJyDbn495ZvDV0dw',
  // 'UCslowKauYSj_RqgB-EuSgmw',
  // 'UCS0F25vig_sPIQXMiK8IdSg',
  'UCzA62wwyiLnVnqFP4VEUOZg',
  'UCDh8zEDofOcrOMAOnSVL9Tg',
  'UCrvqts66Jo2gKGZdp_h_QkQ',
  'UCxZ2AlaT0hOmxzZVbF_j_Sw',
  'UCFDbz39kFPvU0AUpgHx4ICw',
  'UCZ3dxObRPEJzoryEyQqmhWg',
  'UCqcqc3TH6KTfGrLwGh__73g',
  'UCSLrpBAzr-ROVGHQ5EmxnUg',
]
// 채널 ID를 입력하여 실행합니다.
channels.forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  videos.forEach((data) => {
    dao.create(data)
  })
})
