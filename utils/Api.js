import { Base } from './Base.js'
const base = new Base()

class Api {
  constructor() { }

  // ------------------------------餐厅----------------------------------

  // 查询餐厅列表
  listCanting(data, callback) {
    base.request({ url: 'canting/list', data: data, sCallback: (res) => { callback && callback(res) } })
  }
  // 查询餐厅详细信息
  detailCanting(data, callback) {
    base.request({ url: 'canting/detail', data: data, sCallback: (res) => { callback && callback(res) } })
  }
  // 餐厅星评投票接口
  xingpingCanting(data, callback) {
    base.request({ url: 'canting/xingping', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // ------------------------------User----------------------------------

  // 查询用户关联的星评表
  userXingping(data,callback){
    base.request({ url: 'user/xingping', data: data, sCallback: (res) => { callback && callback(res) } })
  }

  // 用户登陆接口(新增/更新userinfo表)
  userLogin(data,callback){
    base.request({ url: 'user/login', data: data, sCallback: (res) => { callback && callback(res) } })
  }
}

export { Api }