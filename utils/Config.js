
class Config {
  constructor() { }
}

// 服务器接口请求地址
Config.url = 'http://meishi.com/api/'
// Config.url = 'https://zhaopin.qujingdaishuyanxuan.org/api/'



// ------------------------------------------筛选数据-------------------------------------------------
// 场景
Config.changjing = [
  { id: 1, name: '约会', img: '/img/shaixuan/yuehui.jpg' },
  { id: 2, name: '小众聚餐', img: '/img/shaixuan/xiaozhong.jpg' },
  { id: 3, name: '多人聚会', img: '/img/shaixuan/duoren.jpg' }
]
// 区域
Config.quyu = [
  // { id: 0, name: '全曲靖', img: '/img/shaixuan/quanqujing.jpg' },
  { id: 1, name: '麒麟', img: '/img/shaixuan/qilin.jpg' },
  { id: 2, name: '沾益', img: '/img/shaixuan/zhanyi.jpg' }
]
// 菜系
Config.caixi = [
  // { id: 0, name: '全菜系', img: '/img/shaixuan/quancaixi.jpg' },
  { id: 1, name: '中餐', img: '/img/shaixuan/zhongcan.jpg' },
  { id: 2, name: '西餐', img: '/img/shaixuan/xican.jpg' },
  { id: 3, name: '甜品', img: '/img/shaixuan/tianpin.jpg' }
]
// 星级
// Config.xingji = [{ id: 1, name: '一星' }, { id: 2, name: '二星' }, { id: 3, name: '三星' }]

export { Config }