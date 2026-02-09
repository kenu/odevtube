function getUri(category = 'dev', lang = '') {
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

function parseYoutubeUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null;
  }
}

export { getUri, parseYoutubeUrl }
export default { getUri, parseYoutubeUrl }
