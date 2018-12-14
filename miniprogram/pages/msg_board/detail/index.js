// pages/index/detail/index.js
var app = getApp();
let that = this;
var Bmob = require('../../../dist/Bmob-1.6.7.min.js');
Bmob.initialize("2a182fee9b5c946700073639ac0d6dc8", "360e735e98a5ea253458f0695df5fad5");
const {
  $Toast
} = require('../../../dist/base/index');
var textId = ''
var pinglun = ''
const db = wx.cloud.database()

Page({
  data: {
    rows: {},
    rows_due: '',
    zans: 0,
    PlId: '',
    textId: '',
    textList: [],
    pinglun: '',
    hiddenmodalput: true,
    commentList: {},
    comment_due: ''
  },

  //点击按钮指定的hiddenmodalput弹出框  
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  //评论完成后点击取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
    this.setData({
      pinglun: "",
    });
  },


  //评论完成后点击确认按钮  
  confirm: function() {
    pinglun = this.data.pinglun
    textId = this.data.textId
    this.setData({
      hiddenmodalput: true
    })
    const query = Bmob.Query('comments');
    query.set("content", pinglun)
    query.set("deleted", false)
    query.set("openid", app.globalData.userInfo.openid)
    query.set("textID", textId)
    query.save().then(res => {
      console.log(res)
      $Toast({
        content: '友善发言的人运气不会太差。',
        type: 'success'
      });
      wx.navigateTo({
        url: '/pages/msg_board/detail/index?objectId=' + this.data.textId,
      })
    }).catch(err => {
      console.log(err)
      $Toast({
        content: '提交失败,请检查网络',
        type: 'error'
      });
    })
    //插入一条评论数据
    // const comments_collection = db.collection('qyzx_comments');
    // comments_collection.add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     due: new Date(),
    //     content: pinglun,
    //     commentator: app.globalData.userInfo.nickName,
    //     textID: textId,
    //     deleted: false
    //   },
    //   success: function(res) {
    //     console.log(res)
    //     $Toast({
    //       content: '友善发言的人运气不会太差。',
    //       type: 'success'
    //     });
    //   },
    //   fail: function(err) {
    //     console.log(err)
    //     $Toast({
    //       content: '提交失败,请检查网络',
    //       type: 'error'
    //     });
    //   }
    // })

    // const comments_collection2 = db.collection('qyzx_comments');
    // comments_collection2.where({
    //     textID: this.data.textId
    //   }).orderBy('due', 'desc')
    //   .get().then(res => {
    //     console.log('按时间排序后：', res.data)
    //     this.setData({
    //       'commentList': res.data
    //     })
    //     console.log('commentList:', this.data.commentList)
    //   });

  },

  sugInput: function(e) {
    this.setData({
      pinglun: e.detail.value
    })
  },

  dele: function() {
    console.log("删除函数运行")
    console.log("这篇文章的id是：", this.data.textId)
    db.collection('qyzx_texts').doc(this.data.textId).update({
      data: {
        deleted: true
      },
      success: function(res) {
        console.log(res)
      }
    })
    wx.showModal({
      title: '提示',
      content: '删除成功！',
    })
  },

  zan: function(e) {
    const praise_collection = db.collection('qyzx_praise');

    //在qyzx_praise中查找是否当前用户赞过该帖子
    console.log("app.globalData.openid:", app.globalData.userInfo.openid, "textID:", this.data.textId)
    praise_collection.where({
      '_openid': app.globalData.userInfo.openid,
      'textID': this.data.textId
    }).get().then(res => {
      console.log("赞记录", res)
      if (res.data.length == 0) {

        // 用户未赞过该帖子,新增qyzx_praise记录
        praise_collection.add({
          data: {
            due: new Date(),
            textID: new String(this.data.textId),
            //userID: new String(app.globalData.openid)
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log('add zan ', res)
          }
        })

        // 用户未赞过该帖子
        // 刷新界面上的点赞数
        var d = this.data.zans
        var textid = this.data.textId
        console.log("textid:", textid)
        console.log("zan:", d + 1)
        this.setData({
          zans: d + 1
        })
        const query = Bmob.Query('texts');
        query.set('id', textid) //需要修改的objectId
        query.set('ding', d + 1)
        query.save().then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
        // wx.cloud.callFunction({
        //   name: 'zan',
        //   data: {
        //     _id: this.data.textId,
        //     dianzan: d+1
        //   },
        //   success: res => {
        //     console.log('更新数据成功')
        //   }
        // })
        // db.collection('qyzx_texts').doc(this.data.textId).update({
        //   data: {
        //     // 将浏览量自增 1
        //     ding: _.inc(1)
        //   },
        //   success: function(res) {
        //     console.log(res)
        //   }
        // })

      } else {
        //用户已经赞过该帖子
        $Toast({
          content: '每个人只能赞一次哦',
          icon: 'praise'
        });
      }
    })
  },



  onLoad: function(e) {
    // 页面初始化 objectId为页面跳转所带来的参数
    var textId = e.objectId;
    console.log("e", e)
    var that = this;
    console.log('onload执行')

    const query = Bmob.Query('texts');

    query.equalTo("objectId", "==", textId);
    query.find().then(res => {
      var duestr = res[0].createdAt
      console.log(res)
      that.setData({
        rows: res[0],
        rows_due: duestr,
        textId: textId,
        zans: res[0].ding,
        content: res[0].content
      })
    });
    // const _ = db.command

    // db.collection('qyzx_texts').doc(textId).get().then(res => {
    //   var duestr = String(res.data.due).split(" ").slice(1, 5).join(" ")
    //   that.setData({
    //     rows: res.data,
    //     rows_due: duestr,
    //     textId: textId,
    //     zans: res.data.ding,
    //     content: res.data.content
    //   })
    //   console.log('rows', that.data.rows)
    //   console.log('textID', this.data.textId)
    // })

    // db.collection('qyzx_texts').doc(textId).update({
    //   data: {
    //     // 将浏览量自增 1
    //     viewed: _.inc(1)
    //   },
    //   success: function(res) {
    //     console.log(res)
    //   }
    // })
    const query1 = Bmob.Query('comments');
    query1.equalTo("textID", "==", textId);
    query1.find().then(res => {
      console.log(res.data)
      this.setData({
        'commentList': res
      })
      console.log('commentList:', this.data.commentList)
    });

    // db.collection('qyzx_comments').where({
    //   textID: textId
    // }).get().then(res => {
    //   console.log(res.data)
    //   this.setData({
    //     'commentList': res.data
    //   })
    //   console.log('commentList:', this.data.commentList)
    // })

  },

  onReady: function() {},

  onShow: function() {

  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  //下拉刷新
  // onPullDownRefresh: function() {
  //   wx.showNavigationBarLoading() //在标题栏中显示加载

  //   db.collection('qyzx_comments').where({
  //     textID: this.data.textId
  //   }).get({
  //     success: function(res) {
  //       console.log(res.data)
  //       this.setData({
  //         'commentList': res.data
  //       })
  //       console.log('commentList:', this.data.commentList)
  //     }
  //   });

  //   //模拟加载
  //   setTimeout(function() {
  //     // complete
  //     wx.hideNavigationBarLoading() //完成停止加载
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //   }, 500);
  // },

})