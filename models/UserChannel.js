import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const UserChannel = sequelize.define('UserChannel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  })

  return UserChannel
}
