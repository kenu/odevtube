CREATE TABLE accounts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  accountId VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  email VARCHAR(255),
  photo VARCHAR(255),
  provider VARCHAR(255),
  subscriptionTier VARCHAR(255) DEFAULT 'free',
  subscriptionExpiry DATETIME,
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE channels (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  channelId VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  customUrl VARCHAR(255),
  thumbnail VARCHAR(255),
  category VARCHAR(255),
  lang VARCHAR(255),
  publishedAt DATETIME,
  createdAt DATETIME,
  updatedAt DATETIME
);

INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(30, 'UCsvqVGtbbyHaMoevxPAq9Fg', 'Simplilearn', 'https://yt3.ggpht.com/r6M4Ex4bNj3_UuUpCRtEm8B_qAvl_n31BlNzj5Z1pxOlcE-JQFSddJltwLT6M7Qp7ROUEXCYeQ=s240-c-k-c0x00ffffff-no-rj', '@simplilearnofficial', 'en', 'dev', '2024-03-18 18:12:42.000', '2025-01-22 17:47:18.000');

CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `videoId` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `publishedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `channelId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `videoId` (`videoId`),
  KEY `channelId` (`channelId`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`channelId`) REFERENCES `channels` (`id`)
);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Data Analyst Salary in 2025  #shorts #simplilearn', 'NhMfqhT_wOk', 'https://i.ytimg.com/vi/NhMfqhT_wOk/mqdefault.jpg', '2025-09-27 01:30:10.000', '2025-09-27 02:05:19.000', '2025-09-27 02:05:19.000', 30);

CREATE TABLE transcripts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  videoId VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  summary TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE uservideos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  AccountId INT,
  VideoId INT,
  UNIQUE KEY `UserVideos_VideoId_AccountId_unique` (AccountId, VideoId),
  FOREIGN KEY (AccountId) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (VideoId) REFERENCES videos (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE userchannels (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  AccountId INT,
  ChannelId INT,
  UNIQUE KEY `UserChannels_ChannelId_AccountId_unique` (AccountId, ChannelId),
  FOREIGN KEY (AccountId) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ChannelId) REFERENCES channels (id) ON DELETE CASCADE ON UPDATE CASCADE
);
