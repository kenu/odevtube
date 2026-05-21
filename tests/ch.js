import channelDao from '../dao/channelDao.js'
import channels from '../channels.js'
import capi from '../services/channel.js'

// 채널 ID를 입력하여 실행합니다.
channels.dev[0].forEach(async (channelId) => {
  const data = await capi.getChannelInfo(channelId)
  data.lang = 'ko'
  data.category = 'dev'
  channelDao.create(data)
})
// 채널 ID를 입력하여 실행합니다.
channels.dev[1].forEach(async (channelId) => {
  const data = await capi.getChannelInfo(channelId)
  data.lang = 'en'
  data.category = 'dev'
  channelDao.create(data)
})

capi.findChannelInfo('@kenuheo')
