import { Api } from '../../utils/Api.js'
import { Config } from '../../utils/Config.js'

const api = new Api()
const app = getApp()
// 高德SDK
var amapFile = require('../../gaodemap/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '1fafc5e0acc166803d566256e8843740' });
// HTML解析 (* 点击tar再解析还是全部解析?)
var WxParse = require('../../wxParse/wxParse.js');


var data = '<div>我是HTML代码</div>';


// let ResSt;  // 缓存

Page({

  data: {
    Res: {},
    ResState: false,            // Res标识
    liuyanRes: [],             // 留言(20条，查看全部留言页面使用)
    noLiuyanState: false,      // 是否有留言（true:没有留言，false:有） 
    getAllLiuyanState: false,  // 查看全部留言按钮开关
    // 点赞状态 true=已点
    zanState: false,
    // 收藏状态 true=已点
    shoucangState: false,
    // tar
    // activeE: [{ id: 1, name: '攻略', open: true }, { id: 2, name: '菜品' }, { id: 3, name: '环境' }],  ***
    // Config
    quyuList: Config.quyu,
    caixiList: Config.caixi,
    changjingList: Config.changjing,
    // xingjiList: Config.xingji,

    // 高德map数据
    map: {
      polyline: [],   // 路径规划数组（map页，map组件使用）
      distance: ''     // 距离
    },

    // loading..
    // loading: true
  },

  // 请求detail数据
  onLoad: function (op) {
    // console.log(getCurrentPages())
    this._load(op.id)
    this._zanState(op.id)        // 遍历点赞缓存，设置状态
    this._shoucangState(op.id)   // 遍历收藏缓存，设置状态
  },

  // ---------------------------------------- _load --------------------------------------------

  // 请求detail数据（接受餐厅ID）
  _load(id) {

    api.detailCanting({ id: id }, res => {
      console.log('detail数据', res)
      this.setData({ Res: res, ResState: true }, () => {
        // 获取静态地图图片(高德)
        this.getStaticmap(res)
        // 获取驾车线路规划(这个接口数据当前页只用到距离,其他数据准备给map页用的;)
        this.getDriving(res)
        // 解析HTML
        WxParse.wxParse('wenzhang', 'md', res.wenzhang[0].html, this, 0);
        // 处理留言
        this._liuyan(res.liuyan)
      })
    })
  },


  // ------ 处理留言(接受liuyan数据，这个liuyan数据是餐厅detail接口关联的服务器限制limit(5)条) --------
  _liuyan(liuyan) {

    /* 两种情况：1.有liuyan -> 大于等于5条 -> 显示查看全部留言按钮，请求留言数据Api
                2.没有liuyan -> 设置留言标识noLiuyan（不显示留言）*/

    if (liuyan.length != 0) {
      this.data.noLiuyanState && this.setData({ noLiuyanState: false })  // 第一次没有，用户新留后导致不会显示出来
      // 1.有liuyan
      if (liuyan.length >= 5) {
        // 如果餐厅detail接口携带的留言数据有5条，调用查看留言Api（{data:每页20条,count:总条数}）
        api.listLiuyan({ canting_id: this.data.Res.id, page: 1 }, res => {
          console.log('全部留言Api', res)
          this.setData({ liuyanRes: res }, () => {
            // 如果留言Api的数据大于5条，显示查看全部留言
            if (res.count > 5) { this.setData({ getAllLiuyanState: true }) }
          })   // 20条留言（包含所有留言统计数量）
        })
      }
    } else {
      // 2.留言的长度==0，没有留言
      this.setData({ noLiuyanState: true })
    }
  },

  // ---------------------------------------------------地图-----------------------------------------------------
  // --------高德SDK获取静态地图图片(高德)-(*考虑把获取的图片直接存数据库，还不知道图片可以保存多久，http是高德的)-------
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
    myAmapFun.getDrivingRoute({
      origin: app.appData.longitude + ',' + app.appData.latitude,    // 起点(appData获取的)
      destination: res.longitude + ',' + res.latitude,               // 目的地（餐厅坐标）
      success: (data) => {
        console.log('驾车线路规划', data)
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        // 线路规划数据给map组件（dottedLine：虚线，还有一个箭头显示，真机才能测试，查map组件）
        this.setData({ 'map.polyline': [{ points: points, color: "#e64340", width: 4, dottedLine: true }] });
        // 距离
        if (data.paths[0] && data.paths[0].distance) { this.setData({ 'map.distance': (data.paths[0].distance / 1000) + '/km' }); }
      }
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





  // ---------------------------------------------------进入地图详情页-----------------------------------------------------
  go_Map() {
    wx.navigateTo({
      url: '/pages/canting/map',
    })
  },

  // ---------------------------------------------------进入留言详情页-----------------------------------------------------
  // 查看全部留言
  go_Liuyan() {
    let id = this.data.Res.id
    wx.navigateTo({
      url: '/pages/canting/detail-liuyan?id=' + id,
    })
  },

  // 进入新增留言页
  go_createLiuyan() {
    let id = this.data.Res.id
    wx.navigateTo({
      url: '/pages/canting/create-liuyan?id=' + id,
    })
  },

  // 新增留言（create-liuyan页调用）
  create_liuyan(neirong, callback) {
    let id = this.data.Res.id
    console.log('asd')
    api.createLiuyan({ canting_id: id, neirong: neirong }, res => {
      console.log('新增留言chenggong', res)
      // callback出去给create-liuyan页（接受后会返回上一页）
      callback && callback(res)
      // 新增成功后再次调用查询餐厅Api（关联留言）,覆盖留言后再调用处理留言
      api.detailCanting({ id: id }, res => {
        console.log('detail数据', res)
        this.setData({ 'Res.liuyan': res.liuyan }, () => {
          // 处理留言
          this._liuyan(res.liuyan)
        })
      })
    })
  },

})