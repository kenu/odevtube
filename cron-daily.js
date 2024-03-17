import dao from './dailyDao.js'

async function getNewDaily() {
  const today = new Date()
  const yesterday = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
  const newList = await dao.newList(yesterday)
  console.log(newList)
}

getNewDaily()
