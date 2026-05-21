import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Account = sequelize.define('Account', {
    accountId: { type: DataTypes.STRING, unique: true },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    photo: DataTypes.STRING,
    provider: DataTypes.STRING,
    subscriptionTier: { type: DataTypes.STRING, defaultValue: 'free' },
    subscriptionExpiry: { type: DataTypes.DATE },
  })

  return Account
}
