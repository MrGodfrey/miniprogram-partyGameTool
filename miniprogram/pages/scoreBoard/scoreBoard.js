//index.js
const app = getApp()

const db = wx.cloud.database()

Page({
  data: {
    namelist: [],
    addValue: 1,
    cloudStore: {
      cloudFlag: false,
      homeid: ""
    },
    deleteState: "None",
    deleteString: "删除玩家",
    deleteType: "warn",
    deleteReverse: "block",
    optionHide: "None",
    inputValue: "",
  },

  onLoad: function() {
    var res = wx.getStorageSync('namelist')
    var len = res.length
    for (var i = 0; i < len; i++) {
      var newplayer = {}
      newplayer.name = res[i].name
      newplayer.score = res[i].score
      this.data.namelist.push(newplayer)
    }

    this.data.addValue = wx.getStorageSync('addValue') ? wx.getStorageSync('addValue'):1

    this.data.cloud = wx.getStorageSync('cloudStore')

    this.setData({
      namelist: this.data.namelist,
      addValue: this.data.addValue,
      cloudStore: this.data.cloudStore
    })
  },

  onHide: function() {
    this.storge()
  },

  storge: function() {
    wx.setStorage({
      key: 'namelist',
      data: this.data.namelist,
    })
    wx.setStorage({
      key: 'addValue',
      data: this.data.addValue,
    })
    wx.setStorage({
      key: 'cloudStore',
      cloudStore: this.data.cloudStore,
    })
  },

  optionTap: function(e) {
    if (this.data.optionHide === "None") {
      this.setData({
        optionHide: "inline",
      })
    } else {
      this.setData({
        optionHide: "None",
      })
    }
  },

  onUnload: function() {
    this.storge()
  },

  deletePlayer: function(e) {
    var index = e.target.dataset.player
    this.data.namelist.splice(index, 1)
    this.setData({
      namelist: this.data.namelist,
    })
    this.storge()
  },

  sliderChange: function(e) {
    this.setData({
      addValue: e.detail.value,
    })
  },

  addScore: function(e) {
    var index = e.target.dataset.player
    this.data.namelist[index].score += this.data.addValue
    this.setData({
      namelist: this.data.namelist
    })
    var that=this
    wx.showToast({
      title: that.data.namelist[index].name + '  +' + that.data.addValue,
      icon: 'success',
      duration: 500,
      mask: true
    });
    this.storge()
  },
  minusScore: function(e) {
    var index = e.target.dataset.player
    this.data.namelist[index].score -= this.data.addValue
    this.setData({
      namelist: this.data.namelist
    })
    var that = this
    wx.showToast({
      title: that.data.namelist[index].name + '  -' + that.data.addValue,
      icon: 'success',
      duration: 500,
      mask: true
    });
    this.storge()
  },

  nameinput: function(e) {
    console.log(e)
    var newplayer = {}
    newplayer.name = e.detail.value
    newplayer.score = 0
    this.data.namelist.push(newplayer)
    this.setData({
      namelist: this.data.namelist,
      inputValue: ""
    })
    this.storge()
  },



  deleteChangeStyle: function(e) {
    if (this.data.deleteState === "None") {
      console.log(e)
      this.setData({
        deleteState: "inline",
        deleteReverse: "None",
        deleteString: "完成",
        deleteType: "primary"
      })
    } else {
      this.setData({
        deleteState: "None",
        deleteReverse: "block",
        deleteString: "删除玩家",
        deleteType: "warn"
      })
    }
  },

  cloudSwitchChange: function(e) {
    this.data.cloudStore.cloudFlag = Boolean(e.detail.value)
    
    this.setData({
      cloudStore: this.data.cloudStore
    })
  }

})