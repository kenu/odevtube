CREATE TABLE accounts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  accountId VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  email VARCHAR(255),
  photo VARCHAR(255),
  provider VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

INSERT INTO accounts (accountId, username, email, photo, provider, createdAt, updatedAt) VALUES
('1', 'user1', 'user1@example.com', 'photo1.jpg', 'github', NOW(), NOW()),
('2', 'user2', 'user2@example.com', 'photo2.jpg', 'github', NOW(), NOW()),
('3', 'user3', 'user3@example.com', 'photo3.jpg', 'github', NOW(), NOW());

CREATE TABLE channels (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  channelId VARCHAR(255) NOT NULL,
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
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(31, 'UCulplOST7XpLnc6xxNFEAoQ', 'DremDeveloper', 'https://yt3.ggpht.com/6FPgVtqOoWFQwn0y0zOpNinw02t7WLNPZZRnub0C4KrEcXgiYGvvm6T0LALnjOkPK1MMARFLgw=s240-c-k-c0x00ffffff-no-rj', '@dremdeveloper', 'ko', 'dev', '2024-03-18 18:12:42.000', '2025-02-05 01:08:22.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(32, 'UC7yfnfvEUlXUIfm8rGLwZdA', 'SpringDeveloper', 'https://yt3.ggpht.com/ytc/AIdro_mktZcTw2hqHO9L_FJitBqaDyGbjOcBb6Qt3t-ZPfKuPQ=s240-c-k-c0x00ffffff-no-rj', '@springsourcedev', 'en', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:05.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(33, 'UCP7uiEZIqci43m22KDl0sNw', 'Kotlin by JetBrains', 'https://yt3.ggpht.com/Dv5KK_wYBOzPMDKfufi-lyWOKsmKTIam0uulnK8R7QMDPPjO5IzcqGKn2Eo0DXKtukv1JRKLIlQ=s240-c-k-c0x00ffffff-no-rj', '@kotlin', 'en', 'dev', '2024-03-18 18:12:42.000', '2025-02-11 18:38:27.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(34, 'UCHbXBo1fQAg7j0D7HKKYHJg', 'Kenu Heo', 'https://yt3.ggpht.com/ytc/AIdro_kQ3GwTcVtsNAlO8CPu8jJk88fIi6gZYNuc9q78L9-1zP8=s240-c-k-c0x00ffffff-no-rj', '@kenuheo', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:08.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(35, 'UCSLrpBAzr-ROVGHQ5EmxnUg', '코딩애플', 'https://yt3.ggpht.com/ytc/AIdro_nwJ1atCtmd4bkIhKvnjnY0cVqehB44xMmyVJmSFqXiJ8c=s240-c-k-c0x00ffffff-no-rj', '@codingapple', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:05.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(36, 'UCyrE403VJU3Qq5DKWTNlk6Q', '코딩형', 'https://yt3.ggpht.com/ytc/AIdro_lzyJF65ybGBXlLhmzZKR3N9ucYyyWOU0vm21WuHuTFSos=s240-c-k-c0x00ffffff-no-rj', '@perpear1', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:04.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(37, 'UCTcTcjjVKOHBVlfj3YXHx5g', '경아 KyungA', 'https://yt3.ggpht.com/ytc/AIdro_nfLymbvEghxhx8s9dCXBTalLos-S9jrCGRv--2gljhHA=s240-c-k-c0x00ffffff-no-rj', '@kyunga', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-04-20 10:05:08.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(38, 'UCQNE2JmbasNYbjGAcuBiRRg', '조코딩 JoCoding', 'https://yt3.ggpht.com/6gJoxwN9IQ3SlQIo1SibzhmwNLfxhX3t15zfQAGMxmV3Fi7aALzNayf2CzqhL5U6c2f4123G=s240-c-k-c0x00ffffff-no-rj', '@jocoding', 'ko', 'dev', '2024-03-18 18:12:42.000', '2025-01-22 17:47:04.000');
INSERT INTO channels
(id, channelId, title, thumbnail, customUrl, lang, category, createdAt, updatedAt)
VALUES(39, 'UCO7g158NWgLyn98z8v3zduA', '코딩하는거니', 'https://yt3.ggpht.com/ytc/AIdro_n8sQDS1OLcA8p6pNpHIjy6rzWQXUSDgLgHTsM=s240-c-k-c0x00ffffff-no-rj', '@gunnycoding', 'ko', 'dev', '2024-03-18 18:12:42.000', '2024-03-18 18:12:42.000');

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
VALUES('뭐야 내 카톡 돌려줘요;;; #shorts', 'pJOggCOCUYQ', 'https://i.ytimg.com/vi/pJOggCOCUYQ/mqdefault.jpg', '2025-09-29 18:01:24.000', '2025-09-29 18:05:15.000', '2025-09-29 18:05:15.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('사상 초유의 행정 마비가 생긴 현 사태 ㄷㄷ;; #shorts', 'PV-Dn0xUFo8', 'https://i.ytimg.com/vi/PV-Dn0xUFo8/mqdefault.jpg', '2025-09-29 16:38:52.000', '2025-09-29 17:05:14.000', '2025-09-29 17:05:14.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Microsoft Azure Full Course 2025 | Azure Tutorial for Beginners | Azure Training | Simplilearn', 'Vm9RIkXT4-0', 'https://i.ytimg.com/vi/Vm9RIkXT4-0/mqdefault_live.jpg', '2025-09-29 15:04:01.000', '2025-09-29 17:05:19.000', '2025-09-29 17:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Data Analysis Using R Programming 2025 | Data Analytics With R | Data Analytics Course | Simplilearn', 'V9Gi-DJF8Ao', 'https://i.ytimg.com/vi/V9Gi-DJF8Ao/mqdefault.jpg', '2025-09-29 14:37:03.000', '2025-09-29 17:05:19.000', '2025-09-29 17:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Balance Sheet Explained | Balance Sheet Analysis | Balance Sheet Tutorial | Simplilearn', 'IriY24ML-Z0', 'https://i.ytimg.com/vi/IriY24ML-Z0/mqdefault.jpg', '2025-09-29 14:20:31.000', '2025-09-29 17:05:19.000', '2025-09-29 17:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Meta Just Changed the Game: AI Tools Now Allowed in Interviews! #shorts #simplilearn', 'b_iw1CSPgXw', 'https://i.ytimg.com/vi/b_iw1CSPgXw/mqdefault.jpg', '2025-09-29 01:06:48.000', '2025-09-29 02:05:19.000', '2025-09-29 02:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('PostgreSQL Tutorial | What Is PostgreSQL? | PostgreSQL Tutorial For Beginners | Simplilearn', 'evJuky1ZtD8', 'https://i.ytimg.com/vi/evJuky1ZtD8/mqdefault.jpg', '2025-09-29 00:30:31.000', '2025-09-29 01:05:19.000', '2025-09-29 01:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('코딩 테스트 합격자 되기 파이썬 편 - 최단경로(다익스트라의 한계)', 'lqknsmt22xg', 'https://i.ytimg.com/vi/lqknsmt22xg/mqdefault.jpg', '2025-09-28 23:56:31.000', '2025-09-29 00:05:14.000', '2025-09-29 00:05:14.000', 31);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('코딩 테스트 합격자 되기 파이썬 편 - 최단경로(다익스트라의 개념)', 'JCiR1gVCh7M', 'https://i.ytimg.com/vi/JCiR1gVCh7M/mqdefault.jpg', '2025-09-28 23:56:31.000', '2025-09-29 00:05:14.000', '2025-09-29 00:05:14.000', 31);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('코딩 테스트 합격자 되기 파이썬 편 - 최단경로(다익스트라의 동작)', 'l6JLkOd7q8g', 'https://i.ytimg.com/vi/l6JLkOd7q8g/mqdefault.jpg', '2025-09-28 23:56:31.000', '2025-09-29 00:05:14.000', '2025-09-29 00:05:14.000', 31);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('IT뉴스 - 카카오, Wan 2.5, Qwen-Image-Edit, Qwen3-Omni 등, ChatGPT Pulse, Gemini 2.5 Flash, Kling 2.5 등', 'FmmG-dazikk', 'https://i.ytimg.com/vi/FmmG-dazikk/mqdefault_live.jpg', '2025-09-28 18:03:19.000', '2025-09-28 18:05:14.000', '2025-09-28 18:05:14.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Code Rabbit Stops AI Hallucination in Code #Shorts  #simplilearn', '9PGPjAx131A', 'https://i.ytimg.com/vi/9PGPjAx131A/mqdefault.jpg', '2025-09-28 01:50:00.000', '2025-09-28 02:05:18.000', '2025-09-28 02:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Generative AI Engineer Salary in 2025 | How Much Do Gen AI Experts Earn? #Shorts  #simplilearn', 'Gpo61YG5Y1w', 'https://i.ytimg.com/vi/Gpo61YG5Y1w/mqdefault.jpg', '2025-09-28 01:16:57.000', '2025-09-28 02:05:18.000', '2025-09-28 02:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Jenkins Interview Questions 2025 | Jenkins Interview Questions And Answers | Simplilearn', 'jwzcM4_DWMA', 'https://i.ytimg.com/vi/jwzcM4_DWMA/mqdefault.jpg', '2025-09-27 23:30:37.000', '2025-09-28 00:05:18.000', '2025-09-28 00:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Data Analyst Salary in 2025  #shorts #simplilearn', 'NhMfqhT_wOk', 'https://i.ytimg.com/vi/NhMfqhT_wOk/mqdefault.jpg', '2025-09-27 01:30:10.000', '2025-09-27 02:05:19.000', '2025-09-27 02:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥How Much Does a MERN Stack Developer Make? #shorts #simplilearn', 'mWrCiLfHYS0', 'https://i.ytimg.com/vi/mWrCiLfHYS0/mqdefault.jpg', '2025-09-27 00:29:42.000', '2025-09-27 01:05:18.000', '2025-09-27 01:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Financial Statement Analysis | Financial Statement Tutorial |  Financial Analysis | Simplilern', 'yt342XCtuVs', 'https://i.ytimg.com/vi/yt342XCtuVs/mqdefault.jpg', '2025-09-26 23:31:00.000', '2025-09-27 00:05:18.000', '2025-09-27 00:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Web Development Full Course 2026 | Web Development Tutorial | Web Developer Course | Simplilearn', 'QOOLshsQvpY', 'https://i.ytimg.com/vi/QOOLshsQvpY/mqdefault.jpg', '2025-09-26 22:30:34.000', '2025-09-26 23:05:19.000', '2025-09-26 23:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('뉴럴링크를 만든 이유? #shorts', 'TjSsziG7Z0o', 'https://i.ytimg.com/vi/TjSsziG7Z0o/mqdefault.jpg', '2025-09-26 21:00:56.000', '2025-09-26 21:05:13.000', '2025-09-26 21:05:13.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('캐릭터 교체 AI, 유료모델 압살하는 오픈소스 등장 #shorts', 'oBaP824pefY', 'https://i.ytimg.com/vi/oBaP824pefY/mqdefault.jpg', '2025-09-26 19:02:21.000', '2025-09-26 19:05:16.000', '2025-09-26 19:05:16.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('유튜브에 온갖 AI 다 들어온다!! #shorts', 'X8_uuMnHBqs', 'https://i.ytimg.com/vi/X8_uuMnHBqs/mqdefault.jpg', '2025-09-26 17:09:35.000', '2025-09-26 18:05:15.000', '2025-09-26 18:05:15.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Numpy Full Course 2026 | Numpy Tutorial for Data Analytics | Numpy in Python | Simplilearn', 'axd4UQg9vPw', 'https://i.ytimg.com/vi/axd4UQg9vPw/mqdefault.jpg', '2025-09-26 15:30:01.000', '2025-09-26 17:05:19.000', '2025-09-26 17:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('스팀 무료게임 받다가 4천만원 털림', 'K3l2DEEpOOE', 'https://i.ytimg.com/vi/K3l2DEEpOOE/mqdefault.jpg', '2025-09-26 12:00:31.000', '2025-09-26 17:05:15.000', '2025-09-26 17:05:15.000', 35);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Data Scientist Salary: What You Can Earn in 2025 #shorts #simplilearn', 'SZ4KoyxpU6w', 'https://i.ytimg.com/vi/SZ4KoyxpU6w/mqdefault.jpg', '2025-09-26 01:30:09.000', '2025-09-26 02:05:18.000', '2025-09-26 02:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('AI-Powered Decision Making Programme - IIM Kozhikode | AI Course | AI Certification | Simplilearn', 'Lux49hW6UnA', 'https://i.ytimg.com/vi/Lux49hW6UnA/mqdefault.jpg', '2025-09-26 00:30:18.000', '2025-09-26 01:05:18.000', '2025-09-26 01:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Cloud Practitioner Salary: What You Can Earn in 2025 #shorts #simplilearn', 'evftU4C_COE', 'https://i.ytimg.com/vi/evftU4C_COE/mqdefault.jpg', '2025-09-26 00:05:14.000', '2025-09-26 01:05:18.000', '2025-09-26 01:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('HTML Interview Questions And Answers | HTML Interview Questions For Freshers | Simplilearn', 'Jw6ntt0YQzk', 'https://i.ytimg.com/vi/Jw6ntt0YQzk/mqdefault.jpg', '2025-09-25 23:15:03.000', '2025-09-26 00:05:18.000', '2025-09-26 00:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Supply Chain Management Full Course 2025 | Digital Supply Chain Management Tutorial | Simplilearn', 'bZU6b8R22Uk', 'https://i.ytimg.com/vi/bZU6b8R22Uk/mqdefault.jpg', '2025-09-25 22:30:43.000', '2025-09-25 23:05:18.000', '2025-09-25 23:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('AI님께 예의 차리는 법 #shorts', '2UvlFtYWGX4', 'https://i.ytimg.com/vi/2UvlFtYWGX4/mqdefault.jpg', '2025-09-25 22:00:05.000', '2025-09-25 22:05:14.000', '2025-09-25 22:05:14.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('테세우스의 배 #shorts', 'DTqLT54MqEI', 'https://i.ytimg.com/vi/DTqLT54MqEI/mqdefault.jpg', '2025-09-25 21:00:22.000', '2025-09-25 21:05:15.000', '2025-09-25 21:05:15.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('크롬에 도입된 구글의 사기템 #shorts', 'Ux4LKYhnPNs', 'https://i.ytimg.com/vi/Ux4LKYhnPNs/mqdefault.jpg', '2025-09-25 18:37:17.000', '2025-09-25 19:05:13.000', '2025-09-25 19:05:13.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('메타, 디스플레이가 달린 스마트 안경 공개 #shorts', 'kgJPIqh60XM', 'https://i.ytimg.com/vi/kgJPIqh60XM/mqdefault.jpg', '2025-09-25 18:34:28.000', '2025-09-25 19:05:13.000', '2025-09-25 19:05:13.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('AI Mastery Full Course | AI Tutorial for Beginners | Artificial Intelligence Course | Simplilearn', 'BTTS8jKStWc', 'https://i.ytimg.com/vi/BTTS8jKStWc/mqdefault_live.jpg', '2025-09-25 14:32:48.000', '2025-09-25 17:05:18.000', '2025-09-25 17:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Email Marketing Full Course 2026 | Email Marketing Tutorial for Beginners | Simplilearn', 'DvwUgqX3ZF4', 'https://i.ytimg.com/vi/DvwUgqX3ZF4/mqdefault.jpg', '2025-09-25 13:33:41.000', '2025-09-25 17:05:18.000', '2025-09-25 17:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥GitHub Copilot vs Microsoft Copilot  #shorts #simplilearn', '4P57yDAoTzU', 'https://i.ytimg.com/vi/4P57yDAoTzU/mqdefault.jpg', '2025-09-25 01:30:05.000', '2025-09-25 02:05:18.000', '2025-09-25 02:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Junior Software Developer vs Senior developer  #shorts #simplilearn', 'cNpHKcc8WzQ', 'https://i.ytimg.com/vi/cNpHKcc8WzQ/mqdefault.jpg', '2025-09-25 00:37:10.000', '2025-09-25 01:05:19.000', '2025-09-25 01:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Power BI Full Course 2026 | Power BI Tutorial for Beginners | Power BI Course | Simplilearn', '3HI1KZ4eGaQ', 'https://i.ytimg.com/vi/3HI1KZ4eGaQ/mqdefault.jpg', '2025-09-24 22:30:06.000', '2025-09-24 23:05:18.000', '2025-09-24 23:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Introduction to Linux | Linux Tutorial For Beginners 2025 | Linux For Ethical Hacking | Simplilearn', '_Q1qTiVJd5s', 'https://i.ytimg.com/vi/_Q1qTiVJd5s/mqdefault_live.jpg', '2025-09-24 20:44:35.000', '2025-09-24 21:05:19.000', '2025-09-24 21:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('이번 롯데카드 해킹사태가 심각한 이유 #shorts', 'HT6w_3WtkuI', 'https://i.ytimg.com/vi/HT6w_3WtkuI/mqdefault.jpg', '2025-09-24 20:10:47.000', '2025-09-24 21:05:14.000', '2025-09-24 21:05:14.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Deep Learning Full Course 2026 | Deep Learning Tutorial for Beginners | Deep Learning | Simplilearn', 'cH4cdV3gjy0', 'https://i.ytimg.com/vi/cH4cdV3gjy0/mqdefault.jpg', '2025-09-24 17:30:31.000', '2025-09-24 18:05:19.000', '2025-09-24 18:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Deep Learning With Python and Neural Networking Course | Deep Learning Tutorial | Simplilearn', '0-9S0XKkrYg', 'https://i.ytimg.com/vi/0-9S0XKkrYg/mqdefault_live.jpg', '2025-09-24 15:38:45.000', '2025-09-24 17:05:19.000', '2025-09-24 17:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('밝혀진 KT 소액결제 해킹 수법 #shorts', 'YyB9dn04Ce4', 'https://i.ytimg.com/vi/YyB9dn04Ce4/mqdefault.jpg', '2025-09-24 15:00:34.000', '2025-09-24 17:05:15.000', '2025-09-24 17:05:15.000', 38);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Machine Learning Engineer Salary : What You Can Earn  #shorts #simplilearn', 'NwBJdX3Y5Kc', 'https://i.ytimg.com/vi/NwBJdX3Y5Kc/mqdefault.jpg', '2025-09-24 01:30:09.000', '2025-09-24 02:05:19.000', '2025-09-24 02:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Agentic Coding with Claude Code | Agentic AI Coding Tutorial | Coding With Claude Code | Simplilearn', 'R5znTdaLTrg', 'https://i.ytimg.com/vi/R5znTdaLTrg/mqdefault.jpg', '2025-09-24 01:22:29.000', '2025-09-24 02:05:19.000', '2025-09-24 02:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Flat design has advantages, but it''s no Persona 5.', 'k_n_skVRchQ', 'https://i.ytimg.com/vi/k_n_skVRchQ/mqdefault.jpg', '2025-09-24 00:15:12.000', '2025-09-24 01:05:18.000', '2025-09-24 01:05:18.000', 33);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('🔥Gemini Can Now Watch YouTube Videos For You! #shorts #simplilearn', 'KwMDcSmwQBc', 'https://i.ytimg.com/vi/KwMDcSmwQBc/mqdefault.jpg', '2025-09-23 23:56:00.000', '2025-09-24 00:05:19.000', '2025-09-24 00:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Application Security Full Course 2025 | Application Security Tutorial For Beginners | Simplilearn', 'mVCPqDo2wiM', 'https://i.ytimg.com/vi/mVCPqDo2wiM/mqdefault.jpg', '2025-09-23 22:30:51.000', '2025-09-23 23:05:18.000', '2025-09-23 23:05:18.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('DevOps Tutorial For Beginners | Learn DevOps in 5 Hours | DevOps and Cloud Computing | Simplilearn', 'Nnt1XinUjgA', 'https://i.ytimg.com/vi/Nnt1XinUjgA/mqdefault_live.jpg', '2025-09-23 20:36:29.000', '2025-09-23 21:05:19.000', '2025-09-23 21:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('Simplilearn Reviews | Code to Cyber: How Anirban Unlocked the key to secure AI #GetCertifiedGetAhead', 'zX1LCWF_2PA', 'https://i.ytimg.com/vi/zX1LCWF_2PA/mqdefault.jpg', '2025-09-23 20:31:01.000', '2025-09-23 21:05:19.000', '2025-09-23 21:05:19.000', 30);
INSERT INTO videos
(title, videoId, thumbnail, publishedAt, createdAt, updatedAt, channelId)
VALUES('성인된지 10년만에 운전면허 따는 브이로그 | 직장인 개발자 백수 브이로그', 'XOIyN-7m5ww', 'https://i.ytimg.com/vi/XOIyN-7m5ww/mqdefault.jpg', '2025-09-23 18:40:46.000', '2025-09-23 19:05:14.000', '2025-09-23 19:05:14.000', 37);
