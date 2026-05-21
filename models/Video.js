import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Video = sequelize.define('Video', {
    title: DataTypes.STRING,
    videoId: { type: DataTypes.STRING, unique: true },
    thumbnail: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
  })

  return Video
}
