import { Api } from '../../utils/Api.js'
import WxValidate from '../../validate/WxValidate.js'
const api = new Api()

let canting_id;

//---------------------------------------------- 验证 ----------------------------------------------------
// 验证字段的规则
const rules = { neirong: { required: true, rangelength: [10, 200] } }
// 验证字段的提示信息，若不传则调用默认的信息
const messages = { neirong: { required: '请输入内容', rangelength: '请输入长度在 10 到 200 之间的字符' } }

const wxValidate = new WxValidate(rules, messages)


Page({

  data: {
    // textarea计数
    cursor: 0,
    // 错误提示开关
    toptips_kaiguan: '',
    // 错误提示内容
    toptips_text: '',
  },


  onLoad: function (op) {
    console.log(op.id)
    canting_id = op.id
  },

  _load(id) {
  },


  // liuyanInput
  liuyanInput(e) {
    console.log('input', e.detail)
    this.setData({ liuyanInput: e.detail.value, cursor: e.detail.cursor })
  },

  // 提交
  tijiao_liuyan() {
    let neirong = this.data.liuyanInput   // 留言内容

    // 传入表单数据，调用验证方法
    if (!wxValidate.checkForm({ neirong: neirong })) {
      const error = wxValidate.errorList[0]
      // *调用组件tips提示
      this.setData({ toptips_kaiguan: true, toptips_text: error.msg })
      // console.log(error.msg)
      return false
    }
    console.log('验证通过')

    //   // ----- 测试返回上一页更新留言数据 ----
    let Pages = getCurrentPages()
    let detailPage = Pages[Pages.length - 2]    // 上一页
    detailPage.create_liuyan(neirong, () => {
      console.log('新增留言页调用餐厅详情页的-新增留言方法回调')
      // 提示
      wx.showModal({
        content: '留言成功', showCancel: false,
        success: (res) => { res.confirm && wx.navigateBack({ delta: 1 }) }
      })
    })
  },

})
