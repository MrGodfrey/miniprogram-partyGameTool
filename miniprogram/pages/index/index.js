//index.js
const app = getApp()

const db = wx.cloud.database()

Page({
  data: {
    namelist: [
      {
        name: "李伟宇",
        score: 0,
        unique: "unique_1",
      },
      {
        name: "黄泽宇",
        score: 0,
        unique: "unique_2",
      },
      {
        name: "张  荣",
        score: 0,
        unique: "unique_3",
      },
      {
        name: "黄金丽",
        score: 0,
        unique: "unique_4",
      },
      {
        name: "王 宇",
        score: 0,
        unique: "unique_5",
      },
    ],
  },

  onLoad: function() {},

  addScore: function(e) {
    var index=e.target.dataset.player
    this.data.namelist[index].score+=1
    this.setData({
      namelist: this.data.namelist
    })
  },
  minusScore: function(e) {
    var index=e.target.dataset.player
    this.data.namelist[index].score-=1
    this.setData({
      namelist: this.data.namelist
    })
  },
  

})