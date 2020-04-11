<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">回到首页></navigator>
			</view>
			<view v-else class="empty-tips">
				还没登陆
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			
			<!-- 列表 -->
			<view class="cart-list">
				
				<text class="welcome">根据组织名称或统一代码查询！</text>
				<uni-search-bar  @confirm="search" @input="input" @cancel="cancel" />
				<block v-for="(item, index) in organization_list" :key="item.id">
				<uni-list>
					<uni-list-item :show-arrow="false" >{{item.d.organization_name}}</uni-list-item>
					<uni-list-item  :show-arrow="false" >统一代码：{{item.d.certificate_for_Uniform_Social_Credit_Code}}</uni-list-item>
					<uni-list-item  :show-arrow="false" >地址：{{item.d.organization_address}}</uni-list-item>
					<button class="confirm-btn"  v-bind:data="item" @click="toJoin(data, index)" :disabled="toJoinIng">申请加入</button>
				</uni-list>
				</block>
				
				<!-- <block v-for="(item, index) in cartList" :key="item.id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.image" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.title}}</text>
							<text class="attr">{{item.attr_val}}</text>
							<text class="price">¥{{item.price}}</text>
							<uni-number-box 
								class="step"
								:min="1" 
								:max="item.stock"
								:value="item.number>item.stock?item.stock:item.number"
								:isMax="item.number>=item.stock?true:false"
								:isMin="item.number===1"
								:index="index"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			 -->
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<!-- <view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view> -->
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<text class="coupon">
						还没有公司或者组织?
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="toCreate">马上创建一个！</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapMutations
	} from 'vuex';
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
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				searchVal: '',
				mobile: '',
				password: '',
				toJoinIng: false,
				send_sms_ing: false,
				organization_name:'',
				organization_list:[],
			};
		},
		onLoad(){
			// this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			// ...mapState(['hasLogin'])
			...mapState(['hasLogin','hasOrganization','userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			toJoin(key, index){
				console.log(key, index)
			},
			toCreate(e){
				console.log(e)
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
					url: self.$global_dict.wx_url + 'search_organization',
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
			},
			//请求数据
			async loadData(){
				let list = await this.$api.json('cartList'); 
				let cartList = list.map(item=>{
					item.checked = true;
					return item;
				});
				this.cartList = cartList;
				this.calcTotal();  //计算总价
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data){
				this.cartList[data.index].number = data.number;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index){
				let list = this.cartList;
				let row = list[index];
				let id = row.id;

				this.cartList.splice(index, 1);
				this.calcTotal();
				uni.hideLoading();
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							this.cartList = [];
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += item.price * item.number;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder(){
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item=>{
					if(item.checked){
						goodsData.push({
							attr_val: item.attr_val,
							number: item.number
						})
					}
				})

				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify({
						goodsData: goodsData
					})}`
				})
				this.$api.msg('跳转下一页 sendData');
			}
		}
	}
</script>

<style lang='scss'>
	
	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	
	.welcome {
		position: relative;
		left: 50upx;
		top: 90upx;
		font-size: $font-sm+2upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}
	
	.welcome {
		position: relative;
		left: 50upx;
		top: 140upx;
		font-size: $font-sm+2upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
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
	
	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	
	
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
