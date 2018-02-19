import { Api } from '../../utils/Api.js'
// import { Config } from '../../utils/Config.js'
import { Base } from '../../utils/Base.js'

const base = new Base()
const api = new Api()
const app = getApp()
// 高德SDK
var amapFile = require('../../gaodemap/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '1fafc5e0acc166803d566256e8843740' });
// HTML解析 (* 点击tar再解析还是全部解析?)
var WxParse = require('../../wxParse/wxParse.js');
// 留言分页
let page = 1

Page({

  data: {
    Res: {},
    // ResState: false,            // Res标识
    // liuyanRes: [],             // 留言(20条，查看全部留言页面使用)
    // noLiuyanState: false,      // 是否有留言（true:没有留言，false:有） 
    // getAllLiuyanState: false,  // 查看全部留言按钮开关
    // 点赞状态 true=已点
    zanState: false,
    // 收藏状态 true=已点
    shoucangState: false,
    // Config
    // quyuList: Config.quyu,
    // caixiList: Config.caixi,
    // changjingList: Config.changjing,

    // 高德map数据
    map: {
      polyline: [],   // 路径规划数组（map页，map组件使用）
      distance: ''     // 距离
    },

    // 加载
    loading: true,
    // 地址位置授权标识位(不能直接取，要setData)
    // userLocation: false,
    // // 分享按钮状态
    // fenxiangState: false,
    // // 分享蒙层
    // mask: false,
    // // 成生海报用的屏幕宽高
    // width: '',
    // height: '',
    // // 屏幕总高（连最上面）
    // screenHeight: '',
    // // 画布状态
    // canvas: false,
    // // 背景模糊
    // blur: false,
    // 显示返回主页
    goIndex: false
  },

  // 请求detail数据
  onLoad: function (op) {
    // console.log(getCurrentPages())
    this._load(op.id)
    this._zanState(op.id)        // 遍历点赞缓存，设置状态
    this._shoucangState(op.id)   // 遍历收藏缓存，设置状态
    
    // 检查是否来自分享（来自分享直接进来显示返回主页按钮）
    if (app.appData.path) { this.setData({ goIndex: true }) }
  },

  // ---------------------------------------- _load --------------------------------------------

  // 请求detail数据（接受餐厅ID,留言服务器限制limit-5条）
  _load(id) {
    console.log('appData', app.appData)

    api.detailCanting({ id: id }, res => {
      console.log('detail数据', res)
      // 只保留时间的年/月/日
      for (let i in res.liuyan) { res.liuyan[i].create_time = res.liuyan[i].create_time.slice(0, 10) }
      // 设置数据
      this.setData({ Res: res, loading: false }, () => {
        // 设置导航条
        wx.setNavigationBarTitle({ title: res.name })
        // 获取静态地图图片(高德)
        this.getStaticmap(res)
        // 获取驾车线路规划(前置app.appData.userLocation用户授权才会调用高德接口)(这个接口数据当前页只用到距离,其他数据准备给map页用的;)
        this.getDriving(res)
        // 解析HTML
        WxParse.wxParse('wenzhang', 'html', res.wenzhang.html, this, 0);
        // 处理留言(接受留言总数,显示加载更多留言or没有更多了)
        // this._liuyan(res.liuyan_count_count)
      })
    })
  },

  // ---------------------------------------- 计算距离,查看地图（授权地理位置） --------------------------------------------
  // 计算距离
  _location() {
    // 授权地理位置(back->true)
    // base.zuobiao(() => {
    //   console.log('已获取用户地址位置')
    //   // 设置userLocation标识位为true显示距离，调用计算距离方法
    //   // this.setData({ userLocation: true })
    //   // 计算距离方法
    //   this.getDriving(this.data.Res)
    // })
    // 获取授权
    base.authorize_userLocation((res) => {
      // 获取坐标
      app.getLocation(() => {
        // 计算距离方法
        this.getDriving(this.data.Res)
      })
    })
  },

  // 查看地图
  _go_Map() {
    // 如果授权过
    if (app.authSetting['scope.userLocation']) {
      // 使用微信内置地图查看位置
      wx.openLocation({
        latitude: parseInt(this.data.Res.latitude),
        longitude: parseInt(this.data.Res.longitude),
        scale: 14,
        name: this.data.Res.name,
        address: this.data.Res.address
      })
    } else {
      // 获取授权
      base.authorize_userLocation((res) => {
        this._go_Map()
        // 计算距离
        this._location()
      })
    }
  },


  // ------ 加载更多留言 --------
  _zaijiagengduo() {
    api.listLiuyan({ canting_id: this.data.Res.id, page: page }, res => {
      console.log('加载更多留言-' + page, res)
      // 只保留时间的年/月/日
      for (let i in res) { res[i].create_time = res[i].create_time.slice(0, 10) }
      // 设置数据,如果是第一页就覆盖原来的limit5条,否则往后面添加
      page == 1 ? this.setData({ 'Res.liuyan': res }) : this.setData({ 'Res.liuyan': this.data.Res.liuyan.concat(res) })
      // page自增
      page++
    })
  },

  // ---------------------------------------------------地图-----------------------------------------------------
  // --------高德SDK获取静态地图图片(高德-不需要用户坐标)-(*考虑把获取的图片直接存数据库，还不知道图片可以保存多久，http是高德的)-------
  getStaticmap(res) {
    // 调用高德SDK
    myAmapFun.getStaticmap({
      location: res.longitude + ',' + res.latitude,   // 地图中心点
      zoom: 16,          // 1-17
      size: "400*200",   // 图片大小（宽*高）
      scale: 1,          //1:返回普通图；2: 调用高清图，
      markers: 'mid,0xFF0000,A:' + res.longitude + ',' + res.latitude,    // 103.822100,25.587670
      success: (data) => { this.setData({ src: data.url }) },
      fail: function (info) { wx.showModal({ title: info.errMsg }) }
    })
  },

  // 获取驾车线路规划(这个接口数据当前页只用到距离,其他数据准备给map页用的; tips:获得res后调用，用到res的数据)
  getDriving(res) {
    console.log('进入驾车线路规划', app.authSetting['scope.userLocation'])
    // 用户授权地址位置才会调用
    if (app.authSetting['scope.userLocation']) {
      myAmapFun.getDrivingRoute({
        origin: app.appData.longitude + ',' + app.appData.latitude,    // 起点(appData获取的)
        destination: res.longitude + ',' + res.latitude,               // 目的地（餐厅坐标）
        success: (data) => {
          console.log('驾车线路规划', data)
          // var points = [];
          // if (data.paths && data.paths[0] && data.paths[0].steps) {
          //   var steps = data.paths[0].steps;
          //   for (var i = 0; i < steps.length; i++) {
          //     var poLen = steps[i].polyline.split(';');
          //     for (var j = 0; j < poLen.length; j++) {
          //       points.push({
          //         longitude: parseFloat(poLen[j].split(',')[0]),
          //         latitude: parseFloat(poLen[j].split(',')[1])
          //       })
          //     }
          //   }
          // }
          // 线路规划数据给map组件（dottedLine：虚线，还有一个箭头显示，真机才能测试，查map组件）
          // this.setData({ 'map.polyline': [{ points: points, color: "#e64340", width: 4, dottedLine: true }] });
          // 距离
          if (data.paths[0] && data.paths[0].distance) { this.setData({ 'map.distance': (data.paths[0].distance / 1000).toFixed(1) + 'km' }); }
        }
      })
    }
  },

  // ---------------------------------------------------点赞-----------------------------------------------------
  // 遍历点赞缓存，有记录则禁用点赞，防止重复点赞
  _zanState(id) {
    let zan = wx.getStorageSync('zan')
    for (let i in zan) {
      if (zan[i] == id) {
        this.setData({ zanState: true })
        break
      }
    }
  },

  // 点赞（接受餐厅ID）
  // 调用点赞接口成功后缓存餐厅ID，设置点赞状态，（调用时先检查点赞状态是否禁用，点赞状态在onLoad时提前处理过）
  dianzan() {
    // 检查是否禁用
    let zanState = this.data.zanState
    if (!zanState) {
      let canting_id = this.data.Res.id
      api.dianzanCanting({ id: canting_id }, res => {
        console.log('点赞', res)
        // 点赞后缓存赞过的餐厅ID并设置点赞状态
        let zan = wx.getStorageSync('zan') || []
        zan.push(canting_id)
        wx.setStorageSync('zan', zan)
        this.setData({ zanState: true, 'Res.zan': this.data.Res.zan + 1 }, () => { wx.showToast({ title: '点赞成功' }) })
      })
    } else {
      wx.showToast({ title: '已经赞过了' })
    }
  },

  // 取消点赞 （不想支持）
  // **

  // ---------------------------------------------------收藏-----------------------------------------------------
  // 遍历收藏缓存，有记录则设置收藏状态
  _shoucangState(id) {
    let shoucang = wx.getStorageSync('shoucang')
    for (let i in shoucang) {
      if (shoucang[i] == id) {
        this.setData({ shoucangState: true })
        break
      }
    }
  },

  // 收藏 / 取消（接受餐厅ID,没收藏就收藏，已收藏就取消收藏）
  // 调用收藏后缓存餐厅ID，设置收藏状态，（调用时先检查收藏状态，收藏状态在onLoad时提前处理过）
  shoucang() {
    // 检查状态
    let shoucangState = this.data.shoucangState
    let canting_id = this.data.Res.id
    let shoucang = wx.getStorageSync('shoucang') || []
    // 没有收藏过,就收藏
    if (!shoucangState) {
      // 收藏后缓存收藏的餐厅ID并设置收藏状态
      shoucang.push(canting_id)
      wx.setStorageSync('shoucang', shoucang)
      this.setData({ shoucangState: true }, () => { wx.showToast({ title: '收藏成功' }) })
    } else {
      // 已经收藏了,就取消收藏，删除缓存数组中对应的餐厅ID，设置状态
      for (let i in shoucang) {
        if (shoucang[i] == canting_id) {
          shoucang.splice(i, 1)
          break
        }
      }
      wx.setStorageSync('shoucang', shoucang)
      this.setData({ shoucangState: false }, () => { wx.showToast({ title: '已取消收藏' }) })
    }
  },





  // ---------------------------------------------------进入地图详情页-----------------------------------------------------
  // go_Map() {
  //   wx.navigateTo({ url: '/pages/canting/map' })
  // },

  // ---------------------------------------------------进入留言详情页-----------------------------------------------------
  // 查看全部留言
  go_Liuyan() {
    let id = this.data.Res.id
    wx.navigateTo({
      url: '/pages/canting/detail-liuyan?id=' + id,
    })
  },

  // 进入新增留言页(需要授权用户信息)
  go_createLiuyan() {
    // 登陆过返回true
    if (app.appData.LoginState) {
      let id = this.data.Res.id
      wx.navigateTo({ url: '/pages/canting/create-liuyan?id=' + id })
    } else {
      // 调用base用户授权
      base.login(back => { this.go_createLiuyan() })
    }
  },

  // ---------------------------- 新增留言（create-liuyan页调用） --------------------------------
  create_liuyan(neirong, callback) {
    console.log('新增留言')
    api.createLiuyan({ canting_id: this.data.Res.id, neirong: neirong }, res => {
      console.log('新增留言chenggong', res)
      // callback出去给create-liuyan页（接受后会返回上一页）
      callback && callback()
      // 再查留言数据,把新增的插入Res.liuyan的第一条
      api.listLiuyan({ canting_id: this.data.Res.id, page: 1 }, res => {
        console.log('新增留言方法内再次查留言数据', res)
        // 只保留时间的年/月/日
        res[0].create_time = res[0].create_time.slice(0, 10)
        // 向数组的开头插入一个元素
        this.setData({ 'Res.liuyan': [res[0]].concat(this.data.Res.liuyan) })
      })
    })
  },

  // --------------------------------------------------- 分享按钮 -------------------------------------------------
  // 监听屏幕滚动事件
  // onPageScroll: function (e) {
  //   // 只有最上最下显示
  //   // console.log(e.scrollTop)
  //   // 最上显示
  //   if (e.scrollTop == 0) {
  //     this.setData({ fenxiangState: false })
  //   } else {
  //     // 如果是false了不再重复setData
  //     if (!this.data.fenxiangState) {
  //       this.setData({ fenxiangState: true })
  //     }
  //   }
  // },

  // 上拉触底
  // onReachBottom: function () {
  //   console.log('上拉触底')
  //   this.setData({ fenxiangState: false })
  // },

  // // 点击分享按钮显示蒙层
  // fenxiang() {
  //   console.log('fenxiang')
  //   // 显示蒙层
  //   this.setData({ mask: !this.data.mask, blur: !this.data.blur })
  // },


  // --------------------------------------- 分享转发 --------------------------------------------------
  onShareAppMessage: function (res) {
    console.log('asd', res)

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '曲靖袋鼠美食+',
      // 路径携带id (*下个用户进入时要显示一个回到主页的按钮*)
      path: '/pages/canting/detail?id=' + this.data.Res.id,
      // 分享图片自定义？背景被模糊过怎么处理？
      imageUrl: this.data.Res.img,
      success: function (res) {
        // 转发成功
        console.log('转发成功', res)
        // *感谢转发（我为曲靖美食贡献了 多少份 力量--可以记录数据库，绘制在画布上）
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败', res)
      }
    }
  },

  // // ----------------------------------------------- 生成海报 -------------------------------------------------------
  // shengcheng() {
  //   console.log('生成...')
  //   // 打开蒙层
  //   this.setData({ canvas: true })
  //   wx.showLoading({ title: '生成中...' })
  //   // 创建canvas
  //   const ctx = wx.createCanvasContext('myCanvas')
  //   // 绘图(1图 1:1(720*720), 2图 10:6(720*432) ,底边还有一点点)
  //   wx.getImageInfo({
  //     // src: '/img/guo.jpg',
  //     src: this.data.Res.img,
  //     success: (res) => {
  //       console.log('获取图片信息1', res)
  //       // 第一张图(前4个参数是图片参数，后4个是画布参数)
  //       // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
  //       let canvHeight = (app.appData.sysWidth * res.height) / res.width
  //       console.log('1图绘制后高', canvHeight)
  //       ctx.drawImage(res.path, 0, 0, res.width, res.height, 0, 0, app.appData.sysWidth, canvHeight)
  //       ctx.setFontSize(30)
  //       ctx.fillText('Hello', 0, 30)
  //       ctx.fillText('阿西', 100, 100)

  //       // 第二张图
  //       wx.getImageInfo({
  //         src: '/img/2.png',
  //         success: (res2) => {
  //           console.log('获取图片信息2', res2)
  //           // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
  //           let canvHeight2 = (app.appData.sysWidth * res2.height) / res2.width
  //           console.log('2图绘制后高', canvHeight2)
  //           // 第二张图(根据第一图的高开始绘制)
  //           ctx.drawImage('/img/2.png', 0, 0, res2.width, res2.height, 0, canvHeight, app.appData.sysWidth, canvHeight2)
  //           // 执行绘制
  //           ctx.draw(false, back => {
  //             console.log('绘制完成')
  //             // 保存图片
  //             // setTimeout((time) => {
  //             console.log('time')
  //             this.saveImg()
  //             // }, 500)
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  // // 保存图片
  // saveImg() {
  //   // 保存图片并返回路径
  //   wx.canvasToTempFilePath({
  //     // x: 0,           // 画布x轴起点（默认0）
  //     // y: 0,           // 画布y轴起点（默认0）
  //     // width: this.data.width,      // 画布宽度（默认为canvas宽度-x）
  //     // height: this.data.height,     // 画布宽度（默认为canvas宽度-x）
  //     destWidth: app.appData.sysWidth * 5, // 输出图片宽度（默认为width）
  //     destHeight: app.appData.sysHeight * 5,// 输出图片高度（默认为Height）
  //     canvasId: 'myCanvas', // 标识，组件ID
  //     success: (res) => {
  //       console.log('保存图片返回路径', res.tempFilePath)
  //       // 影藏蒙层，画布，提示
  //       this.setData({ canvas: false, mask: false, blur: false })
  //       wx.hideLoading()
  //       // 保存到系统相册
  //       wx.saveImageToPhotosAlbum({
  //         filePath: res.tempFilePath,
  //         success: (res) => {
  //           console.log('保存成功', res)
  //           wx.showModal({
  //             title: '海报已保存到系统相册',
  //             content: '快去分享给朋友,叫伙伴们来围观吧',
  //             showCancel: false,       // 不显示取消按钮
  //             confirmText: '我知道了'   // 确定按钮文字（4个）
  //           })
  //         },
  //         fail: (err) => {
  //           console.log('保存失败', err)
  //           // 可能有没授权（*引导授权）
  //           if (err.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
  //             console.log('未授权保存到系统相册')
  //             base.authorize_writePhotosAlbum(back => {
  //               console.log('c', back)
  //               // 已授权
  //               if (back) {
  //                 // 重新调用保存到系统相册
  //                 wx.saveImageToPhotosAlbum({
  //                   filePath: res.tempFilePath,
  //                   success: (res) => {
  //                     console.log('保存成功', res)
  //                     wx.showModal({
  //                       title: '海报已保存到系统相册',
  //                       content: '快去分享给朋友,叫伙伴们来围观吧',
  //                       showCancel: false,       // 不显示取消按钮
  //                       confirmText: '我知道了'   // 确定按钮文字（4个）
  //                     })
  //                   }
  //                 })
  //               }
  //             })
  //           }
  //         }
  //       })
  //     }
  //   })
  // },

  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },

})