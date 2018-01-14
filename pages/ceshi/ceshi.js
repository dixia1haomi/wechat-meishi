// // qq-地图
// var QQmap = require('../../qqmap/qqmap-wx-jssdk.min.js');
// var qqmap = new QQmap({ key: '7BABZ-AQTKF-M2XJY-JBKHV-44Y5V-T3FO7' })

// Page({
//   data: {

//   },

//   onLoad: function () {

//     // 获取位置
//     wx.getLocation({
//       type: 'wgs84',
//       success: function (res) {
//         var latitude = res.latitude
//         var longitude = res.longitude
//         var speed = res.speed
//         var accuracy = res.accuracy
//         console.log('获取位置', res)

//       }
//     })
//   },

//   onShow: function () {


//   },

//   // getweizhi
//   getweizhi() {
//     wx.chooseLocation({
//       success: (res) => {
//         console.log('打开地图', res)
//         // 调用接口
//         qqmap.calculateDistance({
//           //驾车
//           mode: 'driving',
//           to: [{
//             latitude: res.latitude,
//             longitude: res.longitude
//           }],
//           success: function (res) {
//             console.log('qq接口', res);
//             console.log('相距' + res.result.elements[0].distance + '米')
//             console.log('大概' + res.result.elements[0].duration + '秒到')
//           },
//           fail:function(res){
//             console.log('fail',res)
//           }
//         });

//       }
//     })
//   },
// })



// 引用百度地图微信小程序JSAPI模块 
// var bmap = require('../../baidumap/bmap-wx.min.js');
// var wxMarkerData = [];  //定位成功回调对象  
// Page({
//   data: {
//     ak: "FHG7utZtdyXN2", //填写申请到的ak  
//     markers: [],
//     longitude: '',   //经度  
//     latitude: '',    //纬度  
//     address: '',     //地址  
//     cityInfo: {}     //城市信息  
//   },
//   onLoad: function (options) {
//     var that = this;
//     /* 获取定位地理位置 */
//     // 新建bmap对象   
//     var BMap = new bmap.BMapWX({
//       ak: 'CCcnTQWO9OlNehV9RZ4PTq51a0dRWU6F'
//     });
//     // var fail = function (data) {
//     //   console.log(data);
//     // };
//     // var success = function (data) {
//     //   //返回数据内，已经包含经纬度  
//     //   console.log(data);
//     //   //使用wxMarkerData获取数据  
//     //   wxMarkerData = data.wxMarkerData;
//     //   //把所有数据放在初始化data内  
//     //   that.setData({
//     //     markers: wxMarkerData,
//     //     latitude: wxMarkerData[0].latitude,
//     //     longitude: wxMarkerData[0].longitude,
//     //     address: wxMarkerData[0].address,
//     //     cityInfo: data.originalData.result.addressComponent
//     //   });

//     // 发起regeocoding检索请求   
//     BMap.search({
//       iconPath: ' ',
//       success: (res) => {
//         console.log(res)
//       },
//       fail: (res) => {
//         console.log(res)
//       },
//     });
//   }

// })


var amapFile = require('../../gaodemap/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '1fafc5e0acc166803d566256e8843740' });
// Page({

//   data: {

//   },

//   onLoad: function () {
//     // 周边
//     myAmapFun.getPoiAround({
//       success: function (data) {
//         console.log('周边',data)
//       },
//       fail: function (info) {
//         console.log(info)
//       }
//     })

//     // 逆地理
//     myAmapFun.getRegeo({
//       success: function (data) {
//         console.log('逆地理', data)
//       },
//       fail: function (info) {
//         console.log(info)
//       }
//     })
//   },
// })

Page({
  data: {
    markers: [{
      iconPath: "",
      id: 0,
      latitude: 39.989643,
      longitude: 116.481028,
      width: 23,
      height: 33
    }, {
      iconPath: "",
      id: 0,
      latitude: 39.90816,
      longitude: 116.434446,
      width: 24,
      height: 34
    }],
    distance: '',
    cost: '',
    polyline: []
  },
  onLoad: function () {
    // wx.request({
    //   url: 'https://restapi.amap.com/v3/distance?key=feebad36bbeda0cc33e794abc5d4421e&origins=116.481028,39.989643|114.481028,39.989643|115.481028,39.989643&destination=114.465302,40.004717',
    //   success:(res)=>{
    //     console.log('aa',res)
    //   }
    // })
    var that = this;
    // var key = config.Config.key;
    // var myAmapFun = new amapFile.AMapWX({ key: '高德Key' });
    myAmapFun.getDrivingRoute({
      origin: '116.481028,39.989643',
      destination: '116.434446,39.90816',
      success: function (data) {
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
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {

      }
    })
  },
  goDetail: function () {
    wx.navigateTo({
      url: '../navigation_car_detail/navigation'
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation'
    })
  }
})