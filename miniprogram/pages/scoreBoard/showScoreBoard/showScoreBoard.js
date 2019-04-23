//index.js
const app = getApp()

const db = wx.cloud.database()

const dataBaseCollectionName = 'scoreBoardHome'

Page({
  data: {
    namelist: [],
    homeid: "",
    lastModData: new Date(),
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
      that.data.lastModData=res.data.due
      that.data.lastMod=res.data.lastMod
      that.setData({
        namelist: that.data.namelist,
        lastModData: that.data.lastModData,
        lastMod: that.data.lastMod
      })
    }).catch(res=>{
      wx.hideLoading()
    })


  },

})