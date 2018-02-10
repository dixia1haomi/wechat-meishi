import { Api } from '../../utils/Api.js'
import { Card } from '../../utils/Card.js'
const card = new Card()
const api = new Api()

Page({


  data: {
    // 正在请求页
    loading: true
  },

  onLoad: function (op) {

    this._load()
    // 请求卡劵数据
    this._selectKajuan()
  },


  // 获取今日推荐
  _load() {

    // ------ 取所有List数据，餐厅List要用------
    api.listCanting({}, res => {
      console.log('a', res)
      this._for_List(res)                            // 遍历餐厅list获取推荐数据并设置Res
      this.setData({ listRes: res, loading: false })
    })

  },

  // 遍历餐厅list获取推荐数据并设置Res
  _for_List(list) {
    let res;
    for (let i in list) {
      if (list[i].top == 1) {
        res = list[i]
        break
      }
    }
    this.setData({ Res: res })
  },

  // 查看餐厅列表
  go() {

    wx.navigateTo({ url: '/pages/canting/list' })
  },

  // 今日推荐
  topTap() { wx.navigateTo({ url: '/pages/canting/detail?id=' + this.data.Res.id }) },

  // -------------------------------------------------- 卡劵 -----------------------------------------------------

  _selectKajuan() {
    api.selectKajuan({}, res => {
      console.log('卡劵数据', res)
      this.setData({ kajuanRes: res })
    })
  },

  // 先去优惠页再领取（现在先直接领取）
  go_Kajuan(e) {
    let id = e.currentTarget.id
    console.log('e', e)
    wx.navigateTo({
      url: '/pages/kajuan/kajuan?id=' + id,
    })
  },

  // -------------------------------------------------------------------------------------------------------

  // 领取卡劵
  lingqu(e) {
    console.log('领取卡劵', e)
    // 当前领取的卡劵在数据库里的ID
    let card_id = e.currentTarget.dataset.card_id
    let id = e.currentTarget.dataset.id

    card.lingquKajuan(card_id, id)

    // 领取卡劵
    // api.lingquKajuan({ card_id: card_id }, res => {
    //   console.log('领取卡劵接口返回', res)

    //   this._addCard(res, cardBack => {
    //     console.log('卡券添加结果success', cardBack) // 卡券添加结果
    //     let card = cardBack.cardList[0]
    //     if (card.isSuccess == true) {
    //       // 储存卡劵信息到用户名下,需要uid(服务器自动获取)，卡劵ID，加密code
    //       api.create_in_userKajuan({ cardId: card.cardId, code: card.code }, res => {
    //         console.log('储存卡劵信息到用户名下', res)
    //         this.openCard(res.card_id, res.code)    // 这里可以打开卡劵
    //       })
          // 获取库存信息更新库存（接受卡劵ID，当前领取的卡劵在数据库里的ID）
          // api.shengyushuliangKajuan({ id: id, card_id: card.cardId }, res => {
          //   console.log('获取库存信息更新库存', res)
          //   this._check_shengyushuliang(res)      // 设置data数据减少剩余数量,检查剩余数量==0，禁用领取，在wxml里实现了
          // })
    //     } else {
    //       // cardList[0].isSuccess不等于true,领取失败?(*应该要实现记录错误日志)
    //     }
    //   })
    // })
  },

  // 领取卡劵
  _addCard(res, callback) {
    wx.addCard({
      cardList: [{
        cardId: res.cardId,
        cardExt: '{"timestamp": "' + res.timestamp + '", "signature":"' + res.signature + '"}'
      }],
      success: (addcardSuccess) => { callback && callback(addcardSuccess) }
    })
  },


  // 打开卡劵
  openCard(card_id, code) {
    wx.openCard({
      cardList: [{
        cardId: card_id,
        code: code
      }],
      success: function (res) { console.log('打开卡劵success', res) }
    })
  },

  // 设置data数据减少剩余数量
  _check_shengyushuliang(res) {
    let kajuanRes = this.data.kajuanRes
    for (let i in kajuanRes) {
      if (kajuanRes[i].id == res.id) {
        kajuanRes[i].shengyushuliang = res.shengyushuliang
        break
      }
    }
    this.setData({ kajuanRes: kajuanRes })
  },


  // 我的卡劵(*放弃这个功能，删一张表，php相关代码页删)
  // mykajuan() {
  //   // 服务器获取uid
  //   api.myKajuan({}, res => {
  //     console.log('我的卡劵', res)
  //     let arr = [];
  //     for (let i in res) {
  //       arr.push({ cardId: res[i].card_id, code: res[i].code })
  //     }
  //     console.log('asd', arr)
  //     wx.openCard({
  //       cardList: arr,
  //       success: res => { console.log('打开卡劵success', res) },
  //       fail: err => { console.log('打开卡劵fail', err) }
  //     })

  //   })
  // },

})