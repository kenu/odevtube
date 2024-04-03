import youtube from './youtube.js'
import dao from './youtubeDao.js'
import channels from './channels.js'

async function getLatestVideos(channelId) {
  try {
    const response = await youtube.activities.list({
      channelId: channelId,
      maxResults: 50, // 가져올 동영상의 최대 수
      order: 'date', // 최신 순으로 정렬
      part: 'snippet,contentDetails', // 필요한 정보를 지정합니다.
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

// 채널 ID를 입력하여 실행합니다.
channels['dev'][0].forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  const channel = await dao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  videos?.forEach(async (data) => {
    data.ChannelId = channel.id
    await dao.createYoutube(data)
  })
})

channels['dev'][1].forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  const channel = await dao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  videos?.forEach(async (data) => {
    data.ChannelId = channel.id
    await dao.createYoutube(data)
  })
})

channels['drama'][0].forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  const channel = await dao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  videos?.forEach(async (data) => {
    data.ChannelId = channel.id
    await dao.createYoutube(data)
  })
})

channels['food'][0].forEach(async (channelId) => {
  const videos = await getLatestVideos(channelId)
  const channel = await dao.findOneByChannelId(channelId)
  if (!channel) {
    return
  }
  videos?.forEach(async (data) => {
    data.ChannelId = channel.id
    await dao.createYoutube(data)
  })
})
