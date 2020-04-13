<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="welcome">
				创建供应商！
			</view>
			<view class="input-content">
				统一代码：
				<view class="input-item">
					<input v-model="certificate_for_uniform_social_credit_code"/>
				</view>
			</view>
			<view class="input-content">
				供应商名称：
				<view class="input-item">
					<input v-model="supplier_name"/>
				</view>
			</view>
			<view class="input-content">
				地址：
				<view class="input-item">
					<input v-model="supplier_address"/>
				</view>
			</view>
			<view class="input-content">
				法人姓名：
				<view class="input-item">
					<input v-model="legal_person_name"/>
				</view>
			</view>
			<view class="input-content">
				法人手机：
				<view class="input-item">
					<input v-model="legal_person_mobile"/>
				</view>
			</view>
			<view class="input-content">
				管理员姓名：
				<view class="input-item">
					<input v-model="manage_person_name"/>
				</view>
			</view>
			<view class="input-content">
				管理员手机：
				<view class="input-item">
					<input v-model="manage_person_mobile"/>
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
				supplier_main_id:'',
				certificate_for_uniform_social_credit_code:'',
				supplier_name:'',
				supplier_address:'',
				legal_person_name:'',
				legal_person_mobile:'',
				manage_person_name:'',
				manage_person_mobile:'',
			}
		},
		onLoad() {
		},
		computed: {
			...mapState(['hasLogin', 'user_info'])
		},
		methods: {
			...mapMutations(['set_user_info']),
			toJoin:function (){
				let self = this
				let sendData = {
					supplier_main_id:self.supplier_main_id,
					certificate_for_uniform_social_credit_code:self.certificate_for_uniform_social_credit_code,
					supplier_name:self.supplier_name,
					supplier_address:self.supplier_address,
					legal_person_name:self.legal_person_name,
					legal_person_mobile:self.legal_person_mobile,
					manage_person_name:self.manage_person_name,
					manage_person_mobile:self.manage_person_mobile,
				}
				uni.request({
					url:self.$global_dict.wx_url+'wx_create_supplier',
					data:{
						token : self.$store.state.user_info.token ,
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
					},
					fail: (err) => {
						console.log(err)
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
