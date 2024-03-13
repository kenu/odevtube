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

class Youtube extends Model {}
Youtube.init(
  {
    channelId: DataTypes.STRING,
    title: DataTypes.STRING,
    videoId: { type: DataTypes.STRING, unique: true },
    thumbnail: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
  },
  { sequelize, modelName: 'youtube' }
)

async function create(data) {
  if (!data.videoId) {
    console.log('### ' + JSON.stringify(data))
    return
  }
  await sequelize.sync()
  const one = await Youtube.findOne({
    where: { videoId: data.videoId },
  })

  if (!one) {
    const result = await Youtube.create(data)
    console.log(result.toJSON())
  }
}

async function findAll() {
  return await Youtube.findAll({
    order: [['publishedAt', 'DESC']],
  })
}

export default { create, findAll }
