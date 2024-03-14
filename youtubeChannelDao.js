import { Sequelize, Model, DataTypes } from 'sequelize'
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

class Channel extends Model {}
Channel.init(
  {
    lang: DataTypes.STRING(5),
    channelId: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    customUrl: DataTypes.STRING,
  },
  { sequelize, modelName: 'channel' }
)

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

export default { create, findAll }
