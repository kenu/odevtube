import { google } from 'googleapis'
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // Replace with your API key or OAuth 2.0 access token
})

async function getChannelInfoByUsername(username) {
 try {
    const response = await youtube.channels.list({
      part: 'snippet,contentDetails,statistics',
      forUsername: username,
    });
    if (response.data.items?.length > 0) {
      console.log(response.data.items[0]);
    } else {
      console.log('No channel found for the given username.');
    }
 } catch (error) {
    console.error('Error fetching channel info:', error);
 }
}

// Example usage
getChannelInfoByUsername('kenuheo'); // Replace with the correct username
