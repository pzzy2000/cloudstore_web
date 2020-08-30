<template>
	<view class="container">
		<nav-bar>购物车</nav-bar>
		<!-- 空白页 -->
		<view v-if="cartList.length">
			<view class="tui-list-item">
				<view class="cart-list-top">
					<image 
						class='top-img'
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<image src="/static/client/cart-logo.png" mode="" class="top-logo"></image>
					<view class="top-delete" @click="check('all')" v-if="!allChecked">
						全选
					</view>
					<view class="top-delete" :class="{show: allChecked}" @click="clearCart" v-else>
						删除
					</view>
				</view>
				<view class="cart-list">
					<block v-for="(item, index) in cartList" :key="item.goodsSkuId">
						<view class="cartList-item">
							<tui-swipe-action :actions="actions" @click="deleteCartItem(index)">
								<template v-slot:content>
									<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
										<view class="image-wrapper">
											<image :src="item.image[0].url" 
												:class="[item.loaded]"
												mode="aspectFill" 
												lazy-load 
												@load="onImageLoad('cartList', index)" 
												@error="onImageError('cartList', index)"></image>
											<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
										</view>
										<view class="item-right">
											<text class="clamp title">{{item.title}}</text>
											<text class="attr clamp">{{item.subTitle}}</text>
											<view class="price-detail">
												<text class="price price-symbol">{{item.price}}</text>
												<text class="sku">/{{item.attr_val}}</text>
											</view>
											<uni-number-box 
												v-if="isNumber"
												class="number"
												:min="1"
												:max="item.stock"
												:value="item.number>item.stock?item.stock:item.number"
												:isMax="item.number>=item.stock?true:false"
												:isMin="item.number===1"
												:index="index"
												@eventChange="numberChange"
											></uni-number-box>
										</view>
										<!-- <text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text> -->
									</view>
								</template>
							</tui-swipe-action>
						</view>
					</block>
				</view>
			</view>
			<view class="action-section">
				<view class="checkbox" @click="check('all')">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
					></image>
					<text class="all-select">全选</text>
				</view>
				<view class="total-box">
					<text class="price-text">总价:</text>
					<text class="price">¥{{total}}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">结算({{checkNum}})</button>
			</view>
		</view>
		<view class="empty" v-if="isCartList">
			<view class="empty-tips">
				<view class="cart-empty">
					<image src="/static/client/cart-icon.png" mode="" class="cart-empty-img"></image>
					<text class="cart-empty-text">购物车还是空的</text>
				</view>
				<button type="default" class="cart-empty-btn" @click="toCategory">购物车还是空的哦</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	import uniNumberBox from '@/components/uni-number-box.vue'
	import tuiSwipeAction from '@/components/tui-swipe-action/tui-swipe-action.vue'
	export default {
		components: {
			uniNumberBox, navBar, tuiSwipeAction
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				cartList: [],
				actions: [
					{
						name: '删除',
						color: '#fff',
						fontsize: 30, //单位rpx
						width: 70, //单位px
						background: '#FD3B31'
					}
				],
				checkNum: 0,
				isCartList: false,
				isNumber: false
			};
		},
		onLoad() {
			// this.getCartList();
		},
		onShow(){
			this.cartList.length = 0
			this.getCartList();
			this.isNumber= false
		},
		onPullDownRefresh() { //下拉刷新
			this.cartList.length = 0
			this.getCartList();
		},
		computed:{
		},
		methods: {
			async getCartList(){ //获取购物车列表数据
				this.cartList.length = 0
				let params = {
					pageSize: 10,
					pageNum: 1
				}
				let data = await Api.apiCall('post', Api.client.cart.myShopCar, params, true)
				if (data) {
					uni.stopPullDownRefresh();
					var tmpData = data.result.records
					if (tmpData.length != 0) {
						for (let tmp in tmpData) {
							try{
								this.cartList.push({
									id: tmpData[tmp].id,
									checked: false,
									number: 1,
									image: (tmpData[tmp].goodsSkuBean.photos!=null && tmpData[tmp].goodsSkuBean.photos.length>0) ? tmpData[tmp].goodsSkuBean.photos: tmpData[tmp].goodsPicesBean.goodsPhotos,
									title: tmpData[tmp].goodsPicesBean.goodsName,
									subTitle: tmpData[tmp].goodsPicesBean.goodsSubtitle,
									attr_val: tmpData[tmp].goodsSkuBean.skuValue,
									price: tmpData[tmp].goodsSkuBean.price,
									stock: tmpData[tmp].goodsSkuBean.stock,
									goodsSkuId: tmpData[tmp].goodsSkuId
								})
							}catch(e){
								console.log(e)
								continue;
							}
						}
						this.isNumber = true
						this.calcTotal();  //计算总价
					} else {
						this.isCartList = true
					}
				}
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			toCategory(){
				uni.switchTab({
					url: '/pages/agent/goods/hotsale/hotsale'
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
			async deleteCartItem(index){
				let id = this.cartList[index].id;
				this.cartList.splice(index, 1);
				let params = {
					idss: id
				}
				let data = await Api.apiCall('post', Api.client.cart.deleteShopCar, params, true)
				if (data) {
					if (data.code === 0) {
						this.$api.msg('删除成功')
					} else {
						this.$api.msg(data.msg)
					}
				}
				this.calcTotal();
				// uni.hideLoading();
			},
			//清空
			clearCart(){
				var that = this
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							that.clearMore()
						}
					}
				})
			},
			//批量删除购物车
			async clearMore() {
				var ids = [];
				for (let tmp in this.cartList) {
					ids.push(this.cartList[tmp].id)
				}
				let params = {
					idss: ids.join(',')
				}
				var data = await Api.apiCall('post', Api.client.cart.deleteShopCar, params, true)
				if (data) {
					if (data.code === 0) {
						this.$api.msg('删除成功')
						this.cartList = []
						this.calcTotal()
					} else {
						this.$api.msg(data.msg)
					}
				}
				this.calcTotal();  //计算总价
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
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
				var checkNums = []
				for (let tmp in  this.cartList) {
					if (this.cartList[tmp].checked) {
						checkNums.push(this.cartList[tmp].id)
					}
				}
				this.checkNum = checkNums.length
				this.isCartList =  this.cartList.length ? false : true
			},
			createOrder(){ //跳转到支付界面
				var ids = [],checkList = []
				for (let tmp in  this.cartList) {
					if (this.cartList[tmp].checked) {
						ids.push(this.cartList[tmp].id)
						checkList.push({
							goodsSkuId: this.cartList[tmp].goodsSkuId,
							number: this.cartList[tmp].number,
						})
					}
				}
				var id = ids.join(',')
				if (id) {
					uni.navigateTo({
						url: '/pages/client/goods/buy?cartId='+id+'&checkList='+JSON.stringify(checkList),
					});
				} else {
					this.$api.msg('您还未选择需要购买商品')
				}
			},
			handlerButton(e) {
				let index = e.index;
				let item = e.item;
				let menuTxt = ['删除', '修改', '收藏'][index];
				this.tui.toast('您点击了【' + menuTxt + '】按钮');
			},
		}
	}
