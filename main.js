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
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const myUniRequest = (myUrl,token,sendData) =>{
	let self = this;
	uni.request({
		url:self.$global_dict.wx_url+myUrl,
		data:{
			token : token ,
			sendData : sendData
		},
		success:function(res){
			console.log(res)
			if(res.status == 1){
				uni.showToast({
					title: res.data.msg,
					icon: 'success',
					mask: true,
					duration: 3000
				});
			}else{
				uni.showToast({
					title: res.data.msg,
					icon: 'none',
					mask: true,
					duration: 3000
				});
			}
			return res.data
		},
		fail: (err) => {
			console.log(err)
			return err
		}
	})
}

Vue.config.productionTip = false
Vue.prototype.$global_dict = {
	app_id:'wx32c0a3c1a3bfa81d',
	wx_url:'https://wx.wuminmin.top/canteen_alliance/'
}
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage ,myUniRequest};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()