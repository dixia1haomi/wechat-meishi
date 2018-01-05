import { Config } from '../../utils/Config.js'

Page({

  data: {
    // Config
    quyuList: Config.quyu,
    caixiList: Config.caixi,
    changjingList: Config.changjing,
    // xingjiList: Config.xingji,

    // params
    params: {}
  },


  onLoad: function (op) {

  },

  // quyuTap 场景
  changjingTap(e) {
    console.log('场景',e.currentTarget.id)
    let id = e.currentTarget.id, changjingList = this.data.changjingList
    for (let i in changjingList) {
      if (id == changjingList[i].id) {
        changjingList[i].open = true
      } else {
        changjingList[i].open = false
      }
    }
    this.setData({ changjingList: changjingList, 'params.changjing': id })
  },

  // quyuTap 区域
  quyuTap(e) {
    console.log('区域',e.currentTarget.id)
    let id = e.currentTarget.id, quyuList = this.data.quyuList
    for (let i in quyuList) {
      if (id == quyuList[i].id) {
        quyuList[i].open = true
      } else {
        quyuList[i].open = false
      }
    }
    this.setData({ quyuList: quyuList, 'params.quyu': id })
  },

  // caixiTap 菜系
  caixiTap(e) {
    console.log('菜系',e.currentTarget.id)
    let id = e.currentTarget.id, caixiList = this.data.caixiList
    for (let i in caixiList) {
      if (id == caixiList[i].id) {
        caixiList[i].open = true
      } else {
        caixiList[i].open = false
      }
    }
    this.setData({ caixiList: caixiList, 'params.caixi': id })
  },

  // quyuTap 星级
  // xingjiTap(e) {
  //   console.log('星级',e.currentTarget.id)
  //   let id = e.currentTarget.id, xingjiList = this.data.xingjiList
  //   for (let i in xingjiList) {
  //     if (id == xingjiList[i].id) {
  //       xingjiList[i].open = true
  //     } else {
  //       xingjiList[i].open = false
  //     }
  //   }
  //   this.setData({ xingjiList: xingjiList, 'params.xing': id })
  // },

  // 重置
  chongzhi() {
    this.setData({
      params: {},
      quyuList: Config.quyu,
      caixiList: Config.caixi,
      changjingList: Config.changjing,
      xingjiList: Config.xingji,
    })
  },

  // 确定
  queding() {
    let shaixuanParams = this.data.params
    // 获取canting-list的实例
    let page = getCurrentPages()
    let backPage = page[page.length - 2]

    // 设置canting-list的data数据
    backPage.setData({ shaixuanParams: shaixuanParams }, () => {
      wx.navigateBack({ delta: 1 })
    })
  },
})