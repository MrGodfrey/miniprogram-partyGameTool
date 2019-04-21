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

    this.data.addValue = wx.getStorageSync('addValue') ? wx.getStorageSync('addValue') : 1

    this.data.cloudStore = wx.getStorageSync('cloudStore') ? wx.getStorageSync('cloudStore') : {
      cloudFlag: false,
      homeid: ""
    }

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
    var that = this
    wx.setStorage({
      key: 'namelist',
      data: that.data.namelist,
    })
    wx.setStorage({
      key: 'addValue',
      data: that.data.addValue,
    })
    wx.setStorage({
      key: 'cloudStore',
      data: that.data.cloudStore,
    })

    if (this.data.cloudStore.cloudFlag) {
      this.cloudUpdate()
    }
  },

  cloudUpdate: function() {
    var that = this
    db.collection('scoreBoardHome').doc(this.data.cloudStore.homeid).update({
      data: {
        namelist: that.data.namelist
      },
      success(res) {
        console.log(res)
      }
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
    var that = this
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

    if (this.data.cloudStore.cloudFlag == true) {
    // 上传到云服务器
        this.createHome()
    }

    if (this.data.cloudStore.cloudFlag == false) {
      // 从云服务器删除数据
      if (this.data.cloudStore.homeid != "") {
        this.deleteHome()
      }
    }

    this.setData({
      cloudStore: this.data.cloudStore
    })
    this.storge()
  },

  deleteHome: function() {
    var that=this
    db.collection('scoreBoardHome').doc(this.data.cloudStore.homeid).remove({
      success(res) {
        console.log(res)
        that.data.cloudStore.homeid = ""
        that.data.cloudStore.cloudFlag = false
        that.setData({
          cloudStore: that.data.cloudStore
        })
        that.storge()
      }
    })
  },

  createHome: function() {
    // 暂时创建房号为1
    var that = this
    var id = "2"
    db.collection('scoreBoardHome').add({
      data: {
        _id: id,
        due: new Date(),
        namelist: that.data.namelist
      }
    }).then(res => {
      console.log(res)
      that.data.cloudStore.homeid = id
      that.setData({
        cloudStore: that.data.cloudStore
      })
      that.storge()
    }).catch(res=>{
      console.error(res)
    })
  }

})