import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		hasOrganization:false,
		userInfo: {},
		organizationInfo:{},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
			console.log(state.userInfo,'------------store-mutations-login');
		},
		getOrganization(state,provider){
			state.hasOrganization = provider.hasOrganization;
			state.organizationInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'organizationInfo',  
			    data: provider  
			}) 
			console.log(state.organizationInfo,'------------store-mutations-organizationInfo');
		},
		joinOrganization(state,provider){
			state.hasOrganization = true;
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
