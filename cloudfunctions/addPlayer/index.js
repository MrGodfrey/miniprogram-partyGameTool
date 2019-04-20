// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  var player = event.player
  var id = event.id

  const _ = db.command

  console.log("first, we begin")
  console.log("player:" + player.name + "  id:" + id)
  db.collection('home').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        playerList: _.push(player)
      }
    })
    .then(console.log)
    .catch(console.error)

  return await db.collection('home').doc(id).get()
}