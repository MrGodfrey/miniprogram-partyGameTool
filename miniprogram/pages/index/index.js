//index.js
const app = getApp()

const db = wx.cloud.database()

Page({
  data: {
    namelist: [],
    deleteState: "None",
    deleteString: "删除玩家",
    deleteType: "warn",
    deleteReverse: "block",
    optionHide: "None",
    addValue: 1,
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
    this.setData({
      namelist: this.data.namelist
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
    this.storge()
  },
  minusScore: function(e) {
    var index = e.target.dataset.player
    this.data.namelist[index].score -= this.data.addValue
    this.setData({
      namelist: this.data.namelist
    })
    this.storge()
  },

  nameinput: function(e) {
    var newplayer = {}
    newplayer.name = e.detail.value
    newplayer.score = 0
    this.data.namelist.push(newplayer)
    this.setData({
      namelist: this.data.namelist
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
  }

})