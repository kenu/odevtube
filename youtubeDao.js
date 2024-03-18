import { Sequelize, DataTypes, Op } from 'sequelize'
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

Channel.hasMany(Youtube)
Youtube.belongsTo(Channel)

await sequelize.sync()
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

async function findOneByChannelId(channelId) {
  return await Channel.findOne({
    where: { channelId: channelId },
  })
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

export default {
  create,
  findOneByChannelId,
  findAll,
  createYoutube,
  findAllYoutube,
  newList,
}
