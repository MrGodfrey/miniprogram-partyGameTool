// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const scoreBoardHome = db.collection('scoreBoardHome')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {


  var num = "";

  // 随机数生成器
  function mathRand() {
    num = ""
    for (var i = 0; i < 3; i++) {
      num += Math.floor(Math.random() * 10);
    }
  }
  mathRand()
  // 查找是否有当前房号

  var flag = true

  do {
    try {
      // await 的用法值得学习
      const promise = await scoreBoardHome.doc(num).get()
      promise.then(res => {
        mathRand()
      })
    }
    catch (err){
      flag=false
    }
  } while (flag)

  return {
    event,
    id: num
  }
}