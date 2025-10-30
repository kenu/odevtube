const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const UserChannel = sequelize.define('UserChannel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // This references the `Users` table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  channelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  channelTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  channelThumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  listType: {
    type: DataTypes.ENUM('favorites', 'watchlist'),
    allowNull: false,
    defaultValue: 'favorites',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_channels',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'channelId', 'listType'],
      name: 'unique_user_channel_list'
    }
  ]
});

// Define associations
UserChannel.associate = (models) => {
  UserChannel.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
  });
};

module.exports = UserChannel;
