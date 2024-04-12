const youtube = require('./youtub')

test('channel', channel)

function channel() {
  youtube.activities?.list(
    {
      channelId: 'UCHbXBo1fQAg7j0D7HKKYHJg',
      maxResults: 50, // 가져올 동영상의 최대 수
      order: 'date', // 최신 순으로 정렬
      part: 'snippet,contentDetails', // 필요한 정보를 지정합니다.
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      const { items } = res.data
      const list = items.map((item) => {
        return (item.snippet.type)
      })
      console.log(list)
    }
  )
}
