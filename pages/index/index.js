//index.js
const app = getApp()

Page({
  data: {
    //轮播图图片路径
    // banner: [
    //  '/image/1.jpg', '/image/2.jpg', '/image/3.jpg'
    // ],
    banner: [],
  },

  //扫码点餐
  btnclick1: function() {

    let saoMa = false; //注意：true 扫码点餐； false 本地点餐
    let that = this;
    /**
     * 本地点餐
     */
    if (!saoMa) {
      that.goToBuy("1号桌")
      return
    }

    /**
     * 扫码点餐，如果需要扫码点餐，就把
     */
    wx.scanCode({
      success: (res) => {
        // { charSet: "utf-8", result: "http://30paotui.com", errMsg: "scanCode:ok", rawData: "aHR0cDovLzMwcGFvdHVpLmNvbQ==", scanType: "QR_CODE" }
        console.log(res.result)
        if (res.result) {
          let str = res.result;
          //识别的二维码里包好30paotui.com就弹出红包领取页
          if (str.search("111") != -1) {
            console.log("1号桌")
            that.goToBuy("1号桌")
          } else if (str.search("222") != -1) {
            console.log("2号桌")
            that.goToBuy("2号桌")
          } else if (str.search("333") != -1) {
            console.log("3号桌")
            that.goToBuy("3号桌")
          }
        }
      }
    })
  },
  //去点餐页
  goToBuy(tableNum) {
    wx.navigateTo({
      url: '../buy/buy?tableNum=' + tableNum
    })
  },

  //菜品浏览
  btnclick2: function() {
    wx.navigateTo({
      url: '../buy/buy'
    })
  },

  //电话订座
  btnclick3: function() {
    wx.makePhoneCall({
      phoneNumber: '18810908748' //仅为示例，并非真实的电话号码
    })
  },
  onLoad() {
   
  },
})