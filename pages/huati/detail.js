import { Api } from '../../utils/Api.js'
import { Base } from '../../utils/Base.js'
import WxValidate from '../../validate/WxValidate.js'

const api = new Api()
const base = new Base()

let page = 1

Page({

  data: {
    Res: {},
    // 显示参与话题的Form页
    showForm: false,
    // userhuati的长度（判断没有更多了.服务器限制20条，如果小于20条，后面就没有了）
    userhuatiLength: 20,

    // 参与话题名称计数
    nameCursor: 0,
    // 参与话题内容计数
    neirongCursor: 0,

    // 错误提示开关
    toptips_kaiguan: '',
    // 错误提示内容
    toptips_text: '',

    // 没有更多了
    nodata: false
  },

  onLoad: function (op) {
    this._load(op.id)

  },

  // 查询话题详情
  _load(id) {
    api.detailHuati({ id: id, page: 1 }, res => {
      console.log('查询话题详情', res)
      // 处理日期时间
      this._time(res)
      // 拆解neirong字段
      this._chaijie(res.userhuati)

      this.setData({ Res: res })
    })
  },
  // 处理日期时间格式(substring截取服务器返回的日期时间字符串)
  _time(res) {
    // 处理话题
    res.create_time = res.create_time.substring(0, 10)
    // 处理user话题
    let userhuati = res.userhuati
    for (let i in userhuati) {
      userhuati[i].create_time = userhuati[i].create_time.substring(5, 10)
    }
  },

  // 拆解neirong字段
  _chaijie(userhuati) {
    for (let i in userhuati) {
      userhuati[i].new_neirong = userhuati[i].neirong.split('||')
    }
  },

  // 参与话题showForm(--需要登陆--)
  createHuati() {
    base.login(res => { this.setData({ showForm: true }) })
  },

  // 提交
  tijiao() {
    let huati_id = this.data.Res.id
    let name = this.data.name
    let neirong = this.data.neirong
    console.log('//可以正常使用,还差拼接餐厅明和上传图片', name, neirong)


    // 传入表单数据，调用验证方法
    if (!wxValidate.checkForm({ name: name, neirong: neirong })) {
      const error = wxValidate.errorList[0]
      // 调用组件tips提示
      this.setData({ toptips_kaiguan: true, toptips_text: error.msg })
      return false
    }

    console.log('提交成功')



    // 拼接name和neirong存在一个字段里
    let data = name + '||' + neirong
    console.log(data)
    // 取的时候
    // let arr = aaa.split('||')
    // console.log(arr)

    // 接受话题ID，内容，（接口内部获取uid）
    api.createUserHuati({ huati_id: huati_id, neirong: data }, res => {
      console.log('参与话题', res)
      // 请求数据，刷新显示发的新话题
      this._load(huati_id)
      wx.showModal({ title: '参与话题成功' })
      this.setData({ showForm: false })
    })
  },

  // 名称input事件
  nameInput(e) {
    console.log('名称input事件', e.detail)
    this.setData({ name: e.detail.value, nameCursor: e.detail.cursor })
  },

  // 内容input事件
  neirongInput(e) {
    console.log('内容input事件', e.detail)
    this.setData({ neirong: e.detail.value, neirongCursor: e.detail.cursor })
  },



  // --------------------------------------------------------------------------------------------------
  // 上拉触底
  onReachBottom: function () {
    console.log('上拉触底', this.data.userhuatiLength)
    let id = this.data.Res.id

    if (this.data.userhuatiLength < 20) {
      console.log('没有更多了..')
      this.setData({ nodata: true })
    } else {
      api.detailHuati({ id: id, page: ++page }, res => {
        console.log('上拉触底-查询话题详情', res)
        // 处理日期时间
        this._time(res)
        // 拆解neirong字段
        this._chaijie(res.userhuati)

        this.setData({ 'Res.userhuati': this.data.Res.userhuati.concat(res.userhuati), userhuatiLength: res.userhuati.length })
      })
    }
  },

  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },

})


//---------------------------------------------- 验证 ----------------------------------------------------
// 验证字段的规则
const rules = {
  name: { required: true, rangelength: [5, 20] },
  neirong: { required: true, rangelength: [10, 200] }
}
// 验证字段的提示信息，若不传则调用默认的信息
const messages = {
  name: { required: '请输入餐厅名称', rangelength: '餐厅名称长度在 5 到 20 之间的字符' },
  neirong: { required: '请输入内容', rangelength: '内容长度在 10 到 200 之间的字符' }
}

const wxValidate = new WxValidate(rules, messages)