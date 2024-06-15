import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize(
  process.env.YOUDB_NAME || 'youtubedb',
  process.env.YOUDB_USER || 'devuser',
  process.env.YOUDB_PASS || 'devpass',
  {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: 'Asia/Seoul',
    logging: true,
  }
)

const Channel = sequelize.define('Channel', {
  channelId: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  thumbnail: DataTypes.STRING,
  customUrl: DataTypes.STRING,
  lang: DataTypes.STRING(2),
  category: DataTypes.STRING,
})

const Video = sequelize.define('Video', {
  title: DataTypes.STRING,
  videoId: { type: DataTypes.STRING, unique: true },
  thumbnail: DataTypes.STRING,
  publishedAt: DataTypes.DATE,
})

const Transcript = sequelize.define('Transcript', {
  videoId: {
    type: DataTypes.STRING,
    references: {
      model: Video,
      key: 'videoId',
    },
  },
  content: DataTypes.TEXT,
  summary: DataTypes.TEXT,
})

Channel.hasMany(Video)
Video.belongsTo(Channel)

Transcript.belongsTo(Video, { as: 'video', foreignKey: 'videoId' })
Video.hasOne(Transcript, { as: 'transcripts', foreignKey: 'videoId' })

const Account = sequelize.define('Account', {
  accountId: { type: DataTypes.STRING, unique: true },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  photo: DataTypes.STRING,
  provider: DataTypes.STRING,
})

;(async () => {
  await sequelize.sync()
})()

async function create(data) {
  console.log(data, 'created')
  await Channel.upsert(data)
  return await Channel.findOne({ where: { channelId: data.channelId } })
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

async function createVideo(data) {
  if (!data.videoId) {
    return
  }
  const one = await Video.findOne({
    where: { videoId: data.videoId },
  })
  if (!one) {
    const result = await Video.create(data)
  }
}

async function removeVideo(videoId) {
  const one = await Video.findOne({
    where: { videoId: videoId },
  })
  if (one) {
    await one.destroy()
  }
}

async function findAllVideo(category, lang) {
  return await Video.findAll({
    include: [
      {
        model: Channel,
        where: { category: category || 'dev', lang: lang || 'ko' },
        required: true,
      },
    ],
    order: [['publishedAt', 'DESC']],
  })
}

async function getPagedVideos(options) {
  const offset = (options.page - 1) * options.pageSize
  const result = await findAndCountAllVideo(
    options.category,
    options.lang,
    offset,
    options.pageSize
  )
  return result
}

async function findAndCountAllVideo(
  category,
  lang,
  offset = 0,
  pageSize = 30
) {
  return await Video.findAndCountAll({
    include: [
      {
        model: Channel,
        where: { category: category || 'dev', lang: lang || 'ko' },
        required: true,
      },
    ],
    order: [['publishedAt', 'DESC']],
    offset: offset,
    limit: pageSize,
  })
}

async function findOneByChannelId(channelId) {
  return await Channel.findOne({
    where: { channelId: channelId },
  })
}

import dayjs from 'dayjs'
async function findAllChannelList(dayOffset) {
  // Query to get the channel list and the last update
  const list = await sequelize.query(
    `select
        max(y.publishedAt) publishedAt,
        count(y.id) cnt,
        'aaa' a,
        c.*
      from channels c
      left join videos y on c.id = y.ChannelId
      group by c.id
      order by publishedAt desc;
    `,
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

async function newList() {
  const list = await sequelize.query(
    `select y.videoId, y.title from Videos y
    join Channels c on y.ChannelId = c.id
    where DATE_SUB(NOW(), INTERVAL 1 HOUR) < y.createdAt
    and c.lang = 'ko'
    and c.category = 'dev'
    limit 10;
    `,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  )
  return list
}

async function findTranscriptByVideoId(videoId) {
  return await Transcript.findOne({
    where: { videoId: videoId },
  })
}

async function createTranscript(data) {
  if (!data.videoId) {
    return
  }
  const one = await Transcript.findOne({
    where: { videoId: data.videoId },
  })
  if (!one) {
    const result = await Transcript.create(data)
    return result.toJSON()
  }
}

async function removeTranscript(videoId) {
  const one = await Transcript.findOne({
    where: { videoId: videoId },
  })
  if (one) {
    await one.destroy()
  }
}

async function createAccount(data) {
  await Account.upsert(data)
}

export default {
  create,
  findOneByChannelId,
  findAllChannelList,
  findAll,
  findAllEmpty,
  createVideo,
  removeVideo,
  findAllVideo,
  findAndCountAllVideo,
  getPagedVideos,
  newList,
  findTranscriptByVideoId,
  createTranscript,
  removeTranscript,
  createAccount,
}
