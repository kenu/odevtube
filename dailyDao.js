import { Sequelize } from 'sequelize'
import dayjs from 'dayjs'

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

async function newList(date) {
  const dddd = dayjs(date).format('YYYY-MM-DD hh')
  const list = await sequelize.query(
    `select y.title, y.videoId, y.thumbnail, y.publishedAt,
    c.title ctitle, c.thumbnail cthumbnail, c.category
    from Videos y
    join Channels c on c.id = y.ChannelId and c.lang = 'ko' and c.category in ('dev', 'drama', 'food')
    where y.publishedAt > $date order by y.publishedAt desc;`,
    {
      bind: { date: dddd },
      type: sequelize.QueryTypes.SELECT,
    }
  )
  return list
}

export default {
  newList,
}
