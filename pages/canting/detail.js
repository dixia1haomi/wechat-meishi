import { Api } from '../../utils/Api.js'
import { Base } from '../../utils/Base.js'

const base = new Base()
const api = new Api()
const app = getApp()
// 高德SDK
var amapFile = require('../../gaodemap/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '1fafc5e0acc166803d566256e8843740' });
// HTML解析
var WxParse = require('../../wxParse/wxParse.js');
// 留言分页
let page = 1

Page({

  data: {
    Res: {},
    zanState: false,       // 点赞状态
    shoucangState: false,  // 收藏状态 true=已点
    // 高德map数据
    map: {
      polyline: [],   // 路径规划数组（map页，map组件使用）
      distance: ''    // 距离
    },
    loading: true,    // 加载
    goIndex: false    // 显示返回主页
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
        // 获取驾车线路规划(前置app.appData.userLocation用户授权才会调用高德接口,这个接口数据当前页只用到距离)
        this._baseJuli()
        // 解析HTML
        WxParse.wxParse('wenzhang', 'html', res.wenzhang.html, this, 0);
        // 处理留言(接受留言总数,显示加载更多留言or没有更多了)
        // this._liuyan(res.liuyan_count_count)
      })
    })
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






  // ---------------------------------------------------进入留言详情页-----------------------------------------------------
  // 查看全部留言
  go_Liuyan() {
    let id = this.data.Res.id
    wx.navigateTo({ url: '/pages/canting/detail-liuyan?id=' + id })
  },

  // 进入新增留言页(需要授权用户信息)
  go_createLiuyan() {
    // 登陆过返回true
    if (app.appData.LoginState) {
      let id = this.data.Res.id
      wx.navigateTo({ url: '/pages/canting/create-liuyan?id=' + id })
    } else {
      // 调用app用户授权
      app.newGetToken(back => { this.go_createLiuyan() })
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



  // --------------------------------------------------- 距离计算 -----------------------------------------------------
  // --------------------------------------------------- 距离计算 -----------------------------------------------------

  _baseJuli() {
    // 要求授权，同意后去获取地理位置,拒绝不管
    if (app.appData.LocationState) {
      // 计算距离
      this.getDriving()
    } else {
      // 提前授权，如果以前授权过，直接返回成功
      wx.authorize({
        scope: 'scope.userLocation', success: () => {
          app.getLocation(back => { this.getDriving() })
        }
      })
    }
  },

  // 获取驾车线路规划(这个接口数据当前页只用到距离,其他数据准备给map页用的; tips:获得res后调用，用到res的数据)
  getDriving() {
    myAmapFun.getDrivingRoute({
      origin: app.appData.longitude + ',' + app.appData.latitude,          // 起点(appData获取的)
      destination: this.data.Res.longitude + ',' + this.data.Res.latitude, // 目的地（餐厅坐标）
      success: (data) => {
        if (data.paths[0] && data.paths[0].distance) {
          this.setData({ 'map.distance': (data.paths[0].distance / 1000).toFixed(1) + 'km' });
        }
      }
    })
  },

  // 使用微信内置地图查看位置
  _go_Map() {
    // 如果有位置信息
    if (app.appData.LocationState) {
      // 使用微信内置地图查看位置
      wx.openLocation({
        latitude: parseInt(this.data.Res.latitude),
        longitude: parseInt(this.data.Res.longitude),
        scale: 18,
        name: this.data.Res.name,
        address: this.data.Res.address
      })
    } else {
      // 获取授权
      base.authorize_userLocation(back => {
        app.getLocation(back => { this._go_Map() })
      })
    }
  },


  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },

})