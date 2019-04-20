//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {

  },

  test: function() {
    db.collection('home').doc("1").get().then(res => {
      console.log("what now?")
      console.log(res.data)
    })
  }

})