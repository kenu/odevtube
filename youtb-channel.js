import youtube from './youtb.js'
import dao from './youtubeChannelDao.js'
import channels from './channels.js'

async function getChannelInfo(channelId) {
  try {
    const response = await youtube.channels.list({
      id: channelId,
      part: 'snippet,contentDetails', // 필요한 정보를 지정합니다.
    })
    const items = response.data.items[0]
    const data = {
      title: items.snippet.title,
      customUrl: items.snippet.customUrl,
      thumbnail: items.snippet.thumbnails.high.url,
      channelId: items.id,
    }
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

// 채널 ID를 입력하여 실행합니다.
channels[0].forEach(async (channelId) => {
  const data = await getChannelInfo(channelId)
  data.lang = 'ko'
  dao.create(data)
})
// 채널 ID를 입력하여 실행합니다.
channels[1].forEach(async (channelId) => {
  const data = await getChannelInfo(channelId)
  data.lang = 'en'
  dao.create(data)
})
