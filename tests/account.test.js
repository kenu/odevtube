import dao from '../youtubeDao.js'
// github profile 저장
// login update
// 탈퇴
// github login data

const githubDataString = {  id: '733631',
  nodeId: 'MDQ6pXNlcjcxODY5MQ==',
  displayName: 'kenu',
  username: 'kenu',
  profileUrl: 'https://github.com/kenu',
  emails: [ { value: 'kenu.heo@gmail.com' } ],
  photos: [ { value: 'https://avatars.githubusercontent.com/u/733631?v=4' } ],
  provider: 'github',
  _raw: '{"login":"kenu","id":733631,"node_id":"MDQ6pXNlcjcxODY5MQ==","avatar_url":"https://avatars.githubusercontent.com/u/733631?v=4","gravatar_id":"","url":"https://api.github.com/users/kenu","html_url":"https://github.com/kenu","followers_url":"https://api.github.com/users/kenu/followers","following_url":"https://api.github.com/users/kenu/following{/other_user}","gists_url":"https://api.github.com/users/kenu/gists{/gist_id}","starred_url":"https://api.github.com/users/kenu/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/kenu/subscriptions","organizations_url":"https://api.github.com/users/kenu/orgs","repos_url":"https://api.github.com/users/kenu/repos","events_url":"https://api.github.com/users/kenu/events{/privacy}","received_events_url":"https://api.github.com/users/kenu/received_events","type":"User","site_admin":false,"name":"kenu","company":"OKKY(OKJSP), OKdevTV","blog":"https://okdevtv.com","location":"seoul","email":"kenu.heo@gmail.com","hireable":true,"bio":"https://okdevtv.com\\r\\nhttps://youtube.com/@KenuHeo\\r\\nhttps://okky.kr\\r\\n","twitter_username":"kenu0000","public_repos":261,"public_gists":17,"followers":654,"following":334,"created_at":"2011-04-09T03:22:05Z","updated_at":"2024-04-14T05:25:00Z"}',
  _json: {
    login: 'kenu',
    id: 733631,
    node_id: 'MDQ6pXNlcjcxODY5MQ==',
    avatar_url: 'https://avatars.githubusercontent.com/u/733631?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/kenu',
    html_url: 'https://github.com/kenu',
    followers_url: 'https://api.github.com/users/kenu/followers',
    following_url: 'https://api.github.com/users/kenu/following{/other_user}',
    gists_url: 'https://api.github.com/users/kenu/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/kenu/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/kenu/subscriptions',
    organizations_url: 'https://api.github.com/users/kenu/orgs',
    repos_url: 'https://api.github.com/users/kenu/repos',
    events_url: 'https://api.github.com/users/kenu/events{/privacy}',
    received_events_url: 'https://api.github.com/users/kenu/received_events',
    type: 'User',
    site_admin: false,
    name: 'kenu',
    company: 'OKKY(OKJSP), OKdevTV',
    blog: 'https://okdevtv.com',
    location: 'seoul',
    email: 'kenu.heo@gmail.com',
    hireable: true,
    bio: 'https://okdevtv.com\r\nhttps://youtube.com/@KenuHeo\r\nhttps://okky.kr\r\n',
    twitter_username: 'kenu0000',
    public_repos: 261,
    public_gists: 17,
    followers: 654,
    following: 334,
    created_at: '2011-04-09T03:22:05Z',
    updated_at: '2024-04-14T05:25:00Z'
  }
}

const githubDataString2 = {
  id: '190916919',
  nodeId: 'U_kgDOC8kAVw',
  displayName: null,
  username: 'kenuheo',
  profileUrl: 'https://github.com/kenuheo',
  photos: [
    { value: 'https://avatars.githubusercontent.com/u/190916919?v=4' }
  ],
  provider: 'github',
  _raw: '{"login":"kenuheo","id":190916919,"node_id":"U_kgDOC8kAVw","avatar_url":"https://avatars.githubusercontent.com/u/190916919?v=4","gravatar_id":"","url":"https://api.github.com/users/kenuheo","html_url":"https://github.com/kenuheo","followers_url":"https://api.github.com/users/kenuheo/followers","following_url":"https://api.github.com/users/kenuheo/following{/other_user}","gists_url":"https://api.github.com/users/kenuheo/gists{/gist_id}","starred_url":"https://api.github.com/users/kenuheo/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/kenuheo/subscriptions","organizations_url":"https://api.github.com/users/kenuheo/orgs","repos_url":"https://api.github.com/users/kenuheo/repos","events_url":"https://api.github.com/users/kenuheo/events{/privacy}","received_events_url":"https://api.github.com/users/kenuheo/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":3,"public_gists":0,"followers":5,"following":18,"created_at":"2023-04-13T00:03:29Z","updated_at":"2024-04-14T20:26:08Z"}',
  _json: {
    login: 'kenuheo',
    id: 190916919,
    node_id: 'U_kgDOC8kAVw',
    avatar_url: 'https://avatars.githubusercontent.com/u/190916919?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/kenuheo',
    html_url: 'https://github.com/kenuheo',
    followers_url: 'https://api.github.com/users/kenuheo/followers',
    following_url: 'https://api.github.com/users/kenuheo/following{/other_user}',
    gists_url: 'https://api.github.com/users/kenuheo/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/kenuheo/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/kenuheo/subscriptions',
    organizations_url: 'https://api.github.com/users/kenuheo/orgs',
    repos_url: 'https://api.github.com/users/kenuheo/repos',
    events_url: 'https://api.github.com/users/kenuheo/events{/privacy}',
    received_events_url: 'https://api.github.com/users/kenuheo/received_events',
    type: 'User',
    site_admin: false,
    name: null,
    company: null,
    blog: '',
    location: null,
    email: null,
    hireable: null,
    bio: null,
    twitter_username: null,
    public_repos: 3,
    public_gists: 0,
    followers: 5,
    following: 18,
    created_at: '2023-04-13T00:03:29Z',
    updated_at: '2024-04-14T20:26:08Z'
  }
}

test('github login', async () => {
  const data = githubDataString2
  const account = {
    accountId: data.id,
    username: data.username,
    email: data._json.email,
    photo: data.photos[0].value,
    provider: data.provider,
  }
  const acnt = await dao.createAccount(account)
  console.log(acnt)
})
