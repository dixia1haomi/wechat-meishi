// app
const app = getApp()

Page({
  data: {
    // map组件标记点
    markers: [{
      iconPath: " ",
      id: 0,
      latitude: app.appData.latitude,
      longitude: app.appData.longitude,
      width: 23,
      height: 33
    }, {
      iconPath: " ",
      id: 1,
      latitude: app.appData.latitude,
      longitude: app.appData.longitude,
      width: 24,
      height: 34
    }],

    // 餐厅经纬度（map组件定位中心点）
    canting_longitude: '',
    canting_latitude: '',

    // 路径包含标注的坐标自动显示在屏幕中，查map组件（问题：打开组件闪现，影响体验）- include-points="{{aaa}}"
    // aaa: [
    //   {
    //     longitude: 103.82183,
    //     latitude: 25.60167
    //   },
    //   {
    //     longitude: 103.80736752899168,
    //     latitude: 25.58773649979276
    //   }
    // ]
  },


  onLoad: function () {
    this._load()
    console.log('app', app.appData)
  },

  _load() {
    // 从上一页获取map数据(上一页用到距离已经请求过了，canting/detail页 | data.map)
    let pagelist = getCurrentPages()                  // page实例
    let page = pagelist[pagelist.length - 2]          // 上一页
    // 设置获取的map数据
    this.setData({
      map: page.data.map,
      canting_longitude: page.data.Res.longitude,
      canting_latitude: page.data.Res.latitude
    })
  },

})