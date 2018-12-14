// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("qyzx_texts").doc(event._id).update({
      data: {
        ding: event.dianzan
      }
    })
    console.log("需要更新的数据ID是：", event._id, "点赞是", event.dianzan)
  }catch (e) {
    console.error(e)
  }
}