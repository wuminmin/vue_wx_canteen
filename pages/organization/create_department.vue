<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="welcome">
				创建部门！
			</view>
			<view class="input-content">
				部门名称：
				<view class="input-item">
					<input v-model="organization_department_name"/>
				</view>
			</view>
			<view class="input-content">
				部门地址：
				<view class="input-item">
					<input v-model="organization_department_address"/>
				</view>
			</view>
			<view class="input-content">
				管理员姓名：
				<view class="input-item">
					<input v-model="organization_department_manage_person_name"/>
				</view>
			</view>
			<view class="input-content">
				管理员手机：
				<view class="input-item">
					<input v-model="organization_department_manage_person_mobile"/>
				</view>
			</view>
			<button class="confirm-btn" :disabled="toJoinIng" @click="toJoin(item)">创建</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	var graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				organization_department_name:'',
				organization_department_address:'',
				organization_department_manage_person_name:'',
				organization_department_manage_person_mobile:'',
			}
		},
		onLoad() {
		},
		computed: {
			...mapState(['hasLogin', 'user_info','organization_info'])
		},
		methods: {
			...mapMutations(['set_user_info','set_organization_department_info_list']),
			toJoin:function (){
				let sendData = {
					organization_main_id:this.organization_info.organization_main_id,
					organization_department_name:this.organization_department_name,
					organization_department_address:this.organization_department_address,
					organization_department_manage_person_name:this.organization_department_manage_person_name,
					organization_department_manage_person_mobile:this.organization_department_manage_person_mobile,
				}
				let myUrl = 'wx_create_organization_department'
				let token = this.user_info.token
				this.$api.myUniRequest({url:myUrl,data:{token:token,sendData:sendData}}).then(res => {
					if (res.data.status == 1) {
						this.set_organization_department_info_list(res.data.data.organization_department_info_list)
						this.$api.msg_success(res.msg)
					} else {
						this.$api.msg_fail(res.msg)
					}
				})
			},
			navBack() {
				uni.navigateBack();
			},
		},
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.uni-form-item .title {
		padding: 20rpx 0;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: auto;
		/* overflow: hidden; */
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	} 

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	} 

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.sms-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-success;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	/* .register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	} */
</style>
