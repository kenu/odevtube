const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
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
  tableName: 'users',
  timestamps: true,
});

// Define associations
User.associate = (models) => {
  User.hasMany(models.UserChannel, {
    foreignKey: 'userId',
    as: 'channels',
    onDelete: 'CASCADE',
  });
};

module.exports = User;
