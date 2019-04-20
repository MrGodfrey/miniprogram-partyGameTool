// miniprogram/pages/mask/existHome/existHome.js

const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    playerList: [],
    joined: false,
    openid: "",
    plindex: 0,
    inputValue: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    this.setData({
      id: this.data.id
    })
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        that.data.openid = res.result.openid
        that.getData()
        that.setData({
          openid: that.data.openid
        })
      }
    })

  },

  getData: function() {
    var that = this
    that.data.playerList=[]
    db.collection('home').doc(this.data.id).get({
      success(res) {
        that.data.id = res.data._id
        var n = res.data.playerList.length
        for (var i = 0; i < n; i++) {
          that.data.playerList.push(res.data.playerList[i])
          if (res.data.playerList[i]._openid === that.data.openid) {
            that.data.joined = true
            that.data.plindex = i
          }
        }
        that.setData({
          id: that.data.id,
          playerList: that.data.playerList,
          joined: that.data.joined,
          plindex: that.data.plindex,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  nameInput: function(e) {
    var player = {}
    player.name = e.detail.value
    player.score = 0
    player._openid = this.data.openid
    console.log(player)
    var that=this
    // 这里折腾了好久好久，注意云函数不能用回调，必须要用promise
    wx.cloud.callFunction({
      name: 'addPlayer',
      data: {
        player: player,
        id: that.data.id,
      },
      complete: res => {
        console.log('callFunction addPlayer result: ', res)
        that.getData()
      },
    })

  },

})