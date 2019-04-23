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

      // 没有丢出错误的话，说明随机的房号和现有的房号重合了
      // 检查已有的房号最近一次修改的时间，若在三天前，就直接删除该记录
      now=new Date()
      if ((now.getTime()-promise.data.due.getTime())>1000*60*60*24*3){
        console.log("delete doc")
        scoreBoardHome.doc(promise.data._id).remove().then(console.log).catch(console.error)
     
      // 重新随机一个数
      mathRand()
      }
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