CREATE TABLE channels (
  channelId VARCHAR(255) NOT NULL PRIMARY KEY,
  title VARCHAR(255),
  customUrl VARCHAR(255),
  thumbnail VARCHAR(255),
  category VARCHAR(255),
  lang VARCHAR(255),
  publishedAt DATETIME,
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE videos (
  videoId VARCHAR(255) NOT NULL PRIMARY KEY,
  title VARCHAR(255),
  publishedAt DATETIME,
  channelId VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (channelId) REFERENCES channels(channelId)
);

CREATE TABLE accounts (
  accountId VARCHAR(255) NOT NULL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  photo VARCHAR(255),
  provider VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE transcripts (
  videoId VARCHAR(255) NOT NULL PRIMARY KEY,
  content TEXT,
  summary TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);

INSERT INTO channels (id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt) VALUES
(33, 'UCP7uiEZIqci43m22KDl0sNw', 'Kotlin by JetBrains', 'https://yt3.ggpht.com/Dv5KK_wYBOzPMDKfufi-lyWOKsmKTIam0uulnK8R7QMDPPjO5IzcqGKn2Eo0DXKtukv1JRKLIlQ=s240-c-k-c0x00ffffff-no-rj', '@kotlin', 'en', 'dev', '2024-03-18 18:12:42.000', '2025-02-11 18:38:27.000'),
(34, 'UCHbXBo1fQAg7j0D7HKKYHJg', 'Kenu Heo', 'https://yt3.ggpht.com/ytc/AIdro_kQ3GwTcVtsNAlO8CPu8jJk88fIi6gZYNuc9q78L9-1zP8=s240-c-k-c0x00ffffff-no-rj', '@kenuheo', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:08.000'),
(35, 'UCSLrpBAzr-ROVGHQ5EmxnUg', '코딩애플', 'https://yt3.ggpht.com/ytc/AIdro_nwJ1atCtmd4bkIhKvnjnY0cVqehB44xMmyVJmSFqXiJ8c=s240-c-k-c0x00ffffff-no-rj', '@codingapple', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:05.000');

INSERT INTO videos (videoId, title, publishedAt, channelId, createdAt, updatedAt) VALUES
('video1', 'Video 1', '2023-10-10 10:00:00', 'UC-9-kyTW8ZkZNDHQJ6FgpwQ', NOW(), NOW()),
('video2', 'Video 2', '2023-10-11 10:00:00', 'UC-9-kyTW8ZkZNDHQJ6FgpwQ', NOW(), NOW()),
('video3', 'Video 3', '2023-10-12 10:00:00', 'UC-9-kyTW8ZkZNDHQJ6FgpwQ', NOW(), NOW());

INSERT INTO accounts (accountId, username, email, photo, provider, createdAt, updatedAt) VALUES
('1', 'user1', 'user1@example.com', 'photo1.jpg', 'github', NOW(), NOW()),
('2', 'user2', 'user2@example.com', 'photo2.jpg', 'github', NOW(), NOW()),
('3', 'user3', 'user3@example.com', 'photo3.jpg', 'github', NOW(), NOW());
