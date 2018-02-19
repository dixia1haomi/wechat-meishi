import { Base } from './Base.js'

class Api extends Base {
  constructor() {
    super()
  }

  // ------------------------------------------------- 卡卷接口测试 ---------------------------------------------------


  // 查询优惠商家列表 || 失败返回1,成功返回0
  selectKajuan(data, callback) {
    this.request({
      url: 'kajuan/select', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 查询指定卡劵(客户端卡劵页用，接受卡劵ID)
  findKajuan(data, callback) {
    this.request({
      url: 'kajuan/find', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 去服务器换signature，接受card_id（用于调用wx.addCard）
  signatureKajuan(data, callback) {
    this.request({
      url: 'kajuan/signature', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 解密wx.addCard成功后返回的code(接受加密code, 解密后用于wx.openCard)
  codeKajuan(data, callback) {
    this.request({
      url: 'kajuan/code', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 更新卡劵剩余数量(接受card_id，表id)
  shengyushuliangKajuan(data, callback) {
    this.request({
      url: 'kajuan/shengyushuliang', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 卡劵领取记录(接受卡劵ID==card_id)
  logKajuan(data, callback) {
    this.request({
      url: 'kajuan/log', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // --------------------------------------------------- 餐厅 ---------------------------------------------------

  // 查询餐厅列表
  listCanting(data, callback) {
    this.request({
      url: 'canting/list', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          // 记录日志
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 查询收藏的餐厅列表（我的-我的收藏使用，接受缓存的收藏数组）
  shoucanglistCanting(data, callback) {
    this.request({
      url: 'canting/shoucanglist', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 查询餐厅详细信息,接受餐厅表ID
  detailCanting(data, callback) {
    this.request({
      url: 'canting/detail', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          // 记录日志
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 餐厅点赞
  dianzanCanting(data, callback) {
    this.request({
      url: 'canting/zan', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // --------------------------------------------------- User ---------------------------------------------------

  // 用户登陆接口(新增/更新userinfo表)
  userLogin(data, callback) {
    this.request({
      url: 'user/login', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // -----检查用户是否登陆过(查数据库userinfo)有返回用户数据，没有返回errorCode==1 -----
  uidCheckInfo(data, callback) {
    this.request({
      url: 'user/check', data: data, sCallback: (res) => {
        if (res.errorCode == 0) { callback && callback(res.data) }
      }
    })
  }


  // 查询我的留言（根据uid-服务器内部获取，page分页,每页20条）
  myLiuyan(data, callback) {
    this.request({
      url: 'user/myliuyan', data: data, sCallback: (res) => {
        console.log('myLiuyan',res)
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          // 记录日志
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }


  // --------------------------------------------------- 留言 ---------------------------------------------------

  // 查询留言列表(接受canting_id,page分页,每页20条)
  listLiuyan(data, callback) {
    this.request({
      url: 'liuyan/list', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

  // 新增留言
  createLiuyan(data, callback) {
    this.request({
      url: 'liuyan/create', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res.data)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }


  // 删除留言
  deleteLiuyan(data, callback) {
    this.request({
      url: 'liuyan/delete', data: data, sCallback: (res) => {
        if (res.errorCode == 0) {
          callback && callback(res)
        } else {
          wx.navigateTo({ url: '/pages/exception/exception' })
        }
      }
    })
  }

}

export { Api }

