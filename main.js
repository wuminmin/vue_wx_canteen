import Vue from 'vue'
import store from './store'
import App from './App'

import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const app_id = 'wx2203267d98fed645'

const wx_url = 'https://wx.wuminmin.top/canteen_alliance/'

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const msg_success = (title, duration = 1500, mask = false, icon = 'success') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const msg_fail = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const myUniRequest = (options) => {
	const {
		url,
		method,
		data,
		header
	} = options
	uni.showLoading({ //加载loading开始
		title: '加载中'
	});
	console.log(options, '--------------myUniRequest 入参')
	return new Promise((resolve, reject) => {
		uni.request({
			// url: 'https://wx.wuminmin.top/canteen_alliance/' + url,
			url: 'http://127.0.0.1:80/canteen_alliance/' + url,
			data: data || {},
			method: method || 'GET',
			header: header || {},
			timeout: 10000, // 请求超时时间设置
			success: (res) => {
				console.log(res, '--------------myUniRequest 出参')
				if (res.data.status == 1) {
					uni.showToast({
						title: res.data.msg,
						icon: 'success',
						mask: true,
						duration: 2000
					});
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						mask: true,
						duration: 2000
					});
				}
				resolve(res)
			},
			fail: (err) => {
				console.log(res, '--------------myUniRequest 异常')
				uni.showToast({
					title: '未知故障',
					icon: 'none',
					mask: true,
					duration: 2000
				});
				reject(err)
			},
			complete: () => {
				uni.hideLoading() // 请求成功后让加载loading消失
			}
		})
	})
}

// const my_login = (options) => {
// 	const self = this;
// 	uni.login({
// 		success: function(res) {
// 			if (res.code) {
// 				let myUrl = 'wx_login'
// 				let token = ''
// 				// let app_id = self.$global_dict.app_id
// 				let code = res.code
// 				const sendData = {
// 					app_id,
// 					code
// 				}
// 				myUniRequest({
// 					url: myUrl,
// 					data: {
// 						token: token,
// 						sendData: sendData
// 					}
// 				}).then(res => {
// 					if (res.data.status == 1) {
// 						self.set_user_info(res.data.data.user_info)
// 						self.set_organization_info(res.data.data.organization_info)
// 						self.set_supplier_info(res.data.data.supplier_info)
// 						self.set_supplier_department_info(res.data.data.supplier_department_info)
// 						self.set_supplier_department_info_list(res.data.data.supplier_department_info_list)
// 						self.set_organization_department_info_list(res.data.data.organization_department_info_list)
// 						self.loadData();
// 					} else {
// 						self.$api.msg_fail(res.msg)
// 					}
// 				})
// 			}
// 		},
// 	})
// }


/**
 * 统一跳转接口,拦截未登录路由
 * navigator标签现在默认没有转场动画，所以用view
 */

Vue.config.productionTip = false
Vue.prototype.$global_dict = {
	app_id: app_id,
	wx_url: wx_url
}
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	msg_success,
	msg_fail,
	json,
	prePage,
	myUniRequest,
	// my_login
};

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
