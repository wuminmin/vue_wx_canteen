<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">注册！</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">昵称</text>
					<input v-model="nickname" />
				</view>
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">短信验证码</text>
					<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password data-key="password" @input="inputChange" @confirm="toLogin" />
				</view>
			</view>
			<button class="sms-btn" @click="send_sms" :disabled="send_sms_ing">发送验证码</button>
			<button class="confirm-btn" @click="toLogin" >注册</button>
		</view>
		<!-- <view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view> -->
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				mobile: '',
				password: '',
				logining: false,
				send_sms_ing: false,
				nickname:'',
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			send_sms(e) {
				console.log(e);
				let self = this;
				let sendData = {
					'mobile': self.mobile
				}
				uni.login({
					success: function(res) {
						if (res.code) {
							console.log(res)
							self.send_sms_ing = true;
							uni.request({
								url: self.$global_dict.wx_url + 'wx_send_sms',
								data: {
									app_id: self.$global_dict.app_id,
									code: res.code,
									sendData: sendData,
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									console.log(res);
									if (res.data.status == 2) {
										uni.showToast({
											title: res.data.msg,
											icon: 'fail',
											mask: true,
											duration: 2000
										});
									} else if (res.data.status == 1) {
										uni.showToast({
											title: res.data.msg,
											icon: 'success',
											mask: true,
											duration: 2000
										});
									} else {
										console.log(res);
										uni.showToast({
											title: res.data.msg,
											icon: 'fail',
											mask: true,
											duration: 2000
										});
									}
									setTimeout(() => {
										self.send_sms_ing = false;
									}, 15000);

								},
								fail: (err) => {
									console.log('request fail', err);
									uni.showModal({
										content: err.errMsg,
										showCancel: false
									});
								}
							});
						}
					},
				})
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toRegist() {
				this.$api.msg('去注册');
			},
			async toLogin() {
				this.logining = true;
				const {
					nickname,
					mobile,
					password
				} = this;
				/* 数据验证模块
				if(!this.$api.match({
					mobile,
					password
				})){
					this.logining = false;
					return;
				}
				*/
				const sendData = {
					nickname,
					mobile,
					password
				};
				const self = this;
				uni.login({
					success: function(res) {
						if (res.code) {
							console.log(res)
							self.loading = true;
							uni.request({
								url: self.$global_dict.wx_url + 'wx_register',
								data: {
									app_id: self.$global_dict.app_id,
									code: res.code,
									sendData: sendData,
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									console.log(res);
									if (res.data.status == 2) {
										self.$api.msg(res.msg);
										self.logining = false;
										uni.showToast({
											title: res.data.msg,
											icon: 'fail',
											mask: true,
											duration: 2000
										});
									} else if (res.data.status == 1) {
										self.login(res.data.data);
										uni.navigateBack();
									} else {
										console.log(res);
									}
									self.loading = false;
								},
								fail: (err) => {
									console.log('request fail', err);
									uni.showModal({
										content: err.errMsg,
										showCancel: false
									});
									self.loading = false;
								}
							});
						}
					},
				})

				// const result = await this.$api.json('userInfo');
				// console.log(result);
				// if(result.status === 1){
				// 	this.login(result.data);
				//                 uni.navigateBack();  
				// }else{
				// 	this.$api.msg(result.msg);
				// 	this.logining = false;
				// }
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
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

	.register-section {
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
	}
</style>
