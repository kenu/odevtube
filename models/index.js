import { Sequelize } from 'sequelize'
import AccountModel from './Account.js'
import ChannelModel from './Channel.js'
import VideoModel from './Video.js'
import TranscriptModel from './Transcript.js'
import UserVideoModel from './UserVideo.js'
import UserChannelModel from './UserChannel.js'

import 'dotenv/config'

const sequelize = new Sequelize(
  process.env.YOUDB_NAME || 'odevtube',
  process.env.YOUDB_USER || 'devuser',
  process.env.YOUDB_PASS || 'devpass',
  {
    host: process.env.YOUDB_HOST || 'localhost',
    dialect: 'mariadb',
    timezone: 'Asia/Seoul',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
)

const Account = AccountModel(sequelize)
const Channel = ChannelModel(sequelize)
const Video = VideoModel(sequelize)
const Transcript = TranscriptModel(sequelize)
const UserVideo = UserVideoModel(sequelize)
const UserChannel = UserChannelModel(sequelize)

// Associations
Channel.belongsTo(Account, { foreignKey: 'accountId', targetKey: 'accountId' })
Channel.hasMany(Video)
Video.belongsTo(Channel)

Transcript.belongsTo(Video, { as: 'video', foreignKey: 'videoId' })
Video.hasOne(Transcript, { as: 'transcripts', foreignKey: 'videoId' })

Account.belongsToMany(Video, { through: UserVideo })
Video.belongsToMany(Account, { through: UserVideo })

Account.belongsToMany(Channel, { through: UserChannel })
Channel.belongsToMany(Account, { through: UserChannel })

// Synchronize models with the database
if (process.env.NODE_ENV !== 'production') {
  ;(async () => {
    try {
      await sequelize.sync()
      console.log('Database synchronized')
    } catch (error) {
      console.error('Error synchronizing database:', error)
    }
  })()
}

const db = {
  sequelize,
  Sequelize,
  Account,
  Channel,
  Video,
  Transcript,
  UserVideo,
  UserChannel,
}

export default db
export { sequelize, Sequelize, Account, Channel, Video, Transcript, UserVideo, UserChannel }
