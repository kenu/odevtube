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


;(async () => {
  await sequelize.sync()
})()

async function createAccount(data) {
  const result = await Account.create(data)
  console.log(result.toJSON() )
  return result
}

async function remove(channelId) {
  const one = await Account.findOne({
    where: { channelId: channelId },
  })
  if (one) {
    await one.destroy()
  }
}

async function findAll() {
  return await Account.findAll({
    order: [['createdAt', 'DESC']],
  })
}

export default {
  create,
  remove,
  findAll,
}
