import { Video, Channel, Account, Sequelize, sequelize } from '../models/index.js'

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
  const offset = (options.page - 1) * options.pageSize
  const result = await findAndCountAllVideo(
    options.category,
    options.lang,
    offset,
    options.pageSize,
    options.channelQuery,
    options.channelId,
    undefined,
    options.accountId
  )
  return result
}

async function getPagedVideosWithSearch(options) {
  const offset = (options.page - 1) * options.pageSize
  const result = await findAndCountAllVideo(
    options.category,
    options.lang,
    offset,
    options.pageSize,
    options.channelQuery,
    options.channelId,
    options.searchKeyword,
    options.accountId
  )
  return result
}

async function findAndCountAllVideo(
  category,
  lang,
  offset = 0,
  pageSize = 60,
  channelQuery = '',
  channelId,
  searchKeyword,
  accountId
) {
  let whereClause = {}
  let channelWhereClause = {
    category: category || 'dev',
    lang: lang || 'ko',
  }

  if (accountId) {
    channelWhereClause = {
      ...channelWhereClause,
      [Sequelize.Op.or]: [{ isPublic: true }, { accountId: accountId }],
    }
  } else {
    channelWhereClause = {
      ...channelWhereClause,
      isPublic: true,
    }
  }

  if (channelQuery) {
    whereClause = {
      '$Channel.title$': { [Sequelize.Op.like]: `%${channelQuery}%` },
    }
  }

  if (searchKeyword) {
    whereClause = {
      [Sequelize.Op.or]: [
        { '$Video.title$': { [Sequelize.Op.like]: `%${searchKeyword}%` } },
        { '$Channel.title$': { [Sequelize.Op.like]: `%${searchKeyword}%` } },
      ],
    }
  }

  if (channelId) {
    whereClause = {
      ...whereClause,
      '$Channel.channelId$': channelId,
    }
  }

  const channelWhere = {}
  if (category) {
    channelWhere.category = category
  }
  if (lang) {
    channelWhere.lang = lang
  }

  return await Video.findAndCountAll({
    include: [
      {
        model: Channel,
        where: channelWhereClause,
        required: true,
      },
    ],
    where: whereClause,
    order: [['publishedAt', 'DESC']],
    offset: offset,
    limit: pageSize,
  })
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

async function getVideosByUserChannels(username, page = 1, limit = 20) {
  const account = await Account.findOne({ where: { username } })
  if (!account) return { videos: [], total: 0, page, totalPages: 0 }

  const channels = await account.getChannels()
  if (channels.length === 0) return { videos: [], total: 0, page, totalPages: 0 }

  const channelIds = channels.map((c) => c.id)
  const offset = (page - 1) * limit

  const { count, rows } = await Video.findAndCountAll({
    where: { ChannelId: channelIds },
    include: [
      {
        model: Channel,
        attributes: ['channelId', 'title', 'thumbnail', 'customUrl'],
      },
    ],
    order: [['publishedAt', 'DESC']],
    limit,
    offset,
  })

  const videos = rows.map((v) => ({
    videoId: v.videoId,
    title: v.title,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    pubdate: v.publishedAt ? new Date(v.publishedAt).toISOString().split('T')[0] : '',
    channelTitle: v.Channel?.title,
    channelThumbnail: v.Channel?.thumbnail,
    customUrl: v.Channel?.customUrl,
  }))

  return {
    videos,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  }
}

async function getVideosCount() {
  return await Video.count()
}

async function getCategoryStats() {
  const result = await Video.findAll({
    attributes: [
      [sequelize.col('Channel.category'), 'category'],
      [sequelize.fn('COUNT', sequelize.col('Video.id')), 'count'],
    ],
    include: [
      {
        model: Channel,
        attributes: [],
      },
    ],
    group: ['Channel.category'],
    raw: true,
  })

  const total = result.reduce((sum, item) => sum + parseInt(item.count), 0)
  return result.map((item) => ({
    category: item.category || 'unknown',
    count: parseInt(item.count),
    percentage: total > 0 ? ((parseInt(item.count) / total) * 100).toFixed(1) : 0,
  }))
}

async function getYearlyVideoStats() {
  const result = await Video.findAll({
    attributes: [
      [sequelize.fn('YEAR', sequelize.col('publishedAt')), 'year'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: [sequelize.fn('YEAR', sequelize.col('publishedAt'))],
    order: [[sequelize.fn('YEAR', sequelize.col('publishedAt')), 'ASC']],
    raw: true,
  })
  return result
}

async function getMonthlyVideoStats(months = 12) {
  const result = await Video.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('publishedAt'), '%Y-%m'), 'month'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    where: {
      publishedAt: {
        [Sequelize.Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - months + 1)),
      },
    },
    group: ['month'],
    order: [['month', 'DESC']],
    raw: true,
  })
  return result
}

async function getTopChannels(limit = 10) {
  const result = await Video.findAll({
    attributes: [
      [sequelize.col('Channel.channelId'), 'channelId'],
      [sequelize.col('Channel.title'), 'title'],
      [sequelize.col('Channel.customUrl'), 'customUrl'],
      [sequelize.fn('COUNT', sequelize.col('Video.id')), 'video_count'],
    ],
    include: [
      {
        model: Channel,
        attributes: [],
        required: true,
      },
    ],
    group: ['Channel.id'],
    order: [[sequelize.literal('video_count'), 'DESC']],
    limit: limit,
    raw: true,
  })
  return result
}

export default {
  createVideo,
  removeVideo,
  findAllVideo,
  findAndCountAllVideo,
  getPagedVideos,
  getPagedVideosWithSearch,
  newList,
  getVideosByUserChannels,
  getVideosCount,
  getCategoryStats,
  getYearlyVideoStats,
  getMonthlyVideoStats,
  getTopChannels,
}
