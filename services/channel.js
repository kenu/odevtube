import youtube from '../youtube.js'

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

async function findChannelInfo(forHandle) {
  try {
    const response = await youtube.channels.list({
      forHandle,
      part: 'id,snippet,contentDetails',
    })
    const item = response.data.items[0]
    const data = {
      title: item.snippet.title,
      customUrl: item.snippet.customUrl,
      channelId: item.id,
      thumbnail: item.snippet.thumbnails.medium.url,
    }
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export default {
  getChannelInfo,
  findChannelInfo,
}
