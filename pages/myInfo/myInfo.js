let app = getApp();
// pages/myInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexs: ['男', '女'],
    region: [],
    selfinfo: {},
    namestatus: false,
    index: 0,
    customItem: '全部'
  },
  changeSex: function(e) {
    let temp = {}
    temp.gender = e.detail.value
    this.setData({
      selfinfo: { ...this.data.selfinfo,
        ...temp
      }
    })
    this.updateUserInfo(temp)
  },
  changeNameStatus: function(e) {
    this.setData({
      namestatus: true
    })
  },
  changeName: function(e) {
    let temp = {}
    temp.username = e.detail.value
    this.updateUserInfo(temp)
    this.setData({
      namestatus: false,
      selfinfo: {
        ...this.data.selfinfo,
        ...temp
      }
    })
  },
  changeRegion: function(e) {
    let temp = {}
    temp.province = e.detail.value[0]
    temp.city = e.detail.value[1]
    temp.county = e.detail.value[2]
    this.setData({
      selfinfo: { ...this.data.selfinfo,
        ...temp
      }
    })
    debugger
    this.setData({
      region: [temp.province, temp.city, temp.county]
    })
    this.updateUserInfo(temp)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo()
  },
  updateUserInfo: function(data) {
    let that = this
    let token = app._checkToken()
    wx.request({
      url: app.globalData.baseUrl + '/user/info',
      header: {
        token: token
      },
      method: "post",
      data: data,
      success: function(response) {
        console.log(response)
      }
    })
  },
  getUserInfo: function() {
    let that = this
    let token = app._checkToken()
    wx.request({
      url: app.globalData.baseUrl + '/user/info',
      header: {
        token: token
      },
      success: function(response) {
        that.setData({
          selfinfo: response.data.data,
          region: [response.data.data.province, response.data.data.city, response.data.data.county]
        })
      },
      fail: function(err) {
        console.log(response.data.data)
      }
    })
  }
})