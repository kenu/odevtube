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

async function findAllYoutube(lang) {
  const ln = lang || 'ko'
  return await Youtube.findAll({
    include: [
      {
        model: Channel,
        where: { lang: ln },
        required: true, // This ensures an INNER JOIN, equivalent to the SQL query
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

export default {
  create,
  findOneByChannelId,
  findAll,
  createYoutube,
  findAllYoutube,
}
