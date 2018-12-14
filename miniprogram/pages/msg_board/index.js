//index.js
//获取应用实例
const { $Toast } = require('../../dist/base/index');
var Bmob = require('../../dist/Bmob-1.6.7.min.js');
Bmob.initialize("2a182fee9b5c946700073639ac0d6dc8", "360e735e98a5ea253458f0695df5fad5");
const db = wx.cloud.database()
var common = require('../../dist/common.js');
var pinglun = '';

var app = getApp();
var idd = []
var that;
Page({
  data: {

    textList: {},
    shijian: false,
    index: 0,
    current: '全部',
    current_scroll: '全部',
    color: ["#72afd3, #37ecba"],
    deg: 135,
    showLeft1: false,
    username: '',
    avatarUrl: '',
    master: false,
    hiddenmodalput: true,
    pinglun: ''
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getLike(this);
    this.onShow();
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    getLike(this);
    this.onShow();
  },
  change: function() {
    wx.navigateTo({
      url: '/pages/home/login/login',
    })
  },


  confirm: function() {
   
    pinglun = this.data.pinglun
    this.setData({
      hiddenmodalput: true
    })
    const query = Bmob.Query('texts');
    query.set("content", pinglun)
    query.set("deleted", false)
    query.set("ding", 0)
    query.set("openid", app.globalData.userInfo.openid)
    query.save().then(res => {
      console.log(res)
      $Toast({
        content: '友善发言的人运气不会太差。',
        type: 'success'
      });
      wx.redirectTo({
        url: '/pages/msg_board/index',
      })
    }).catch(err => {
      console.log(err)
      $Toast({
        content: '提交失败,请检查网络',
        type: 'error'
      });
    })
    //插入一条评论数据
    // const comments_collection = db.collection('qyzx_texts');
    // comments_collection.add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     due: new Date(),
    //     content: pinglun,
    //     commentator: app.globalData.userInfo.nickName,
    //     deleted: false,
    //     ding: 0
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
  },

  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
    this.setData({
      pinglun: "",
    });
  },

  sugInput: function(e) {
    this.setData({
      pinglun: e.detail.value
    })
  },


  fabiao: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  // onReachBottom: function() {
  //   const query = Bmob.Query('texts');
  //   console.log("onReachBottom函数运行！")
  //   const _ = db.command
  //   if (this.data.shijian == false) {
  //     query.notContainedIn("objectId", idd);
  //     query.equalTo("deleted", "==", false);
  //     query.order("-score");
  //     query.find().then(res => {
  //       console.log(res)
  //       for (var index in res.data) {
  //         idd.push(res.data[index].objectId)
  //       }
  //       this.setData({
  //         textList: this.data.textList.concat(res.data)
  //       })
  //     });
  //     // db.collection("qyzx_texts").where({
  //     //   _id: _.nin(idd),
  //     //   deleted: false
  //     // }).get().then(res => {
  //     //   console.log(res)
  //     //   for (var index in res.data) {
  //     //     idd.push(res.data[index]._id)
  //     //   }
  //     //   this.setData({
  //     //     textList: this.data.textList.concat(res.data)
  //     //   })
  //     // })
  //   } else {

  //     query.equalTo("deleted", "==", false);
  //     query.ContainedIn("objectId", idd);
  //     query.order("-createdAt");
  //     query.find().then(res => {
  //       console.log(res)
  //       for (var index in res.data) {
  //         idd.push(res.data[index].objectId)
  //       }
  //       this.setData({
  //         textList: this.data.textList.concat(res.data)
  //       })
  //     });
      
  //     // db.collection("qyzx_texts").where({
  //     //   _id: _.nin(idd),
  //     //   deleted: false
  //     // }).orderBy('due', 'desc').get().then(res => {
  //     //   console.log(res)
  //     //   for (var index in res.data) {
  //     //     idd.push(res.data[index]._id)
  //     //   }
  //     //   this.setData({
  //     //     textList: this.data.textList.concat(res.data)
  //     //   })
  //     // })
  //   }

  // },

  home: function() {
    wx.navigateTo({
      url: '/pages/first/first',
    })
  },

  pl: function() {
    wx.navigateTo({
      url: '/pages/home/mycomment/mycomment',
    })
  },

  aboutus: function() {
    wx.navigateTo({
      url: '/pages/aboutus/aboutus',
    })
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  fabu: function() {
    wx.navigateTo({
      url: '/pages/home/mysug/mysug',
    })
  },

  onReady: function(e) {

  },

  onShareAppMessage: function() {},

  onLoad: function() {
    idd = []
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },



  inputTyping: function(e) {
    //搜索数据
    getLike(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },

  //按时间排序
  shijian: function() {
    this.setData({
      shijian: true
    })

    const query = Bmob.Query('texts');

    query.equalTo("deleted", "==", false);
    query.order("-createdAt");
    query.find().then(res => {
      console.log(res)
      this.setData({
        textList: res
      })
      for (var index in res) {
        console.log("index:", res[index].objectId)
        idd[index] = res[index].objectId
      };
      console.log("ID数组为：", idd)
    });

    // const texts_collection = db.collection('qyzx_texts')
    //   texts_collection.orderBy('due', 'desc').where({
    //       deleted: false
    //     })
    //     .get().then(res => {
    //       this.setData({
    //         textList: res.data
    //       })
    //       for (var index in res.data) {
    //         console.log("index:", res.data[index]._id)
    //         idd[index] = res.data[index]._id
    //       };
    //       console.log("ID数组为：", idd)
    //     })
  },

  //按赞排序
  zanpai: function() {

    this.onShow();

  },

  onShow: function() {
    var i = 0;
    const query = Bmob.Query('texts');
    
    // const texts_collection = db.collection('qyzx_texts')
      
      query.equalTo("deleted", "==", false);
      query.order("-ding");
      query.find().then(res => {
        console.log(res)
        this.setData({
          textList: res
        })
        for (var index in res) {
          console.log("index:", res[index].objectId)
          idd[index] = res[index].objectId
        };
        console.log("ID数组为：", idd)
      });
    console.log("textList:", this.data.textList);


      // texts_collection.orderBy('ding', 'desc').where({
      //   deleted: false
      // }).get().then(res => {
      //   this.setData({
      //     textList: res.data
      //   })
      //   for (var index in res.data) {
      //     console.log("index:", res.data[index]._id)
      //     idd[index] = res.data[index]._id
      //   };
      //   console.log("ID数组为：", idd)
      // })
  }
})