</script>

<style lang='scss' scoped>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				margin: 0 auto;
				display: flex;
				flex-wrap: wrap;
				.cart-empty {
					width: 100%;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.cart-empty-img {
						width: 290upx;
						height: 240upx;
					}
					.cart-empty-text {
						width: 100%;
						text-align: center;
						color: #999999;
						font-size: 28upx;
						margin-top: 30upx;
					}
				}
				.cart-empty-btn {
					background-color: #39A9FF;
					border-radius: 36upx;
					font-size: 32upx;
					text-align: center;
					height: 72upx;
					line-height: 72upx;
					width: 392upx;
					color: #fff;
					letter-spacing: 5upx;
					margin-top: 60upx;
				}
			}
		}
	}
	.tui-list-item {
		margin: 20upx 20upx 0;
		position: relative;
		.cart-list-top {
			width: 100%;
			background-color: #fff;
			height: 80upx;
			line-height: 80upx;
			display: flex;
			border-top-right-radius: 15upx;
			border-top-left-radius: 15upx;
			justify-content: space-between;
			padding: 0 40upx 0 80upx;
			align-items: center;
			border-bottom: 1upx solid #eee;
			.top-img {
				height: 32upx;
				width: 32upx;
				position: absolute;
				left: 26upx;
				top: 45upx;
				margin-top: -25upx;
			}
			.top-logo {
				height: 35upx;
				width: 140upx;
			}
			.top-delete {
				
			}
		}
	}
	/* 购物车列表项 */
	.cartList-item {
	}
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx 30upx 80upx;
		.image-wrapper{
			width: 128upx;
			height: 128upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-60upx;
			top: 50upx;
			z-index: 8;
			font-size: 38upx;
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
			.title{
				color: #333333;
				font-size: 32upx;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: 24upx;
				color: #999999;
				height: 50upx;
				line-height: 50upx;
			}
			.price-detail{
				height: 50upx;
				line-height:50upx;
				color: #FF1313;
				.price {
					color: #FF1313;
					font-size: 32upx;
					margin-left: 8upx;
				}
				.sku {
					color: #999999;
					font-size: 24upx;
					letter-spacing: 5upx;
				}
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	.cart-list:nth-last-child(1) {
		border-top-right-radius: 15upx;
		border-top-left-radius: 15upx;
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		/* margin-bottom:100upx; */
		/* #endif */
		position:fixed;
		left: 0;
		bottom:0;
		z-index: 95;
		display: flex;
		align-items: center;
		width:100%;
		height: 100upx;
		padding: 0 40rpx 0 80rpx;
		background-color: #fff;
		box-shadow: 2rpx 2rpx 5rpx 1rpx rgba(0, 0, 0, 0.3);
		.checkbox{
			height:36upx;
			/* position:relative; */
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.all-select {
				position: absolute;
			}
			image{
				width: 36upx;
				height: 100%;
				left: -40upx;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: -26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height:100%;
			line-height: 40upx;
			padding-left: 20upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 90upx;
			}
		}
		.total-box{
			flex: 1;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: 32upx;
				color: #FF1313;
			}
			.price-text {
				color: #000000;
				font-size: 32upx;
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
			margin: 0;
			border-radius: 36upx;
			width: 176upx;
			height: 74upx;
			height: 74upx;
			text-align: center;
			font-size: 28upx;
			background: #39A9FF;
			color: #FFFFFF;
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: #39A9FF;
	}
	.number {
		height: 40upx;
		width: 132upx;
		font-size: 20uxp;
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>