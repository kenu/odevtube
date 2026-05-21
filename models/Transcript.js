import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Transcript = sequelize.define('Transcript', {
    videoId: {
      type: DataTypes.STRING,
      references: {
        model: 'Videos',
        key: 'videoId',
      },
    },
    content: DataTypes.TEXT,
    summary: DataTypes.TEXT,
  })

  return Transcript
}
