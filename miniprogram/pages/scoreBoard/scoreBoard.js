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
    lastMod: [],
    openid: "",
    deleteState: "None",
    deleteString: "删除玩家",
    deleteType: "warn",
    deleteReverse: "block",
    optionHide: "None",
    inputValue: "",
  },

  onLoad: function() {
    this.data.namelist = this.data.lastMod = wx.getStorageSync('namelist') ? wx.getStorageSync('namelist') : []
    this.data.addValue = wx.getStorageSync('addValue') ? wx.getStorageSync('addValue') : 1
    this.data.lastMod = wx.getStorageSync('lastMod') ? wx.getStorageSync('lastMod') : []

    // 设置云存储的状态，当前openid是否有云存储的房间号.
    this.getCloudStatus()


    this.setData({
      namelist: this.data.namelist,
      addValue: this.data.addValue,
      cloudStore: this.data.cloudStore,
      lastMod: this.data.lastMod
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
      }).get().then(res => {
        // 没有记录
        if (res.data.length == 0) {
          that.data.cloudStore = {
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
          // 将本地数据更新到云端
          db.collection(dataBaseCollectionName).doc(that.data.homeid).update({
            data: {
              namelist: that.data.namelist
            },
            success(res) {
              console.log("namelist update successful")
            }
          })
        }
        that.setData({
          cloudStore: that.data.cloudStore,
        })
      }).catch(res => {
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
    wx.setStorage({
      key: 'lastMod',
      data: that.data.lastMod,
    })

    if (this.data.cloudStore.cloudFlag) {
      this.cloudUpdate()
    }
  },

  cloudUpdate: function() {
    console.log("cloudUpdate")
    var that = this
    db.collection(dataBaseCollectionName).doc(this.data.cloudStore.homeid).update({
      data: {
        namelist: that.data.namelist,
        lastMod: that.data.lastMod
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
      wx.pageScrollTo({
        scrollTop: 1000,
        duration: 300
      })
    } else {
      this.setData({
        optionHide: "None",
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
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

  addScore: function(e, flag = true) {
    var index = e.target.dataset.player
    if (flag) {
      this.data.namelist[index].score += this.data.addValue
    } else {
      this.data.namelist[index].score -= this.data.addValue

    }
    var name = this.data.namelist[index].name
    var value = this.data.addValue
    var addTag = " +"
    if (!flag) {
      addTag = " -"
    }
    if (this.data.lastMod.unshift(name + addTag + value) > 3) {
      this.data.lastMod.pop()
    }
    this.setData({
      namelist: this.data.namelist,
      lastMod: this.data.lastMod
    })
    var that = this
    wx.showToast({
      title: that.data.namelist[index].name + addTag + that.data.addValue,
      icon: 'success',
      duration: 500,
      mask: true
    });
    this.storge()
  },

  minusScore: function(e) {
    this.addScore(e, false)
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
    wx.pageScrollTo({
      scrollTop: 0,
    })
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
    wx.pageScrollTo({
      scrollTop: 0,
    })
    wx.showLoading({
      title: '生成房号中'
    })
    var that = this
    wx.cloud.callFunction({
      name: 'homeidGenerate',
      complete: res => {
        that.createHomeByid(res.result.id)
      }
    })
  },

  createHomeByid: function(id) {
    var that = this
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
      wx.hideLoading()
      // that.storge()
    }).catch(res => {
      console.error(res)
    })
  },

  homeidInput: function(e) {
    var showHomeid = e.detail.value
    this.setData({
      inputValue: ""
    })
    wx.showLoading({
      title: '加载中',
    })
    db.collection(dataBaseCollectionName).where({
      _id: showHomeid
    }).get().then(res => {
      wx.hideLoading()
      // 没找到房号
      if (res.data.length == 0) {
        wx.showToast({
          title: "未找到房间# " + showHomeid,
          icon: 'none',
          duration: 2000,
        });
      } else {
        wx.redirectTo({
          url: 'showScoreBoard/showScoreBoard?id=' + showHomeid,
          fail(res) {
            console.log(res)
          }
        })
      }
    })
  },

  nameinput: function(e) {
    var name = e.detail.value
    if (name != "") {
      this.data.namelist.push({
        name: name,
        score: 0
      })
      this.setData({
        namelist: this.data.namelist
      })
      this.storge()
    }
    this.setData({
      inputValue: ""
    })
  }

})