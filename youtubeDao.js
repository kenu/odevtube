import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize(
  process.env.YOUDB_NAME || 'youtubedb',
  process.env.YOUDB_USER || 'devuser',
  process.env.YOUDB_PASS || 'devpass',
  {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: 'Asia/Seoul',
    logging: false,
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

const Youtube = sequelize.define('Youtube', {
  title: DataTypes.STRING,
  videoId: { type: DataTypes.STRING, unique: true },
  thumbnail: DataTypes.STRING,
  publishedAt: DataTypes.DATE,
})

const Transcript = sequelize.define('Transcript', {
  videoId: {
    type: DataTypes.STRING,
    references: {
      model: Youtube,
      key: 'videoId',
    },
  },
  content: DataTypes.TEXT,
})

Channel.hasMany(Youtube)
Youtube.belongsTo(Channel)

Transcript.belongsTo(Youtube)
Youtube.hasOne(Transcript)

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
  if (!data.channelId) {
    console.log('## ' + JSON.stringify(data))
    return
  }
  await sequelize.sync()
  const one = await Channel.findOne({
    where: { channelId: data.channelId },
  })

  if (!one) {
    const result = await Channel.create(data)
    console.log(result.toJSON())
  }
}

async function findAll() {
  return await Channel.findAll({
    order: [['publishedAt', 'DESC']],
  })
}

async function createYoutube(data) {
  if (!data.videoId) {
    console.log('## ' + JSON.stringify(data))
    return
  }
  const one = await Youtube.findOne({
    where: { videoId: data.videoId },
  })
  if (!one) {
    const result = await Youtube.create(data)
    console.log(result.toJSON())
  }
}

async function findAllYoutube(category, lang) {
  return await Youtube.findAll({
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

async function getPagedYoutubes(options) {
  const offset = (options.page - 1) * options.pageSize
  const result = await findAndCountAllYoutube(
    options.category,
    options.lang,
    offset,
    options.pageSize
  )
  return result
}

async function findAndCountAllYoutube(
  category,
  lang,
  offset = 0,
  pageSize = 30
) {
  return await Youtube.findAndCountAll({
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
async function findAllChannelList(offset) {
  // Query to get the channel list and the last update
  const list = await sequelize.query(
    `select
        max(y.publishedAt) publishedAt,
        count(y.id) cnt,
        'aaa' a,
        c.*
      from channels c
      join youtubes y on c.id = y.ChannelId
      group by c.id
      order by publishedAt desc;
    `,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  )
  if (offset) {
    const baseDate = dayjs().subtract(offset, 'day').toISOString()
    const lastUpdate = list.filter((item) => {
      return dayjs(item.publishedAt).toISOString() > baseDate
    })
    return lastUpdate
  } else {
    return list
  }
}

async function newList() {
  const list = await sequelize.query(
    `select y.videoId, y.title from Youtubes y
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
    console.log('## ' + JSON.stringify(data))
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
  const result = await Account.create(data)
  console.log(result.toJSON())
  return result
}

export default {
  create,
  findOneByChannelId,
  findAllChannelList,
  findAll,
  createYoutube,
  findAllYoutube,
  findAndCountAllYoutube,
  getPagedYoutubes,
  newList,
  findTranscriptByVideoId,
  createTranscript,
  removeTranscript,
  createAccount,
}
