import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize(
  process.env.YOUDB_NAME || 'odevtube',
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
  subscriptionTier: { type: DataTypes.STRING, defaultValue: 'free' },
  subscriptionExpiry: { type: DataTypes.DATE },
})

const UserVideo = sequelize.define('UserVideo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
})

const UserChannel = sequelize.define('UserChannel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
})

Account.belongsToMany(Video, { through: UserVideo })
Video.belongsToMany(Account, { through: UserVideo })

Account.belongsToMany(Channel, { through: UserChannel })
Channel.belongsToMany(Account, { through: UserChannel })

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
  try {
    const [video, created] = await Video.findOrCreate({
      where: { videoId: data.videoId },
      defaults: data,
    })
    return video
  } catch (error) {
    if (error.original?.errno === 1062) {
      // 중복 키 에러는 무시 (이미 존재하는 비디오)
      return null
    }
    throw error
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
  const offset = (options.page - 1) * options.pageSize;
  const result = await findAndCountAllVideo(
    options.category,
    options.lang,
    offset,
    options.pageSize,
    options.channelQuery,
    options.channelId
  );
  return result;
}

async function getPagedVideosWithSearch(options) {
  const offset = (options.page - 1) * options.pageSize;
  const result = await findAndCountAllVideo(
    options.category,
    options.lang,
    offset,
    options.pageSize,
    options.channelQuery,
    options.channelId,
    options.searchKeyword
  );
  return result;
}

async function findAndCountAllVideo(
  category,
  lang,
  offset = 0,
  pageSize = 60,
  channelQuery = '',
  channelId,
  searchKeyword
) {
  let whereClause = {};

  if (channelQuery) {
    whereClause = {
      '$Channel.title$': { [Sequelize.Op.like]: `%${channelQuery}%` }
    };
  }

  if (searchKeyword) {
    whereClause = {
      [Sequelize.Op.or]: [
        { '$Video.title$': { [Sequelize.Op.like]: `%${searchKeyword}%` } },
        { '$Channel.title$': { [Sequelize.Op.like]: `%${searchKeyword}%` } }
      ]
    };
  }

  if (channelId) {
    whereClause = {
      ...whereClause,
      '$Channel.channelId$': channelId
    };
  }

  return await Video.findAndCountAll({
    include: [
      {
        model: Channel,
        where: {
          category: category || 'dev',
          lang: lang || 'ko'
        },
        required: true,
      },
    ],
    where: whereClause,
    order: [['publishedAt', 'DESC']],
    offset: offset,
    limit: pageSize,
  });
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
        max(y.publishedAt) publishedAt, count(y.id) cnt,
        c.id, c.channelId, c.title, c.thumbnail, c.customUrl, c.lang, c.category, c.createdAt, c.updatedAt
      from channels c
      left join videos y on c.id = y.ChannelId
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

async function getVideosByAccountId(accountId) {
  const account = await Account.findOne({
    where: { accountId },
    include: Video,
  });
  return account ? account.Videos : [];
}

async function addVideoToAccount(accountId, videoId) {
  const account = await Account.findOne({ where: { accountId } });
  const video = await Video.findOne({ where: { videoId } });
  if (account && video) {
    await account.addVideo(video);
  }
}

async function countVideosByAccountId(accountId) {
  const account = await Account.findOne({ where: { accountId } });
  if (account) {
    return await account.countVideos();
  }
  return 0;
}

async function removeVideoFromAccount(accountId, videoId) {
  const account = await Account.findOne({ where: { accountId } });
  const video = await Video.findOne({ where: { videoId } });
  if (account && video) {
    await account.removeVideo(video);
  }
}

async function updateAccount(accountId, data) {
  await Account.update(data, { where: { accountId } });
}

async function getChannelsByAccountId(accountId) {
  const account = await Account.findOne({
    where: { accountId },
    include: Channel,
  });
  return account ? account.Channels : [];
}

async function addChannelToAccount(accountId, channelId) {
  const account = await Account.findOne({ where: { accountId } });
  const channel = await Channel.findOne({ where: { channelId } });
  if (account && channel) {
    await account.addChannel(channel);
  }
}

async function countChannelsByAccountId(accountId) {
  const account = await Account.findOne({ where: { accountId } });
  if (account) {
    return await account.countChannels();
  }
  return 0;
}

async function removeChannelFromAccount(accountId, channelId) {
  const account = await Account.findOne({ where: { accountId } });
  const channel = await Channel.findOne({ where: { channelId } });
  if (account && channel) {
    await account.removeChannel(channel);
  }
}

async function getVideosCount() {
  const result = await Video.count();
  return result;
}

async function getChannelsCount() {
  const result = await Channel.count();
  return result;
}

async function getYearlyVideoStats() {
  const result = await Video.findAll({
    attributes: [
      [sequelize.fn('YEAR', sequelize.col('publishedAt')), 'year'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: [sequelize.fn('YEAR', sequelize.col('publishedAt'))],
    order: [[sequelize.fn('YEAR', sequelize.col('publishedAt')), 'ASC']],
    raw: true
  });
  return result;
}

async function getMonthlyVideoStats(months = 12) {
  const result = await Video.findAll({
    attributes: [
      [sequelize.fn('strftime', '%Y-%m', sequelize.col('publishedAt')), 'month'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: {
      publishedAt: {
        [Sequelize.Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - months + 1))
      }
    },
    group: ['month'],
    order: [['month', 'DESC']],
    raw: true
  });
  return result;
}

async function getTopChannels(limit = 10) {
  const result = await Video.findAll({
    attributes: [
      'customUrl',
      [sequelize.fn('COUNT', sequelize.col('Video.id')), 'video_count']
    ],
    group: ['customUrl'],
    order: [[sequelize.literal('video_count'), 'DESC']],
    limit: limit,
    raw: true
  });
  return result;
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
  getPagedVideosWithSearch,
  newList,
  findTranscriptByVideoId,
  createTranscript,
  removeTranscript,
  createAccount,
  getVideosByAccountId,
  addVideoToAccount,
  countVideosByAccountId,
  removeVideoFromAccount,
  updateAccount,
  getVideosCount,
  getChannelsCount,
  getYearlyVideoStats,
  getMonthlyVideoStats,
  getTopChannels,
  getChannelsByAccountId,
  addChannelToAccount,
  countChannelsByAccountId,
  removeChannelFromAccount
}
