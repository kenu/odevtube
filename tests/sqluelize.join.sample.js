import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize(
  process.env.YOUDB_NAME || 'odevtube',
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
})
const Video = sequelize.define('Video', {
  title: DataTypes.STRING,
  videoId: { type: DataTypes.STRING, unique: true },
  thumbnail: DataTypes.STRING,
  publishedAt: DataTypes.DATE,
})

Channel.hasMany(Video)
Video.belongsTo(Channel)
;(async () => {
  await sequelize.sync()
})()
