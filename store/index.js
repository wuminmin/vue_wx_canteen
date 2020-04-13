import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user_info: {
			has:false
		},
		organization_info:{
			has:false
		},
		goods_info:{
			has:false
		},
		supplier_info:{
			has:false
		},
		supplier_department_info:{
			has:false
		},
		supplier_department_info_list:{
			has:false,d:[],
		},
	},
	mutations: {
		set_user_info(state, provider) {
			state.hasLogin = true;
			state.user_info = provider;
			if(provider.active_organization == ''){
				state.hasOrganization = false
			}else{
				state.hasOrganization = true
			}
			uni.setStorage({//缓存用户登陆状态
			    key: 'user_info',  
			    data: provider  
			}) 
			console.log(state.user_info,'------------store-mutations-set_user_info');
		},
		set_organization_info(state,provider){
			state.organization_info = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'organization_info',  
			    data: provider  
			}) 
			console.log(state.organization_info,'------------store-mutations-set_organization_info');
			
		},
		set_supplier_info(state,provider){
			state.supplier_info = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'supplier_info',  
			    data: provider  
			}) 
			console.log(state.supplier_info,'------------store-mutations-set_supplier_info');
			
		},
		set_supplier_department_info(state,provider){
			state.supplier_department_info = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'supplier_department_info',  
			    data: provider  
			}) 
			console.log(state.supplier_department_info,'------------store-mutations-set_supplier_department_info');
			
		},
		set_supplier_department_info_list(state,provider){
			state.supplier_department_info_list = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'supplier_department_info_list',  
			    data: provider  
			}) 
			console.log(state.supplier_department_info_list,'------------store-mutations-set_supplier_department_info_list');
			
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
