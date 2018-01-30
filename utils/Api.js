import { Base } from './Base.js'
const base = new Base()

class Api {
  constructor() { }

  // ------------------------------餐厅----------------------------------

  // 查询餐厅列表
  listCanting(data, callback) {
    base.request({ url: 'canting/list', data: data, sCallback: (res) => { callback && callback(res) } })
  }
  // 查询收藏的餐厅列表（我的-我的收藏使用，接受缓存的收藏数组）
  shoucanglistCanting(data, callback) {
    base.request({ url: 'canting/shoucanglist', data: data, sCallback: (res) => { callback && callback(res) } })
  }
  // 查询餐厅详细信息
  detailCanting(data, callback) {
    base.request({ url: 'canting/detail', data: data, sCallback: (res) => { callback && callback(res) } })
  }
  // 餐厅点赞
  dianzanCanting(data, callback) {
    base.request({ url: 'canting/zan', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // ------------------------------User----------------------------------

  // 用户登陆接口(新增/更新userinfo表)
  userLogin(data, callback) {
    base.request({ url: 'user/login', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // // 查询用户关联的星评 shanch
  // userXingping(data, callback) {
  //   base.request({ url: 'user/xingping', data: data, sCallback: (res) => { callback && callback(res) } })
  // }

  // 查询用户关联的话题(接口内部获取uid)
  userHuati(data, callback) {
    base.request({ url: 'user/huati', data: data, sCallback: (res) => { callback && callback(res) } })
  }


  // ------------------------------话题----------------------------------

  // 查询话题列表
  listHuati(data, callback) {
    base.request({ url: 'huati/list', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 查询话题内容(接受id)
  detailHuati(data, callback) {
    base.request({ url: 'huati/detail', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 用户参与话题(接受话题id，内容，服务器内部取uid)
  createUserHuati(data, callback) {
    base.request({ url: 'huati/createhuati', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 我的话题(接受uid)（我的-我的话题）
  myHuati(data, callback) {
    base.request({ url: 'huati/myhuati', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 删除我的一条话题(接受id,服务器获取uid)（我的-我的话题）
  deleteMyHuati(data, callback) {
    base.request({ url: 'huati/deletehuati', data: data, sCallback: (res) => { callback && callback(res) } })
  }


  // ------------------------------留言----------------------------------
  // 查询留言列表(接受canting_id,page分页,每页20条)
  listLiuyan(data, callback) {
    base.request({ url: 'liuyan/list', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 新增留言
  createLiuyan(data, callback) {
    base.request({ url: 'liuyan/create', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 查询我的留言（根据uid-服务器内部获取，page分页,每页20条）
  myLiuyan(data, callback) {
    base.request({ url: 'liuyan/myliuyan', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 删除留言
  deleteLiuyan(data, callback) {
    base.request({ url: 'liuyan/delete', data: data, sCallback: (res) => { callback && callback(res) } })
  }

}

export { Api }

