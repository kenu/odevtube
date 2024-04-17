function getUri(category = 'dev', lang) {
  if (category === 'dev') {
    category = ''
  }
  if (lang === 'ko') {
    lang = ''
  }
  let uri = '/' + category + '/' + lang
  uri = uri.replace('//', '/')
  uri = uri.replace('/#', '#')
  return uri
}

export default { getUri }
