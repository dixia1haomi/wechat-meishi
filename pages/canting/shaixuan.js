// import { Config } from '../../utils/Config.js'

Page({

  data: {
    // Config
    // quyuList: Config.quyu,
    // caixiList: Config.caixi,
    // changjingList: Config.changjing,
    // xingjiList: Config.xingji,

    // params
    params: {}
  },


  onLoad: function (op) {

  },

  // quyuTap 场景
  // changjingTap(e) {
  //   console.log('场景', e.currentTarget.id)
  //   let id = e.currentTarget.id, changjingList = this.data.changjingList
  //   let changjingParam = -1
  //   for (let i in changjingList) {
  //     if (id == changjingList[i].id && changjingList[i].open != true) {
  //       changjingList[i].open = true
  //       changjingParam = id
  //     } else {
  //       changjingList[i].open = false
  //     }
  //   }
  //   console.log('id', id, 'changjingParam', changjingParam)
  //   this.setData({ changjingList: changjingList, 'params.changjing': changjingParam })
  // },

  // // quyuTap 区域
  // quyuTap(e) {
  //   console.log('区域', e.currentTarget.id)
  //   let id = e.currentTarget.id, quyuList = this.data.quyuList
  //   let quyuParam = -1
  //   for (let i in quyuList) {
  //     if (id == quyuList[i].id && quyuList[i].open != true) {
  //       quyuList[i].open = true
  //       quyuParam = id
  //     } else {
  //       quyuList[i].open = false
  //     }
  //   }
  //   console.log('id', id, 'quyuParam', quyuParam)
  //   this.setData({ quyuList: quyuList, 'params.quyu': quyuParam })
  // },

  // // caixiTap 菜系
  // caixiTap(e) {
  //   console.log('菜系', e.currentTarget.id)
  //   let id = e.currentTarget.id, caixiList = this.data.caixiList
  //   let caixiParam = -1
  //   for (let i in caixiList) {
  //     if (id == caixiList[i].id && caixiList[i].open != true) {
  //       caixiList[i].open = true
  //       caixiParam = id
  //     } else {
  //       caixiList[i].open = false
  //     }
  //   }
  //   console.log('id', id, 'caixiParam', caixiParam)
  //   this.setData({ caixiList: caixiList, 'params.caixi': caixiParam })
  // },


  // // 重置
  // chongzhi() {
  //   this.setData({
  //     params: {},
  //     quyuList: Config.quyu,
  //     caixiList: Config.caixi,
  //     changjingList: Config.changjing,
  //     xingjiList: Config.xingji,
  //   })
  // },

  // // 确定
  // queding() {
  //   let shaixuanParams = this.data.params

  //   // 如果params为空，直接返回（用户什么都没选）
  //   if (Object.keys(shaixuanParams).length != 0) {
  //     // 如果有-1的元素，或者都是-1，清除-1的元素再请求
  //     shaixuanParams.changjing == -1 && delete shaixuanParams.changjing
  //     if (shaixuanParams.quyu == -1 || shaixuanParams.quyu == 0) { delete shaixuanParams.quyu }
  //     if (shaixuanParams.caixi == -1 || shaixuanParams.caixi == 0) { delete shaixuanParams.caixi }

  //     // 删除元素后params是否还有元素，有继续，没有返回
  //     if (Object.keys(shaixuanParams).length != 0) {
  //       // 携带选的参数调用上一页的一个方法（请求数据）-> 返回上一页
  //       // 获取canting-list的实例
  //       let page = getCurrentPages()
  //       let backPage = page[page.length - 2]
  //       // 调用上一页的**方法(方法内部请求where数据并设置)
  //       backPage.fromShaixuan(shaixuanParams)
  //       // 返回上一页
  //       wx.navigateBack({ delta: 1 })
  //     } else {
  //       // 返回上一页
  //       wx.navigateBack({ delta: 1 })
  //     }

  //   } else {
  //     // 直接返回（params为空）
  //     wx.navigateBack({ delta: 1 })
  //   }
  // },
})