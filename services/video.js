import youtube from '../youtube.js'
import dao from '../youtubeDao.js'

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
  const channel = await dao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  videos?.forEach(async (data) => {
    data.ChannelId = channel.id
    await dao.createVideo(data)
  })
}

async function remove(videoId) {
  await dao.removeVideo(videoId)
}

export default {
  getLatestVideos,
  addVideos,
  remove,
}
