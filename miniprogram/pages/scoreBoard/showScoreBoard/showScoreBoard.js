//index.js
const app = getApp()

const db = wx.cloud.database()

const dataBaseCollectionName = 'scoreBoardHome'

Page({
  data: {
    namelist: [],
    homeid: "",
    lastMod: new Date()
  },

  onLoad: function(option) {
    this.data.homeid = option.id
    this.setData({
      homeid: this.data.homeid
    })
  },

  onReady: function() {
    this.getCloudStatus()
    wx.hideLoading()

  },
  onShow: function() {
    this.getCloudStatus()
    wx.hideLoading()

  },

  onPullDownRefresh: function() {
    this.getCloudStatus()
  },

  getCloudStatus: function() {
    var that = this
    
    wx.showLoading({
      title: '玩家信息加载中',
    })

    db.collection(dataBaseCollectionName).doc(that.data.homeid).get().then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()

      console.log(res)
      that.data.namelist=res.data.namelist
      that.data.lastMod=res.data.due
      that.setData({
        namelist: that.data.namelist,
        lastMod: that.data.lastMod
      })
    }).catch(res=>{
      wx.hideLoading()
    })


  },

})