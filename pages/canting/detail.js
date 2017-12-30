import { Api } from '../../utils/Api.js'

const api = new Api()

Page({

  data: {
    detailRes: {},
    xingping: true,
  },

  onLoad: function (op) {
    this._load(op.id)
    this.qwe(op.id)
    // let info = wx.getStorageSync('userInfo')
    // this.setData({ info: info })
  },

  _load(id) {
    api.detailCanting({ id: id }, res => { this.setData({ detailRes: res }) })
  },

  // 星评投票
  xingping(e) {
    let xingping = e.currentTarget.dataset.xingping
    let canting_id = this.data.detailRes.id
    console.log(e, xingping)
    // (*登陆验证) -> 星评+1接口(携带星级，餐厅id，内部获取uid) -> 成功后 -> 记录（根据uid记录餐厅id） -> 禁用星评

    // 用户查看餐厅详情（初始化时）时取星评数据缓存起来* （考虑）

    api.xingpingCanting({ id: canting_id, xing: xingping }, res => {
      console.log('投票', res)
      // 每次投票成功后再调用userXingping接口（获取xingping表数据设置缓存）
      api.userXingping({}, res => {
        console.log('获取用户星评list', res)
        let list = res.xingping.canting_list
        console.log(JSON.parse(list))
        wx.setStorageSync('xingpinglist', JSON.parse(list))
        this.qwe(canting_id)
      })
    })
  },

  // 取缓存数据禁用投票
  qwe(id) {
    let xingpinglist = wx.getStorageSync('xingpinglist')
    for (let i in xingpinglist) {
      if (xingpinglist[i] == id) {
        this.setData({ xingping: false })
      }
    }
  }
})