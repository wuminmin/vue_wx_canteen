
// index.js
export default function myRequest (options) {
  const { url, method, data, header } = options
  uni.showLoading({  //加载loading开始
      title: '加载中'
  });
  console.log(options,'--------------export default function myRequest')
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://wx.wuminmin.top/canteen_alliance/' + url,
      data: data || {},
      method: method || 'GET',
      header: header || {},
      timeout: 6000, // 请求超时时间设置
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading() // 请求成功后让加载loading消失
      }
    })
  })
}
