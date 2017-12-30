var WxParse = require('../../wxParse/wxParse.js');
import { Api } from '../../utils/Api.js'


const api = new Api()


// var article = '';

Page({


  data: {
    article: '',
  },


  onLoad: function (options) {
    this._load()

  },

  pa() {
    var that = this;
    WxParse.wxParse('aaa', 'md', this.data.article, that, 5);
  },

  _load() {
    api.listCanting({}, res => {
      this.setData({ article: res[0].aaa }, () => {
        this.pa()
      })
    })
  },



})