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

export default {
  getLatestVideos,
  addVideos,
  remove,
}
