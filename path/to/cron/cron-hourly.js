import dao from '../youtubeDao.js'
import axios from 'axios'

async function getNewHourly() {
  const newList = await dao.newList()
  const messages = newList.map((data) => {
    // videoId, title
    return `https://youtu.be/${data.videoId} ${data.title}`;
  });
  if (messages.length === 0) {
    return;
  }

  const webhookUrl = process.env.WEBHOOK_DISCORD_MP4_URL;
  const data = {
    content: 'Data Added!\n' + messages.join('\n'),
  };

  try {
    const response = await axios.post(webhookUrl, data);
    console.log('Message sent successfully!', response.data); // Added logging
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

getNewHourly();
