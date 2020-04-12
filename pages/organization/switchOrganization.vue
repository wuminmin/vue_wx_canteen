<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<!-- <view class="right-top-sign"></view> -->
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="welcome">
				根据组织名称或统代码查询！
			</view>
			<uni-search-bar @confirm="search" @input="input" @cancel="cancel" />
			<block v-for="(item, index) in organization_list" :key="index">
				<uni-list>
					<uni-list-item :show-arrow="false">{{item.d.organization_name}}</uni-list-item>
					<uni-list-item :show-arrow="false">统一代码：{{item.d.certificate_for_uniform_social_credit_code}}</uni-list-item>
					<uni-list-item :show-arrow="false">地址：{{item.d.organization_address}}</uni-list-item>
					<button class="confirm-btn" :disabled="toJoinIng" @click="toJoin(item)">申请加入</button>
				</uni-list>
			</block>
		</view>
		<view class="register-section">
			还没有公司或者组织?
			<button class=".sms-btn" @click="toCreate">马上创建一个！</button>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniNumberBox from '@/components/uni-number-box.vue'
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'
	export default {
		components: {
			uniList,
			uniListItem,
			uniNumberBox,
			uniSearchBar,
			uniSection
		},
		data() {
			return {
				searchVal: '',
				mobile: '',
				password: '',
				toJoinIng: false,
				send_sms_ing: false,
				organization_name: '',
				organization_list: [],
			}
		},
		onLoad() {
			let myUrl = 'wx_get_organizationInfo_list'
			let token = this.userInfo.token
			let sendData = {active_organization:this.userInfo.active_organization}
			let res = this.$api.myUniRequest(myUrl,token,sendData)
			console.log(res)
			organization_list = res.data.organization_list
		},
		computed: {
			...mapState(['hasLogin', 'hasOrganization', 'userInfo', 'organizationInfo'])
		},
		methods: {
			...mapMutations(['login', 'joinOrganization']),
			
			toJoin:function (item) {
				console.log(item)
				// this.joinOrganization(item);
				uni.navigateTo({
					url: '/pages/public/joinDepartment'
				})
			},
			toCreate() {
				uni.navigateTo({
					url: '/pages/public/createOrganization'
				})
			},
			search(res) {
				uni.showToast({
					title: '搜索：' + res.value,
					icon: 'none'
				})
				let self = this;
				let sendData = {
					'searchVal': res.value
				}
				uni.request({
					url: self.$global_dict.wx_url + 'wx_search_organization',
					data: {
						token: self.$store.state.userInfo.token,
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
							self.organization_list = res.data.data.organization_list
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

			},
			input(res) {
				this.searchVal = res.value
			},
			cancel(res) {
				uni.showToast({
					title: '点击取消，输入值为：' + res.value,
					icon: 'none'
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
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 60px;
		/* position: relative; */
		width: 100%;
		height: 100%;
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
		font-size: $font-sm+2upx;
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


	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('~@/static/uni.ttf') format('truetype');
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}


	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #007AFF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}


	.search-result {
		margin-top: 10px;
		margin-bottom: 20px;
		text-align: center;
	}

	.search-result-text {
		text-align: center;
		font-size: 14px;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 0px;
	}


	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
