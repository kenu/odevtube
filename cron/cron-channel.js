import channelDao from '../dao/channelDao.js'
import capi from '../services/channel.js'

async function processChannels() {
  const channelList = await channelDao.findAllEmpty()
  for (const channel of channelList) {
    if (channel.title) {
      continue
    }
    const data = await capi.getChannelInfo(channel.channelId)
    await channelDao.create(data)
  }
}

processChannels()
