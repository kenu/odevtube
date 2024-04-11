import youtube from './youtube.js'
import dao from './youtubeDao.js'
import channels from './channels.js'

async function getChannelInfo(channelId) {
  try {
    const response = await youtube.channels.list({
      id: channelId,
      part: 'snippet,contentDetails',
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

async function processChannels(category, lang, channelIndex) {
  const channelsList = channels[category][channelIndex]
  for (const channelId of channelsList) {
    const data = await getChannelInfo(channelId)
    data.category = category
    data.lang = lang
    await dao.create(data)
  }
}

processChannels('dev', 'ko', 0)
processChannels('dev', 'en', 1)
processChannels('drama', 'ko', 0)
processChannels('food', 'ko', 0)
processChannels('kpop', 'ko', 0)
