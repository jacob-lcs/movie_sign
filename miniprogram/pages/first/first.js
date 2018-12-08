// pages/first/first.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    textList: [],
    listNum: 0,
    showLeft1: false,
    x: app.globalData.windowWidth * 0.8 * 0.3,
    y: 30,
    userinfo: null,
    background: ['demo-text-1', 'demo-text-2'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  baoming:function(){
    wx.navigateTo({
      url: '/pages/sign_up/index',
    })
  },

  vote:function(){
    wx.navigateTo({
      url: '/pages/vote/vote',
    })
  },

  msg_board:function(){
    wx.navigateTo({
      url: '/pages/vote/vote',
    })
  },

  about_movie:function(){
    wx.navigateTo({
      url: '/pages/notice/index',
    })
  },  

  setDisabled: function(e) {
    this.setData({
      disabled: !this.data.disabled
    })
  },
  setPlain: function(e) {
    this.setData({
      plain: !this.data.plain
    })
  },
  setLoading: function(e) {
    this.setData({
      loading: !this.data.loading
    })
  },

  pl: function() {
    wx.navigateTo({
      url: '/pages/home/mycomment/mycomment',
    })
  },

  contact:function(){
    wx.navigateTo({
      url: '/pages/contact/index',
    })
  },

  fabu: function() {
    wx.navigateTo({
      url: '/pages/home/mysug/mysug',
    })
  },

  onChange: function(e) {
    console.log(e.detail)
    this.setData({
      x: app.globalData.windowWidth * 0.8 * 0.3,
      y: 30
    })
  },

  to_aboutus: function() {
    wx.navigateTo({
      url: '/pages/aboutus/aboutus',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.userInfo = res.result
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    if (app.globalData.userInfo) {
      this.setData({
        username: app.globalData.userInfo.nickName
      })
    }
  },

  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
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

  },
})