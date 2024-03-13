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
  [
    'UCQNE2JmbasNYbjGAcuBiRRg',
    'UCajnLt9NyrPI8txIiefinzw',
    'UCHbXBo1fQAg7j0D7HKKYHJg',
    'UCCv0FlNbZYXlnP9Mt8dXeLQ',
    'UCMt-NBCvJyDbn495ZvDV0dw',
    'UCslowKauYSj_RqgB-EuSgmw',
    'UCS0F25vig_sPIQXMiK8IdSg',
    'UCzA62wwyiLnVnqFP4VEUOZg',
    'UCDh8zEDofOcrOMAOnSVL9Tg',
    'UCrvqts66Jo2gKGZdp_h_QkQ',
    'UCxZ2AlaT0hOmxzZVbF_j_Sw',
    'UCTBVYQc1ZVDbAZcm1J_pniA',
    // 'UCFDbz39kFPvU0AUpgHx4ICw',
    'UCZ3dxObRPEJzoryEyQqmhWg',
    'UCqcqc3TH6KTfGrLwGh__73g',
    'UCSLrpBAzr-ROVGHQ5EmxnUg',
    'UCp-vBtwvBmDiGqjvLjChaJw',
    'UCn9oaGNfb_jvaZbe2VKDCtA',
    'UCvc8kv-i5fvFTJBFAk6n1SA',
    'UC0Y0T9JpgIBbyGDjvy9PbOg',
    'UC5-ixpj8DioZqmrasj6Ihpw',
    'UCfWUDYYuWDxWfBLjauoQy-A',
    'UCs9b4KWMdDXsM99IU15i3ew',
    'UCFA9XVr5KlHZ7yW4H93udAA',
    'UCKa3iUq4Sfcd0iKI0wkNsNg',
    'UCSrjdbuapuPNTK8wyh6W4sA',
    'UCUpJs89fSBXNolQGOYKn0YQ',
    'UC63J0Q5huHSlbNT3KxvAaHQ',
    'UCBtG00ljZ8R_DBQCTR4C00A',
    'UCO7g158NWgLyn98z8v3zduA',
    'UCvm-qPSlO92qnHBDHqsLr7g',
    'UC9PB9nKYqKEx_N3KM-JVTpg',
    'UCGg-85bxjGRh45BPBdmYmfw',
    'UCdNSo3yB5-FRTFGbUNKNnwQ',
    'UCSEOUzkGNCT_29EU_vnBYjg',
    'UC-mOekGSesms0agFntnQang',
    'UCiz4XbP6DOEC7UZiMRAgq1Q',
    'UC0uDM1xZMNBAoW2xnzhAQ7g',
    'UCSWVilNemHmjQF7alFfoDUw',
    'UCdGTtaI-ERLjzZNLuBj3X6A',
    'UC-mOekGSesms0agFntnQang',
    'UC_XI3ByFO1uZIIH-g-zJZiw',
    'UC5pBkQjap4TW-LJryKZQegQ',
    'UC31Gc42xzclOOi5Gp1xIpZw',
    'UCPdTFQUHzAzFobngtw1sFKg',
    'UChflhu32f5EUHlY7_SetNWw',
    'UCOB_NlfphKSQWwR6gcADhtQ',
    'UCebXwimGkd5YrhPV7vmqKgA',
    'UCwhiiipYzihCAL9cyHwa3aA',
    'UCwbg0dHtGEdLJWATaWJv96Q',
    'UCuynXsGvMXLviyqVMeS2y-g',
  ],
  [
    'UCbs5mo-4A3ZyhZBA9JhPyfg',
    'UCOxWrX5MIdXIeRNaXC3sqIg',
    'UCsvqVGtbbyHaMoevxPAq9Fg',
    'UCd6MoB9NC6uYN2grvUNT-Zg',
    'UCZgt6AzoyjslHTC9dz0UoTw',
    'UCMm15RFnHUvM-aSc50e7R9A',
    'UC4ogdcPcIAOOMJktgBMhQnQ',
    'UCP7uiEZIqci43m22KDl0sNw',
    'UCFbNIlppjAuEX4znoulh0Cw',
    'UCsBjURrPoezykLs9EqgamOA',
    'UC8butISFwT-Wl7EV0hUK0BQ',
    'UCsMica-v34Irf9KVTh6xx-g',
    'UC7c3Kb6jYCRj4JOHHZTxKsQ',
    'UC7yfnfvEUlXUIfm8rGLwZdA',
    'UCVHFbqXqoYvEWM1Ddxl0QDg',
    'UClNqqd-IGoaEERpriY4CNgQ',
    'UCTHcgWOTU6gPje1g_U29tfQ',
  ],
]
// 채널 ID를 입력하여 실행합니다.
channels[0].forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  videos?.forEach((data) => {
    dao.create(data)
  })
})

channels[1].forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  videos?.forEach((data) => {
    dao.createen(data)
  })
})

