import { Api } from './Api.js'


// 卡券类
class Card {
  constructor() {
    this.api = new Api()
  }

  // 外面只调用这个方法,它会调用这个类的其他方法
  // 领取卡劵(接受卡劵ID=字符串，卡劵在数据库中表ID=用于更新库存),callback更新后的数据库数据(服务器update返回的)
  lingquKajuan(card_id, id, callback) {

    // 换卡劵signature
    this.signature(card_id, res => {

      // wx.addCard,添加卡劵
      this.addCard(res, addCard_back => {

        // 解密code（接受未解密的code）
        this.jiemiCode(addCard_back.code, backCode => {
          console.log('返回解密的code', backCode)
          // 解密成功后打开卡劵(接受cardId,解密后的code)
          this.openCard(addCard_back.cardId, backCode)
        })

        // 更新库存(获取库存信息更新库存)（接受卡劵ID，当前领取的卡劵在数据库里的ID）
        this.updateKucun(card_id, id, back => { callback && callback(back) })

        // 卡劵领取记录（卡劵ID，内部获取uid）
        this.api.logKajuan({ card_id: card_id }, back => { console.log('卡劵领取记录', back) })

      })
    })
  }

  // 换卡劵signature,接受card_id,去服务器换signature（用于调用wx.addCard）
  signature(card_id, callback) {

    // 提示领取中打开蒙层防止请求是多次点击
    wx.showLoading({ title: '领取中..', mask: true })

    this.api.signatureKajuan({ card_id: card_id }, res => {
      console.log('换卡劵signature', res)
      callback && callback(res)
      // 关闭提示
      wx.hideLoading()
    })
  }

  // wx.addCard
  addCard(res, callback) {
    wx.addCard({
      cardList: [{
        cardId: res.cardId,
        cardExt: '{"timestamp": "' + res.timestamp + '", "signature":"' + res.signature + '"}'
      }],
      success: (addcardSuccess) => {
        console.log('wx.addCard_success', addcardSuccess) // 卡券添加结果
        let card = addcardSuccess.cardList[0]
        if (card.isSuccess == true) {
          callback && callback(card)
        } else {
          // cardList[0].isSuccess不等于true, 领取失败 ? (*应该要实现记录错误日志)
        }
      },
      fail: (err) => {
        // （点击返回会进入fail）
      }
    })
  }

  // 解密wx.addCard成功后返回的code(接受加密code, 解密后用于wx.openCard)
  jiemiCode(code, callback) {
    this.api.codeKajuan({ code: code }, jiemi_code => {

      console.log('wx.addCard成功后返回的code', jiemi_code)
      callback && callback(jiemi_code)
    })
  }


  // 打开卡劵
  openCard(card_id, code) {
    wx.openCard({
      cardList: [{
        cardId: card_id,
        code: code
      }],
      success: res => { console.log('打开卡劵success', res) }
    })
  }

  // 更新库存,接受卡劵ID,当前领取的卡劵在数据库里的ID,服务器获取库存信息并更新库存
  updateKucun(card_id, id, callback) {
    this.api.shengyushuliangKajuan({ card_id: card_id, id: id }, res => {
      console.log('更新库存', res)
      callback && callback(res)
    })
  }


}

export { Card }