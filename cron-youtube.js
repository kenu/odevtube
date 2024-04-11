import youtube from './youtube.js'
import dao from './youtubeDao.js'
import channels from './channels.js'

async function getLatestVideos(channelId) {
  try {
    const response = await youtube.activities.list({
      channelId,
      maxResults: 50, // 가져올 동영상 activity의 최대 수
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

channels['dev'][0].forEach(addVideos)
channels['dev'][1].forEach(addVideos)
channels['drama'][0].forEach(addVideos)
channels['food'][0].forEach(addVideos)
channels['kpop'][0].forEach(addVideos)

async function addVideos(channelId) {
  const videos = await getLatestVideos(channelId)
  const channel = await dao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  videos?.forEach(async (data) => {
    data.ChannelId = channel.id
    await dao.createYoutube(data)
  })
}
