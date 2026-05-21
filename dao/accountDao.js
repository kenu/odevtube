import { Account, Video, Channel } from '../models/index.js'

async function createAccount(data) {
  await Account.upsert(data)
}

async function getAccountByUsername(username) {
  return await Account.findOne({ where: { username } })
}

async function getVideosByAccountId(accountId) {
  const account = await Account.findOne({
    where: { accountId },
    include: Video,
  })
  return account ? account.Videos : []
}

async function addVideoToAccount(accountId, videoId) {
  const account = await Account.findOne({ where: { accountId } })
  const video = await Video.findOne({ where: { videoId } })
  if (account && video) {
    await account.addVideo(video)
  }
}

async function countVideosByAccountId(accountId) {
  const account = await Account.findOne({ where: { accountId } })
  if (account) {
    return await account.countVideos()
  }
  return 0
}

async function removeVideoFromAccount(accountId, videoId) {
  const account = await Account.findOne({ where: { accountId } })
  const video = await Video.findOne({ where: { videoId } })
  if (account && video) {
    await account.removeVideo(video)
  }
}

async function updateAccount(accountId, data) {
  await Account.update(data, { where: { accountId } })
}

async function getChannelsByAccountId(accountId) {
  const account = await Account.findOne({
    where: { accountId },
    include: Channel,
  })
  return account ? account.Channels : []
}

async function addChannelToAccount(accountId, channelId) {
  const account = await Account.findOne({ where: { accountId } })
  const channel = await Channel.findOne({ where: { channelId } })
  if (account && channel) {
    await account.addChannel(channel)
  }
}

async function countChannelsByAccountId(accountId) {
  const account = await Account.findOne({ where: { accountId } })
  if (account) {
    return await account.countChannels()
  }
  return 0
}

async function removeChannelFromAccount(accountId, channelId) {
  const account = await Account.findOne({ where: { accountId } })
  const channel = await Channel.findOne({ where: { channelId } })
  if (account && channel) {
    await account.removeChannel(channel)
  }
}

async function getUsersCount() {
  return await Account.count()
}

export default {
  createAccount,
  getAccountByUsername,
  getVideosByAccountId,
  addVideoToAccount,
  countVideosByAccountId,
  removeVideoFromAccount,
  updateAccount,
  getChannelsByAccountId,
  addChannelToAccount,
  countChannelsByAccountId,
  removeChannelFromAccount,
  getUsersCount,
}
