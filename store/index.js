import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		hasOrganization:false,
		hasSupplierInfo:false,
		userInfo: {},
		organizationInfo:{},
		goods_info:{},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			if(provider.active_organization == ''){
				state.hasOrganization = false
			}else{
				state.hasOrganization = true
			}
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
			console.log(state.userInfo,'------------store-mutations-login');
		},
		setOrganizationInfo(state,provider){
			state.organizationInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'organizationInfo',  
			    data: provider  
			}) 
			console.log(state.organizationInfo,'------------store-mutations-setOrganizationInfo');
			
		},
		setGoods_info(state,provider){
			state.goods_info = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'goods_info',  
			    data: provider  
			}) 
			console.log(state.goods_info,'------------store-mutations-setGoods_info');
			
		},
		joinOrganization(state,provider){
			state.organizationInfo = provider;
			uni.setStorage({
			    key: 'organizationInfo',  
			    data: provider  
			}) 
			console.log(state.organizationInfo,'------------store-mutations-joinOrganization');
		},
		
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		}
	},
	actions: {
	
	}
})

export default store
