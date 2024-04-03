import youtube from './youtube.js'
import dao from './youtubeDao.js'
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
      thumbnail: items.snippet.thumbnails.medium.url,
      channelId: items.id,
    }
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

// 채널 ID를 입력하여 실행합니다.
channels['dev'][0].forEach(async (channelId) => {
  const data = await getChannelInfo(channelId)
  data.category = 'dev'
  data.lang = 'ko'
  await dao.create(data)
})

channels['dev'][1].forEach(async (channelId) => {
  const data = await getChannelInfo(channelId)
  data.category = 'dev'
  data.lang = 'en'
  await dao.create(data)
})

channels['drama'][0].forEach(async (channelId) => {
  const data = await getChannelInfo(channelId)
  data.category = 'drama'
  data.lang = 'ko'
  await dao.create(data)
})

channels['food'][0].forEach(async (channelId) => {
  const data = await getChannelInfo(channelId)
  data.category = 'food'
  data.lang = 'ko'
  await dao.create(data)
})
