import youtube from '../youtube.js'
import videoDao from '../dao/videoDao.js'
import channelDao from '../dao/channelDao.js'

async function getLatestVideos(channelId) {
  try {
    const response = await youtube.activities.list({
      channelId,
      maxResults: 150, // 가져올 동영상 activity의 최대 수
      order: 'date',
      part: 'snippet,contentDetails',
    })

    const videos = response.data.items.map((item) => {
      const thumbnail = item.snippet.thumbnails.medium.url
      if (!item.contentDetails.upload) {
        return null
      }
      const videoId = item.contentDetails.upload.videoId
      return {
        channelId,
        videoId,
        title: item.snippet.title,
        thumbnail,
        publishedAt: item.snippet.publishedAt,
      }
    })

    return videos.filter((video) => video)
  } catch (error) {
    console.error('Error:', error)
  }
}

async function addVideos(channelId) {
  const videos = await getLatestVideos(channelId)
  const channel = await channelDao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  for (const data of videos || []) {
    data.ChannelId = channel.id
    await videoDao.createVideo(data)
  }
}

async function remove(videoId) {
  await videoDao.removeVideo(videoId)
}

/**
 * DB에 저장된 videoId 목록을 YouTube API로 검증하여 삭제된 영상 목록을 반환
 * YouTube API는 존재하지 않는 videoId를 결과에서 제외하는 방식으로 동작함
 * @param {string[]} videoIds - 검증할 videoId 배열
 * @returns {Promise<string[]>} 삭제(비공개/제거)된 videoId 배열
 */
async function detectDeletedVideos(videoIds) {
  const BATCH_SIZE = 50 // YouTube API 한 번에 최대 50개 조회 가능
  const deletedVideoIds = []

  for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
    const batch = videoIds.slice(i, i + BATCH_SIZE)

    try {
      const response = await youtube.videos.list({
        id: batch.join(','),
        part: 'id', // id만 조회 → quota 최소화 (1 unit per batch)
      })

      const existingIds = new Set(response.data.items.map((item) => item.id))

      for (const videoId of batch) {
        if (!existingIds.has(videoId)) {
          deletedVideoIds.push(videoId)
        }
      }
    } catch (error) {
      console.error(`[detectDeletedVideos] 배치 조회 실패 (offset: ${i}):`, error.message)
    }
  }

  return deletedVideoIds
}

export default {
  getLatestVideos,
  addVideos,
  remove,
  detectDeletedVideos,
}
