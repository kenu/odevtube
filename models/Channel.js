import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Channel = sequelize.define('Channel', {
    channelId: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    customUrl: DataTypes.STRING,
    lang: DataTypes.STRING(2),
    category: DataTypes.STRING,
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    accountId: {
      type: DataTypes.STRING,
      references: {
        model: 'Accounts',
        key: 'accountId',
      },
      allowNull: true,
    },
  })

  return Channel
}
