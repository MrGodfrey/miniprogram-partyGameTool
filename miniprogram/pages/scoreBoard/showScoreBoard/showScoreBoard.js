//index.js
const app = getApp()

const db = wx.cloud.database()

const dataBaseCollectionName = 'scoreBoardHome'

Page({
  data: {
    namelist: [],
    homeid: "",
    // lastModDate: new Date(),
    lastMod: []
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
      that.data.lastModDate = res.data.due.toTimeString().slice(0, 8)
      that.data.lastMod=res.data.lastMod
      that.setData({
        namelist: that.data.namelist,
        lastModDate: that.data.lastModDate,
        lastMod: that.data.lastMod
      })
    }).catch(res=>{
      wx.hideLoading()
    })


  },

})