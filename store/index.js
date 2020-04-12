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
			console.log(provider.active_organization,'-----------------provider.active_organization')
			if(provider.active_organization == ''){
				console.log('--------------state.hasOrganization = false')
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
		joinOrganization(state,provider){
			// state.hasOrganization = true;
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
