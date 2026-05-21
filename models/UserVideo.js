import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const UserVideo = sequelize.define('UserVideo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  })

  return UserVideo
}
