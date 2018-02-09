import { Api } from '../../utils/Api.js'
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
  go_youhui() {

  },

  // -------------------------------------------------------------------------------------------------------

  // 领取卡劵
  lingqu(e) {
    console.log('领取卡劵', e)
    // 当前领取的卡劵在数据库里的ID
    let id = e.currentTarget.dataset.id
    let card_id = e.currentTarget.dataset.card_id

    // 领取卡劵
    api.getKajuan({ card_id: card_id }, res => {
      console.log('领取卡劵接口返回', res)
      wx.addCard({
        cardList: [{
          cardId: res.cardId,
          cardExt: '{"timestamp": "' + res.timestamp + '", "signature":"' + res.signature + '"}'
        }],
        success: (res) => {
          console.log('卡券添加结果success', res) // 卡券添加结果
          if (res.cardList[0].isSuccess == true) {

            // 成功提示
            // wx.showToast({ title: '领取成功' })

            // 储存卡劵信息到用户名下,需要uid(服务器自动获取)，卡劵ID，加密code
            api.create_in_userKajuan({ cardId: res.cardList[0].cardId, code: res.cardList[0].code }, res => {
              console.log('储存卡劵信息到用户名下', res)
              // 这里可以打开卡劵
              // this.openCard(res.card_id, res.code)
            })

            // 获取库存信息更新库存（接受卡劵ID，当前领取的卡劵在数据库里的ID）
            api.shengyushuliangKajuan({ id: id, card_id: res.cardList[0].cardId }, res => {
              console.log('获取库存信息更新库存', res)
              let kajuanRes = this.data.kajuanRes
              for (let i in kajuanRes) {
                if (kajuanRes[i].id == res.id) {
                  kajuanRes[i].shengyushuliang = res.shengyushuliang
                  break
                }
              }
              this.setData({ kajuanRes: kajuanRes })
            })

          } else {
            // 领取失败(*应该要实现记录错误日志)
          }
        },
        fail: (err) => {
          console.log('fail', err)
          // *添加失败提示
        }
      })
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


  // 我的卡劵
  mykajuan() {
    // 服务器获取uid
    api.myKajuan({}, res => {
      console.log('我的卡劵', res)
      let arr = [];
      for (let i in res) {
        arr.push({ cardId: res[i].card_id, code: res[i].code })
      }
      console.log('asd', arr)
      wx.openCard({
        cardList: arr,
        success: res => { console.log('打开卡劵success', res) },
        fail: err => { console.log('打开卡劵fail', err) }
      })

    })
  },


})