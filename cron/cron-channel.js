import dao from '../youtubeDao.js'
import capi from '../services/channel.js'

async function processChannels() {
  const channelList = await dao.findAllEmpty()
  for (const channel of channelList) {
    if (channel.title) {
      continue
    }
    const data = await capi.getChannelInfo(channel.channelId)
    await dao.create(data)
  }
}

processChannels()
