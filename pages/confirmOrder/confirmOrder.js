let app = getApp();
let payWay = [{
  "id": 1,
  "package": "会员卡",
  "money": 100
}, {
  "id": 2,
  "package": "微信支付",
  "money": 500
}, {
  "id": 3,
  "package": "银行卡",
  "money": 1000
}]
Page({
  //页面的初始数据
  data: {
    couponlist: [],
    tableNum: "",
    address: "",
    addressdetail: "",
    confirmOrder: [],
    // 输入框中的用餐人数
    diner_num: 0,
    // 用餐人数输入框获取焦点
    diner_numF: false,
    // 备注信息
    remarks: "",
    //支付方式列表
    payWayList: [],
    // 购物车数据
    cartList: [],
    totalPrice: 0,
    couponMoney: 0,
    useCouponId: "",
    totalNum: 0,
    // 遮罩
    maskFlag: true,
  },

  radioChange: function (e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    for (var i in that.data.couponlist) {
      if (that.data.couponlist[i].id == e.detail.value) {
        var couponMoney = that.data.couponlist[i].money
        that.setData({
          couponMoney: couponMoney,
          useCouponId: e.detail.value
        })
      }
    }
  },

  // 生命周期函数--监听页面加载
  onLoad: function (Options) {
    var that = this;
    var arr = wx.getStorageSync('cart') || [];
    for (var i in arr) {
      this.data.totalPrice += arr[i].quantity * arr[i].price;
      this.data.totalNum += arr[i].quantity
    }
    this.setData({
      cartList: arr,
      totalPrice: this.data.totalPrice.toFixed(2),
      totalNum: this.data.totalNum
    })

    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth / 2) / 2,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
    //     });
    //   }
    // });
  },


  onShow: function () {
    var that = this
    that.getAddress()

    var token = app._checkToken()

    wx.request({
      url: app.globalData.baseUrl + '/buyer/product/mine-coupon/list',
      header: { token: token },
      success: function (res) {
        if (res && res.data && res.data.data) {
          var resultData = res.data.data
          console.log(resultData)
          that.setData({
            couponlist: res.data.data,
          });
        }
      }
    })
  },
  // 点击数字，输入框出现对应数字
  getDinnerNUM: function (e) {
    var dinnerNum = e.currentTarget.dataset.num;
    var diner_num = this.data.diner_num;
    // 点击“输”，获取焦点，
    if (dinnerNum == 0) {
      this.setData({
        diner_numF: true,
      })
      this.getDinerNum();
    } else {
      this.setData({
        diner_num: dinnerNum
      });
    }
  },
  //打开支付方式弹窗
  choosePayWay: function () {
    var payWayList = this.data.payWayList
    var that = this;
    var rd_session = wx.getStorageSync('rd_session') || [];


    that.setData({
      payWayList: payWay
    });

    // 支付方式打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    that.setData({
      maskFlag: false,
    });
  },
  // 支付方式关闭方法
  closePayWay: function () {
    var that = this
    // 支付方式关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    that.setData({
      maskFlag: true
    });
  },
  // 获取输入的用餐人数
  getDinerNum: function (e) {
    var diner_num = this.data.diner_num;
    this.setData({
      diner_num: diner_num
    })
  },
  // 获取备注信息
  getRemark: function (e) {
    var remarks = this.data.remarks;
    this.setData({
      remarks: e.detail.value
    })
  },
  //提交订单
  submitOrder: function (e) {
    var that = this;
    var tableNum = '1';

    var arr = wx.getStorageSync('cart') || [];

    var goods_arr = [];
    arr.forEach(order => {
      console.log(order);
      var goods = new Object();
      goods.productId = order.id;
      goods.productQuantity = order.quantity;
      goods_arr.push(goods)
    })

    var goods_josn = JSON.stringify(goods_arr);
    console.log(goods_josn)
    var diner_num = this.data.diner_num; //用餐人数
    var dinerNum;
    var remarks = this.data.remarks; //备注信息
    var payId = e.currentTarget.dataset.id;
    var rd_session = wx.getStorageSync('rd_session') || [];
    if (diner_num == 0) {
      that.setData({
        diner_num: 1
      })
    }
    var peoples = this.data.diner_num
    wx.request({
      url: app.globalData.baseUrl + '/buyer/order/create',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: app.globalData.openid,
        name: app.globalData.userInfo.username,
        couponId: this.data.useCouponId,
        phone: this.data.address.telNumber,
        address: this.data.addressdetail,
        items: goods_josn
      },
      success: function (res) {
        // var rescode = res.data.code
        console.log("支付成功", res.data)
        if (res && res.data && res.data.data) {
          // 支付方式关闭动画
          that.animation.translate(0, 285).step();
          that.setData({
            animationData: that.animation.export()
          });
          that.setData({
            maskFlag: true
          });
          wx.showToast({
            title: '下单成功！',
          })
          wx.setStorageSync('cart', "")
          wx.switchTab({
            url: '../me/me',
          })
        } else {
          // 支付方式关闭动画
          that.animation.translate(0, 285).step();
          that.setData({
            animationData: that.animation.export()
          });
          that.setData({
            maskFlag: true
          });
          //  wx.showToast({
          //    title: res.data.message,
          // })
        }

      }
    })

  },
  dealAddress: function (data) {
    let tempaddress = ''
    tempaddress = data.provinceName + data.cityName + data.countyName + data.detailInfo
    return tempaddress
  },
  getAddress: function () {
    var that = this
    let curAddress = wx.getStorageSync('address')
    let token = app._checkToken()
    that.setData({
      addressdetail: this.dealAddress(curAddress),
      address: curAddress
    });
    if (!curAddress) {
      wx.request({
        url: app.globalData.baseUrl + '/user/address',
        header: {
          token: token
        },
        success: function (response) {
          console.log(response.data.data)
          if (response.data.data) {
            wx.setStorageSync('address', response.data.data)
            that.setData({
              addressdetail: this.dealAddress(curAddress),
              address: curAddress
            });
          } else {
            that.address()
          }

        }
      })
    }
  },

  address: function () {
    if (wx.chooseAddress) {
      let token = app._checkToken()
      // let openid = app._checkOpenid()
      wx.chooseAddress({
        success: function (res) {
          wx.request({
            url: app.globalData.baseUrl + '/user/address',
            header: {
              token: token
            },
            method: "post",
            data: res,
            success: function (response) {
              console.log(response.data.data)
              wx.setStorageSync('address', response.data.data)
              that.setData({
                addressdetail: this.dealAddress(curAddress),
                address: curAddress
              });
            }
          })
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }

  },


})