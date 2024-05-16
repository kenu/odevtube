import dao from '../youtubeDao.js'
import channels from '../channels.js'
import cr from '../cron/cron-channel.js'

// 채널 ID를 입력하여 실행합니다.
channels.dev[0].forEach(async (channelId) => {
  const data = await cr.getChannelInfo(channelId)
  data.lang = 'ko'
  data.category = 'dev'
  dao.create(data)
})
// 채널 ID를 입력하여 실행합니다.
channels.dev[1].forEach(async (channelId) => {
  const data = await cr.getChannelInfo(channelId)
  data.lang = 'en'
  data.category = 'dev'
  dao.create(data)
})

cr.findChannelInfo('@kenuheo')
