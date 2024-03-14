describe('test', () => {
  it('test', () => {
    const thumbnail = 'https://i.ytimg.com/vi/hHAqR-qKZjo/default.jpg'
    const videoId = 'hHAqR-qKZjo'
    expect(getVideoId(thumbnail)).toBe(videoId);
  });
});
function getVideoId(thumbnail) {
  const regex = /^https:\/\/i\.ytimg\.com\/vi\/([^/]+)\/.*$/
  const match = thumbnail.match(regex)
  if (match) {
    return match[1]
  }
  return null
}
