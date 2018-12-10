// miniprogram/pages/sign_up/index.js
const db = wx.cloud.database();
const app = getApp();
var photo = false
var name = '';
var sex = '';
var weight = '';
var political = '';
var height = '';
var birthday = '';
var marriage = '';
var id_card = '';
var school = '';
var profession = '';
var hobby = '';
var skill = '';
var experience = '';
var face = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sex: '',
    weight: '',
    political: '',
    height: '',
    birthday: '',
    marriage: '',
    id_card: '',
    school: '',
    profession: '',
    hobby: '',
    skill: '',
    experience: '',
    jianli: true
  },

  in_name: function(e) {
    this.setData({
      name: e.detail.detail.value
    })
    console.log(this.data.name)
  },

  in_sex: function(e) {
    this.setData({
      sex: e.detail.detail.value
    })
  },

  in_weight: function(e) {
    this.setData({
      weight: e.detail.detail.value
    })
  },

  in_political: function(e) {
    this.setData({
      political: e.detail.detail.value
    })
  },

  in_height: function(e) {
    this.setData({
      height: e.detail.detail.value
    })
  },

  in_birthday: function(e) {
    this.setData({
      birthday: e.detail.detail.value
    })
  },

  in_marriage: function(e) {
    this.setData({
      marriage: e.detail.detail.value
    })
  },

  in_id_card: function(e) {
    this.setData({
      id_card: e.detail.detail.value
    })
  },

  in_school: function(e) {
    this.setData({
      school: e.detail.detail.value
    })
  },

  in_profession: function(e) {
    this.setData({
      profession: e.detail.detail.value
    })
  },

  in_hobby: function(e) {
    this.setData({
      hobby: e.detail.detail.value
    })
  },

  in_skill: function(e) {
    this.setData({
      skill: e.detail.detail.value
    })
  },

  in_experience: function(e) {
    this.setData({
      experience: e.detail.detail.value
    })
  },


  doUpload: function() {
    var name = this.data.name;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = app.globalData.userInfo.openid + name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            wx.showToast({
              icon: 'none',
              title: '上传成功',
            })
            photo = true;
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  log_in: function() {

  },
  tijiao: function() {
    name = this.data.name;
    sex = this.data.sex;
    weight = this.data.weight;
    political = this.data.political;
    height = this.data.height;
    birthday = this.data.birthday;
    marriage = this.data.marriage;
    id_card = this.data.id_card;
    school = this.data.school;
    profession = this.data.profession;
    hobby = this.data.hobby;
    skill = this.data.skill;
    experience = this.data.experience;
    wx.showModal({
      title: '提示',
      content: '提交之后不可修改，是否提交',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.globalData.jianli = true

          if (photo == true) {
            db.collection('sign_up').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  name: name,
                  sex: sex,
                  weight: weight,
                  political: political,
                  height: height,
                  birthday: birthday,
                  marriage: marriage,
                  id_card: id_card,
                  school: school,
                  profession: profession,
                  hobby: hobby,
                  skill: skill,
                  experience: experience,
                  jianli: true,
                  image_url: ''
                }
              })
              .then(res => {
                console.log(res)

                wx.showModal({
                  title: '提示',
                  content: '提交成功！',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      db.collection('users').add({
                          // data 字段表示需新增的 JSON 数据
                          data: {
                            account: app.globalData.openid,
                            jianli: true
                          }
                        })
                        .then(res => {
                          console.log(res)
                        })
                      console.log("跳转界面")
                      wx.redirectTo({
                        url: '/pages/sign_up/index',
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      wx.redirectTo({
                        url: '/pages/sign_up/index',
                      })
                    }
                  }
                })
              })
          } else {
            wx.showModal({
              title: '提示',
              content: '请先上传您的照片',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    console.log("app.globalData.userInfo.openId", app.globalData.userInfo.openid)
    db.collection('sign_up').where({
      _openid: app.globalData.userInfo.openid
    }).get().then(res => {
      console.log(res.data)
      if (res.data[0].jianli == true) {
        app.globalData.jianli = true
      }
      face = 'cloud://movie-cf8bc1.6d6f-movie-cf8bc1/' + app.globalData.userInfo.openid + res.data[0].name + '.png'
      console.log("face:", face)
      wx.cloud.downloadFile({
        fileID: face, // 文件 ID
        success: res => {
          // 返回临时文件路径
          console.log(res.tempFilePath)
          this.setData({
            image_url: res.tempFilePath
          })
        },
        fail: console.error

      })
      console.log("this.data.image_url:", this.data.image_url)
      if (this.data.image_url == null) {
        console.log("下载图片函数运行")
        face = 'cloud://movie-cf8bc1.6d6f-movie-cf8bc1/' + app.globalData.userInfo.openid + res.data[0].name + '.jpg'
        wx.cloud.downloadFile({
          fileID: face, // 文件 ID
          success: res => {
            // 返回临时文件路径
            console.log(res.tempFilePath)
            this.setData({
              image_url: res.tempFilePath
            })
          },
          fail: console.error
        })

      }
      this.setData({
        jianli: !app.globalData.jianli,
        name: res.data[0].name,
        sex: res.data[0].sex,
        weight: res.data[0].weight,
        political: res.data[0].political,
        height: res.data[0].height,
        birthday: res.data[0].birthday,
        marriage: res.data[0].marriage,
        id_card: res.data[0].id_card,
        school: res.data[0].school,
        profession: res.data[0].profession,
        hobby: res.data[0].hobby,
        skill: res.data[0].skill,
        experience: res.data[0].experience,
      })
      console.log("jianli的值为：", this.data.jianli)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

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

  }
})