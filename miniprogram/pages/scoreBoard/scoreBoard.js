//index.js
const app = getApp()

const db = wx.cloud.database()

const dataBaseCollectionName = 'scoreBoardHome'

Page({
  data: {
    namelist: [],
    addValue: 1,
    cloudStore: {
      cloudFlag: false,
      homeid: ""
    },
    openid: "",
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

    // 这里应当用云存储设置状态
    // this.data.cloudStore = wx.getStorageSync('cloudStore') ? wx.getStorageSync('cloudStore') : {
    //   cloudFlag: false,
    //   homeid: ""
    // }

    // 设置云存储的状态，当前openid是否有云存储的房间号.
    this.getCloudStatus()


    this.setData({
      namelist: this.data.namelist,
      addValue: this.data.addValue,
      cloudStore: this.data.cloudStore
    })
  },

  getCloudStatus: function() {
    var that = this

    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      that.data.openid = res.result.openid
      changeCloudStatus()

    })

    function changeCloudStatus() {
      db.collection(dataBaseCollectionName).where({
        _openid: that.data.openid
      }).get().then(res=>{
        // 没有记录
        if(res.data.length==0){
          that.data.cloudStore={
            cloudFlag: false,
            homeid: ""
          }
        }
        // 有记录
        else {
          that.data.cloudStore = {
            cloudFlag: true,
            homeid: res.data[0]._id
          }
        }
        that.setData({
          cloudStore: that.data.cloudStore
        })
      }).catch(res=>{
        console.error(res)
      })
    }
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
    // 不能本地存储云服务状态，应该调用云存储来设置初始状态
    // wx.setStorage({
    //   key: 'cloudStore',
    //   data: that.data.cloudStore,
    // })

    if (this.data.cloudStore.cloudFlag) {
      this.cloudUpdate()
    }
  },

  cloudUpdate: function() {
    console.log("cloudUpdate")
    var that = this
    db.collection(dataBaseCollectionName).doc(this.data.cloudStore.homeid).update({
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
    var that = this
    db.collection(dataBaseCollectionName).doc(this.data.cloudStore.homeid).remove({
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
    var that = this
    var id = "1"
    db.collection(dataBaseCollectionName).add({
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
      // that.storge()
    }).catch(res => {
      console.error(res)
    })
  }

})