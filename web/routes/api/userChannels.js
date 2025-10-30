const express = require('express');
const router = express.Router();
const passport = require('passport');
const { models } = require('../../../database');
const { Op } = require('sequelize');
const axios = require('axios');
const { YOUTUBE_API_KEY } = process.env;

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get user's channels by list type
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { listType = 'favorites' } = req.query;
    
    const channels = await models.UserChannel.findAll({
      where: {
        userId: req.user.id,
        ...(listType && { listType })
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ channels });
  } catch (error) {
    console.error('Error fetching user channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Add a channel to user's list
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { channelId, listType = 'favorites' } = req.body;
    
    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }
    
    // Check if channel already exists in user's list
    const existingChannel = await models.UserChannel.findOne({
      where: {
        userId: req.user.id,
        channelId,
        listType
      }
    });
    
    if (existingChannel) {
      return res.status(409).json({ error: 'Channel already exists in this list' });
    }
    
    // Fetch channel details from YouTube API
    let channelTitle = 'Unknown Channel';
    let channelThumbnail = '';
    
    if (YOUTUBE_API_KEY) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'snippet',
            id: channelId,
            key: YOUTUBE_API_KEY
          }
        });
        
        if (response.data.items && response.data.items.length > 0) {
          const channel = response.data.items[0];
          channelTitle = channel.snippet.title;
          channelThumbnail = channel.snippet.thumbnails.default.url;
        }
      } catch (error) {
        console.error('Error fetching channel details from YouTube API:', error.message);
        // Continue with default values if API call fails
      }
    }
    
    // Create new channel entry
    const newChannel = await models.UserChannel.create({
      userId: req.user.id,
      channelId,
      channelTitle,
      channelThumbnail,
      listType
    });
    
    res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error('Error adding channel:', error);
    res.status(500).json({ error: 'Failed to add channel' });
  }
});

// Remove a channel from user's list
router.delete('/:channelId', isAuthenticated, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { listType } = req.query;
    
    const where = {
      userId: req.user.id,
      channelId
    };
    
    if (listType) {
      where.listType = listType;
    }
    
    const result = await models.UserChannel.destroy({ where });
    
    if (result === 0) {
      return res.status(404).json({ error: 'Channel not found in your list' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing channel:', error);
    res.status(500).json({ error: 'Failed to remove channel' });
  }
});

// Move a channel between lists
router.patch('/:channelId/move', isAuthenticated, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { fromList, toList } = req.body;
    
    if (!fromList || !toList) {
      return res.status(400).json({ error: 'Both fromList and toList are required' });
    }
    
    const channel = await models.UserChannel.findOne({
      where: {
        userId: req.user.id,
        channelId,
        listType: fromList
      }
    });
    
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found in the specified list' });
    }
    
    // Check if already exists in target list
    const existingInTarget = await models.UserChannel.findOne({
      where: {
        userId: req.user.id,
        channelId,
        listType: toList
      }
    });
    
    if (existingInTarget) {
      // If already in target list, just delete from source
      await channel.destroy();
    } else {
      // Update list type
      channel.listType = toList;
      await channel.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error moving channel:', error);
    res.status(500).json({ error: 'Failed to move channel' });
  }
});

module.exports = router;
