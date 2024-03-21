import dao from './youtubeDao.js'
import axios from 'axios'

async function getNewHourly() {
  const newList = await dao.newList()
  const messages = newList.map((data) => {
    // videoId, title
    return `https://youtu.be/${data.videoId} ${data.title}`
  })
  console.log(messages.join('\n'))
  if (messages.length === 0) {
    return
  }

  const webhookUrl = process.env.WEBHOOK_DISCORD_MP4_URL
  const data = {
    content: 'Data Added!\n' + messages.join('\n'),
  }

  axios
    .post(webhookUrl, data)
    .then((response) => {
      console.log('Message sent successfully!')
      console.log('Status Code:', response.status)
    })
    .catch((error) => {
      console.error('Error sending message:', error)
    })
}

getNewHourly()
