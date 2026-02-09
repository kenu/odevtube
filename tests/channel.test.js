import dao from '../youtubeDao'

test('채널 목록 조회', async () => {
  const channelList = await dao.findAllChannelList()
  expect(channelList).not.toBeNull()
  expect(channelList.length).not.toBe(0)
  channelList.forEach(channel => {
    expect(typeof channel.isPublic).toBe('boolean');
  });
})

test('최근 업데이트 목록', async () => {
  const channelList = await dao.findAllChannelList(14)
  console.log(channelList.length)
  expect(channelList).not.toBeNull()
  expect(channelList.length).not.toBe(0)
  channelList.forEach(channel => {
    expect(typeof channel.isPublic).toBe('boolean');
  });
})

test('채널 생성 시 isPublic 속성 확인', async () => {
  const testChannelId = 'test_channel_is_public_with_account';
  const testAccountId = 'test-account-id-123';
  const testChannelData = {
    channelId: testChannelId,
    title: 'Test Channel is Public with Account',
    thumbnail: 'http://example.com/thumbnail.jpg',
    customUrl: 'testispublicwithaccount',
    lang: 'en',
    category: 'test',
    isPublic: false,
    accountId: testAccountId,
  };

  // Create the channel
  const createdChannel = await dao.create(testChannelData);
  expect(createdChannel).not.toBeNull();
  expect(createdChannel.channelId).toBe(testChannelId);
  expect(createdChannel.isPublic).toBe(false);
  expect(createdChannel.accountId).toBe(testAccountId);

  // Retrieve the channel to verify
  const retrievedChannel = await dao.findOneByChannelId(testChannelId);
  expect(retrievedChannel).not.toBeNull();
  expect(retrievedChannel.isPublic).toBe(false);
  expect(retrievedChannel.accountId).toBe(testAccountId);

  // Clean up
  await retrievedChannel.destroy();
  const deletedChannel = await dao.findOneByChannelId(testChannelId);
  expect(deletedChannel).toBeNull();
});

test('findAndCountAllVideo public/private filtering', async () => {
  const testAccountId1 = 'test-account-id-1';
  const testAccountId2 = 'test-account-id-2';

  // Create test accounts
  await dao.createAccount({ accountId: testAccountId1, username: 'User1' });
  await dao.createAccount({ accountId: testAccountId2, username: 'User2' });

  // Create test channels
  const channelPublic1 = await dao.create({
    channelId: 'public-channel-1', title: 'Public Channel 1', isPublic: true, accountId: testAccountId1,
    thumbnail: 'thumbnail', customUrl: 'customUrl', lang: 'en', category: 'dev'
  });
  const channelPublic2 = await dao.create({
    channelId: 'public-channel-2', title: 'Public Channel 2', isPublic: true, accountId: testAccountId2,
    thumbnail: 'thumbnail', customUrl: 'customUrl', lang: 'en', category: 'dev'
  });
  const channelPrivate1 = await dao.create({
    channelId: 'private-channel-1', title: 'Private Channel 1', isPublic: false, accountId: testAccountId1,
    thumbnail: 'thumbnail', customUrl: 'customUrl', lang: 'en', category: 'dev'
  });
  const channelPrivate2 = await dao.create({
    channelId: 'private-channel-2', title: 'Private Channel 2', isPublic: false, accountId: testAccountId2,
    thumbnail: 'thumbnail', customUrl: 'customUrl', lang: 'en', category: 'dev'
  });

  // Test Case 1: No accountId (anonymous user) - should only see public channels
  let result = await dao.findAndCountAllVideo('dev', 'en', 0, 10, '', null, null, null);
  let channelTitles = result.rows.map(video => video.Channel.title);
  expect(channelTitles).toContain('Public Channel 1');
  expect(channelTitles).toContain('Public Channel 2');
  expect(channelTitles).not.toContain('Private Channel 1');
  expect(channelTitles).not.toContain('Private Channel 2');
  
  // Test Case 2: Logged in as testAccountId1 - should see public channels and private channels owned by testAccountId1
  result = await dao.findAndCountAllVideo('dev', 'en', 0, 10, '', null, null, testAccountId1);
  channelTitles = result.rows.map(video => video.Channel.title);
  expect(channelTitles).toContain('Public Channel 1');
  expect(channelTitles).toContain('Public Channel 2');
  expect(channelTitles).toContain('Private Channel 1');
  expect(channelTitles).not.toContain('Private Channel 2');

  // Test Case 3: Logged in as testAccountId2 - should see public channels and private channels owned by testAccountId2
  result = await dao.findAndCountAllVideo('dev', 'en', 0, 10, '', null, null, testAccountId2);
  channelTitles = result.rows.map(video => video.Channel.title);
  expect(channelTitles).toContain('Public Channel 1');
  expect(channelTitles).toContain('Public Channel 2');
  expect(channelTitles).not.toContain('Private Channel 1');
  expect(channelTitles).toContain('Private Channel 2');

  // Clean up
  await channelPublic1.destroy();
  await channelPublic2.destroy();
  await channelPrivate1.destroy();
  await channelPrivate2.destroy();
  // Clean up accounts - assuming there is a way to remove accounts if necessary for true isolation
  // For now, update subscriptionTier to free and leave them as they might be referenced by other tests
});
