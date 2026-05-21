import { Channel, Video, Account, sequelize } from '../models/index.js'
import dayjs from 'dayjs'

async function create(data) {
  console.log(data, 'created')
  await Channel.upsert(data)
  return await Channel.findOne({ where: { channelId: data.channelId } })
}

async function findOneByChannelId(channelId) {
  return await Channel.findOne({
    where: { channelId: channelId },
  })
}

async function findAllChannelList(dayOffset) {
  const list = await sequelize.query(
    `select
        max(y.publishedAt) publishedAt, count(y.id) cnt,
        c.id, c.channelId, c.title, c.thumbnail, c.customUrl, c.lang, c.category, c.createdAt, c.updatedAt, c.isPublic,
        a.username as addedBy, a.photo as addedByPhoto
      from channels c
      left join videos y on c.id = y.ChannelId
      left join userchannels uc on c.id = uc.ChannelId
      left join accounts a on uc.AccountId = a.id
      group by c.id
      order by y.publishedAt desc;`,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  )
  if (dayOffset) {
    const baseDate = dayjs().subtract(dayOffset, 'day').toISOString()
    const lastUpdate = list.filter((item) => {
      if (!item.publishedAt) {
        return true
      }
      return dayjs(item.publishedAt).toISOString() > baseDate
    })
    return lastUpdate
  } else {
    return list
  }
}

async function findAll() {
  return await Channel.findAll({
    order: [['publishedAt', 'DESC']],
  })
}

async function findAllEmpty() {
  return await Channel.findAll({
    where: { title: null },
  })
}

async function getChannelsCount() {
  return await Channel.count()
}

async function getChannelsByUsername(username) {
  const account = await Account.findOne({
    where: { username },
    include: Channel,
  })
  return account ? { account, channels: account.Channels } : null
}

async function getAllUserChannels() {
  const accounts = await Account.findAll({
    include: {
      model: Channel,
      through: { attributes: ['createdAt'] },
    },
    order: [['createdAt', 'DESC']],
  })

  const result = []
  for (const account of accounts) {
    for (const channel of account.Channels) {
      result.push({
        username: account.username,
        userPhoto: account.photo,
        channelTitle: channel.title,
        channelThumbnail: channel.thumbnail,
        channelId: channel.channelId,
        customUrl: channel.customUrl,
        addedAt: channel.UserChannel.createdAt,
      })
    }
  }

  result.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
  return result
}

async function updateChannelVisibility(channelId, isPublic) {
  const channel = await Channel.findOne({ where: { channelId } })
  if (channel) {
    channel.isPublic = isPublic
    await channel.save()
    return channel
  }
  return null
}

export default {
  create,
  findOneByChannelId,
  findAllChannelList,
  findAll,
  findAllEmpty,
  getChannelsCount,
  getChannelsByUsername,
  getAllUserChannels,
  updateChannelVisibility,
}
