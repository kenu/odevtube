import dao from '../youtubeDao'

// pagination test
test('pagination', async () => {
  const result = await dao.getPagedYoutubes({
    page: 1,
    pageSize: 3,
  })
  expect(result).not.toBeNull()
  expect(result.count).not.toBe(0)
  expect(result.rows.length).toBe(3)

  const result2 = await dao.getPagedYoutubes({
    page: 2,
    pageSize: 3,
  })
  expect(result2).not.toBeNull()
  expect(result2.count).not.toBe(0)
  expect(result2.rows.length).toBe(3)

  // check result, result2 should be different
  expect(result.rows).not.toEqual(result2.rows)
  expect(result.rows[0].videoId).not.toEqual(result2.rows[0].videoId)
})
