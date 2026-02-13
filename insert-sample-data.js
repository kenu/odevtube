import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'odevtube',
  'devuser',
  'devpass',
  {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
  }
);

async function insertSampleData() {
  try {
    console.log('샘플 데이터 추가 시작...\n');

    // 1. 샘플 계정 추가
    console.log('1. 테스트 계정 추가...');
    await sequelize.query(`
      INSERT INTO Accounts (accountId, username, email, photo, provider, subscriptionTier, createdAt, updatedAt)
      VALUES
        ('test-account-1', 'testuser', 'test@example.com', 'https://avatars.githubusercontent.com/u/1?v=4', 'github', 'premium', NOW(), NOW()),
        ('test-account-2', 'demouser', 'demo@example.com', 'https://avatars.githubusercontent.com/u/2?v=4', 'github', 'free', NOW(), NOW())
      ON DUPLICATE KEY UPDATE username=username;
    `);
    console.log('   ✓ 계정 2개 추가 완료\n');

    // 2. 샘플 채널 추가 (다양한 카테고리)
    console.log('2. 샘플 채널 추가...');
    await sequelize.query(`
      INSERT INTO Channels (channelId, title, thumbnail, customUrl, lang, category, isPublic, accountId, createdAt, updatedAt)
      VALUES
        ('UC_x5XG1OV2P6uZZ5FSM9Ttw', 'Google Developers', 'https://yt3.googleusercontent.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s240-c-k-c0x00ffffff-no-rj', '@GoogleDevelopers', 'en', 'dev', 1, NULL, NOW(), NOW()),
        ('UCW5YeuERMmlnqo4oq8vwUpg', 'Net Ninja', 'https://yt3.googleusercontent.com/ytc/AIdro_kGV-4lKVH_WcjN0XQpz6C1OdHt_LL2Gkx5Gz03WxJZTrY=s240-c-k-c0x00ffffff-no-rj', '@NetNinja', 'en', 'dev', 1, NULL, NOW(), NOW()),
        ('UCsBjURrPoezykLs9EqgamOA', 'Fireship', 'https://yt3.googleusercontent.com/ytc/AIdro_l5KBCG2LE-Bwm4kbHbT2zDz7c-KXuVzf8yTbMPuLHUQCQ=s240-c-k-c0x00ffffff-no-rj', '@Fireship', 'en', 'dev', 1, NULL, NOW(), NOW()),
        ('UC29ju8bIPH5as8OGnQzwJyA', 'Traversy Media', 'https://yt3.googleusercontent.com/ytc/AIdro_kGV-4KK8jCmTnqgvmXzr6KXg7dLPrEHiYJfJKrP0k=s240-c-k-c0x00ffffff-no-rj', '@TraversyMedia', 'en', 'dev', 1, NULL, NOW(), NOW()),
        ('UCBZiUUYeLfS5rIj4TQvgSvA', '백종원', 'https://yt3.googleusercontent.com/ytc/AIdro_mN5c6KTvnMdWQrG7iN2IxUKYLFxBqYmPxqWcVyFBl3ZQ=s240-c-k-c0x00ffffff-no-rj', '@paikfoodie', 'ko', 'food', 1, NULL, NOW(), NOW()),
        ('UCbkwjQv-VzJZTvYzHZvWPWQ', '냉장고를부탁해', 'https://yt3.googleusercontent.com/ytc/AIdro_n5f7i5gBKZGvQGJNKLLxvH4Ks83DKp8kXPvEHm=s240-c-k-c0x00ffffff-no-rj', '@pleaserefrigerator', 'ko', 'food', 1, NULL, NOW(), NOW()),
        ('UCrPuHpHGLNGvvC-PVvPYPXQ', 'HYBE LABELS', 'https://yt3.googleusercontent.com/eqUXFb3j0tGBb21MBJQ5FIKUAU3HhP6c0xGh0KnEQaLvzN7I8F0dKAyWX5ByJ8rB1gUvXy9B=s240-c-k-c0x00ffffff-no-rj', '@HYBELABELS', 'ko', 'kpop', 1, NULL, NOW(), NOW()),
        ('UCOmHUn--16B90oW2L6FRR3A', 'BLACKPINK', 'https://yt3.googleusercontent.com/hIcQF3-mWMF9IYS0hqxFiKcKGXyR1bZ5mL2OZ0QMNwqzKNnJJpCZcJzCjPh3DLjIrGwKvUmb=s240-c-k-c0x00ffffff-no-rj', '@BLACKPINK', 'ko', 'kpop', 1, NULL, NOW(), NOW()),
        ('UCcdwLMPsaU2ezNSJU1nFoBQ', '손예진', 'https://yt3.googleusercontent.com/ytc/AIdro_lyxZt6NSqg5I0qL5w1L8Iw_8rWBuQc_HRJ8T4=s240-c-k-c0x00ffffff-no-rj', '@sonyejin', 'ko', 'actor', 1, NULL, NOW(), NOW()),
        ('UCGqBILpnIYxn0N_A2B6-eKQ', '차은우', 'https://yt3.googleusercontent.com/ytc/AIdro_k6bKJqPNqz5IZpqPPmLx3p5hWZK9xQgqG1g=s240-c-k-c0x00ffffff-no-rj', '@chaeunwoo', 'ko', 'actor', 1, NULL, NOW(), NOW())
      ON DUPLICATE KEY UPDATE title=title;
    `);
    console.log('   ✓ 채널 10개 추가 완료\n');

    // 3. 사용자-채널 연결 (testuser의 채널)
    console.log('3. testuser 채널 연결...');
    const accounts = await sequelize.query(`SELECT id, accountId FROM Accounts WHERE username='testuser'`, {
      type: sequelize.QueryTypes.SELECT
    });
    const channels = await sequelize.query(`SELECT id, channelId, title FROM Channels LIMIT 6`, {
      type: sequelize.QueryTypes.SELECT
    });

    if (accounts.length > 0 && channels.length > 0) {
      const accountId = accounts[0].id;

      for (let i = 0; i < Math.min(6, channels.length); i++) {
        await sequelize.query(`
          INSERT INTO UserChannels (AccountId, ChannelId, createdAt, updatedAt)
          VALUES (${accountId}, ${channels[i].id}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE updatedAt=NOW();
        `);
      }

      // 일부 채널을 Private으로 설정
      if (channels.length >= 2) {
        await sequelize.query(`
          UPDATE Channels SET isPublic = 0
          WHERE channelId IN ('${channels[0].channelId}', '${channels[1].channelId}')
        `);
        console.log(`   ✓ 2개 채널을 Private으로 설정`);
      }

      console.log(`   ✓ testuser에 ${Math.min(6, channels.length)}개 채널 연결 완료\n`);
    }

    // 4. 샘플 비디오 추가
    console.log('4. 샘플 비디오 추가...');
    const channelsForVideos = await sequelize.query(`SELECT id, channelId FROM Channels LIMIT 5`, {
      type: sequelize.QueryTypes.SELECT
    });

    const sampleVideos = [
      { title: 'Introduction to Web Development', videoId: 'video001', thumbnail: 'https://i.ytimg.com/vi/video001/mqdefault.jpg' },
      { title: 'JavaScript Tutorial for Beginners', videoId: 'video002', thumbnail: 'https://i.ytimg.com/vi/video002/mqdefault.jpg' },
      { title: 'React Crash Course', videoId: 'video003', thumbnail: 'https://i.ytimg.com/vi/video003/mqdefault.jpg' },
      { title: 'Node.js Complete Guide', videoId: 'video004', thumbnail: 'https://i.ytimg.com/vi/video004/mqdefault.jpg' },
      { title: 'Database Design Fundamentals', videoId: 'video005', thumbnail: 'https://i.ytimg.com/vi/video005/mqdefault.jpg' },
    ];

    for (let i = 0; i < Math.min(channelsForVideos.length, sampleVideos.length); i++) {
      const video = sampleVideos[i];
      const channel = channelsForVideos[i];

      await sequelize.query(`
        INSERT INTO Videos (title, videoId, thumbnail, publishedAt, ChannelId, createdAt, updatedAt)
        VALUES (
          '${video.title}',
          '${video.videoId}',
          '${video.thumbnail}',
          DATE_SUB(NOW(), INTERVAL ${i} DAY),
          ${channel.id},
          NOW(),
          NOW()
        )
        ON DUPLICATE KEY UPDATE title=title;
      `);
    }
    console.log(`   ✓ 비디오 ${sampleVideos.length}개 추가 완료\n`);

    // 5. 요약 정보 출력
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 샘플 데이터 추가 완료!\n');

    const accountCount = await sequelize.query(`SELECT COUNT(*) as count FROM Accounts`, {
      type: sequelize.QueryTypes.SELECT
    });
    const channelCount = await sequelize.query(`SELECT COUNT(*) as count FROM Channels`, {
      type: sequelize.QueryTypes.SELECT
    });
    const videoCount = await sequelize.query(`SELECT COUNT(*) as count FROM Videos`, {
      type: sequelize.QueryTypes.SELECT
    });
    const publicChannels = await sequelize.query(`SELECT COUNT(*) as count FROM Channels WHERE isPublic = 1`, {
      type: sequelize.QueryTypes.SELECT
    });
    const privateChannels = await sequelize.query(`SELECT COUNT(*) as count FROM Channels WHERE isPublic = 0`, {
      type: sequelize.QueryTypes.SELECT
    });

    console.log('📊 데이터베이스 현황:');
    console.log(`   • 계정: ${accountCount[0].count}개`);
    console.log(`   • 채널: ${channelCount[0].count}개`);
    console.log(`     - Public: ${publicChannels[0].count}개 🌍`);
    console.log(`     - Private: ${privateChannels[0].count}개 🔒`);
    console.log(`   • 비디오: ${videoCount[0].count}개\n`);

    console.log('🔑 테스트 계정:');
    console.log('   • username: testuser (프리미엄)');
    console.log('   • username: demouser (무료)\n');

    console.log('💡 테스트 방법:');
    console.log('   1. GitHub로 로그인');
    console.log('   2. /@testuser 페이지 확인');
    console.log('   3. /@testuser/manage 에서 Public/Private 토글 테스트');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ 샘플 데이터 추가 실패:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

insertSampleData();
