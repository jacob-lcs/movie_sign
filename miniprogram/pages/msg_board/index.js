//index.js
//获取应用实例

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
    classes: ['全部', '教学', '后勤', '课余', '其他'],
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
    //插入一条评论数据
    const comments_collection = db.collection('qyzx_texts');
    comments_collection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        due: new Date(),
        content: pinglun,
        commentator: app.globalData.userInfo.nickName,
        deleted: false,
        ding: 0
      },
      success: function(res) {
        console.log(res)
        $Toast({
          content: '友善发言的人运气不会太差。',
          type: 'success'
        });
      },
      fail: function(err) {
        console.log(err)
        $Toast({
          content: '提交失败,请检查网络',
          type: 'error'
        });
      }
    })

    const comments_collection2 = db.collection('qyzx_texts');
    comments_collection2.where({
        textID: this.data.textId
      }).orderBy('due', 'desc')
      .get().then(res => {
        console.log('按时间排序后：', res.data)
        this.setData({
          'commentList': res.data
        })
        console.log('commentList:', this.data.commentList)
      });
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

  onReachBottom: function() {
    console.log("onReachBottom函数运行！")
    const _ = db.command
    if (this.data.shijian == false) {
      db.collection("qyzx_texts").where({
        _id: _.nin(idd),
        deleted: false
      }).get().then(res => {
        console.log(res)
        for (var index in res.data) {
          idd.push(res.data[index]._id)
        }
        this.setData({
          textList: this.data.textList.concat(res.data)
        })
      })
    } else {
      db.collection("qyzx_texts").where({
        _id: _.nin(idd),
        deleted: false
      }).orderBy('due', 'desc').get().then(res => {
        console.log(res)
        for (var index in res.data) {
          idd.push(res.data[index]._id)
        }
        this.setData({
          textList: this.data.textList.concat(res.data)
        })
      })
    }

  },

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

  toggleLeft1() {
    this.setData({
      username: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl
    })
    this.setData({
      showLeft1: !this.data.showLeft1
    });
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

  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });

    //点击顶部分类栏，显示各分类下的帖子
    const texts_collection = app.globalData.db.collection('qyzx_texts')

    if (detail.key == "全部") {
      texts_collection.orderBy('ding', 'desc').where({
        deleted: false
      }).get().then(res => {
        this.setData({
          textList: res.data
        })
      })
    } else {
      texts_collection.where({
          classes: detail.key,
          deleted: false
        }).orderBy('ding', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    }
  },

  onReady: function(e) {

    if (app.globalData.userInfo != null) {
      this.setData({
        username: app.globalData.userInfo.nickName
      })
    }
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

    const texts_collection = db.collection('qyzx_texts')
    if (this.data.current_scroll == "全部") {
      texts_collection.orderBy('due', 'desc').where({
          deleted: false
        })
        .get().then(res => {
          this.setData({
            textList: res.data
          })
          for (var index in res.data) {
            console.log("index:", res.data[index]._id)
            idd[index] = res.data[index]._id
          };
          console.log("ID数组为：", idd)
        })
    } else {
      texts_collection.where({
          classes: this.data.current_scroll
        }).where({
          deleted: false
        }).orderBy('due', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
          for (var index in res.data) {
            console.log("index:", res.data[index]._id)
            idd[index] = res.data[index]._id
          };
          console.log("ID数组为：", idd)
        })
    }
  },

  //按赞排序
  zanpai: function() {

    this.onShow();

  },

  onShow: function() {
    var i = 0;

    const texts_collection = db.collection('qyzx_texts')

    if (this.data.current_scroll == "全部") {
      texts_collection.orderBy('ding', 'desc').where({
        deleted: false
      }).get().then(res => {
        this.setData({
          textList: res.data
        })
        for (var index in res.data) {
          console.log("index:", res.data[index]._id)
          idd[index] = res.data[index]._id
        };
        console.log("ID数组为：", idd)
      })

    } else {
      texts_collection.where({
          classes: this.data.current_scroll
        }).where({
          deleted: false
        }).orderBy('ding', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          });

          for (var index in res.data) {
            console.log("index:", res.data[index]._id)
            idd[index] = res.data[index]._id
          };
          console.log("ID数组为：", idd)
        })
    };
  }
})

function getLike(t, k) {
  var that = t;

  if (k == "")
    that.onShow();

  const MAX_LIMIT = 20

  db.collection('qyzx_texts').count().then(res => {
    // 计算需分几次取
    const batchTimes = Math.ceil(res.total / 20)
    var searchResult = []
    for (let i = 0; i < batchTimes; i++) {
      db.collection('qyzx_texts').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
        for (var index in res.data) {
          idd.push(res.data[index]._id)
        }
        for (let j = 0; j < res.data.length; j++) {
          if (res.data[j].content.indexOf(k) >= 0) {
            console.log(res.data[j].content)
            searchResult.push(res.data[j])
            that.setData({
              textList: null,
              textList: searchResult,
            })
          };
        }
      })
    }
    if (searchResult.length == 0)
      that.setData({
        textList: null
      })
    console.log("查询结果：", searchResult)
  })
}