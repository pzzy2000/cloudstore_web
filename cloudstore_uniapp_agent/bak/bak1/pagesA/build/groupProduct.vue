<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in small" :key="index">
					<view class="image-wrapper"><image :src="item" class="loaded" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{ goods.name }}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{ goods.price }}</text>
				<text class="m-price">¥{{ goods.originalPrice }}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{ goods.sale }}</text>
				<text>库存: {{ goods.stock }}</text>
				<text>浏览量: {{ goods.hit }}</text>
			</view>
		</view>

		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b" v-if="skuList && skuList.length > 0" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>


			<view class="eva-section">
				<view class="e-header" v-for="(item, index) in groupMemberList" :key="index">
					<img v-for="(item1, index1) in item.list" :key="index1" :src="item1.pic" class="logo" alt="" />
					<div class="time"  v-if="item.list.length>0">倒计时：{{ item.djs }}</div>
					<button type="primary" v-if="item.list.length>0 && item.status==1" class=" action-btn no-border add-cart-btn" @click="acceptGroup(item)">参与拼团</button>
					<div class="time"  v-if="item.list.length>0 && item.status==2">已成团</div>
				</view>
			</view>
			<view class="c-row b-b" v-if="serviceList && serviceList.length > 0">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text v-for="(item1, index1) in serviceList" :key="index1">{{ item1 }}</text>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{ consultCount.all }})</text>
				<text class="tit">好评</text>
				<text>({{ consultCount.goods }})</text>

				<text class="tit">一般</text>
				<text>({{ consultCount.general }})</text>

				<text class="tit">差评</text>
				<text>({{ consultCount.bad }})</text>
				<text class="tip" v-if="consultCount.persent != 200">好评率 {{ consultCount.persent }}%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box" v-for="(item, index) in consultList" :key="item.id">
				<image :src="item.pic" class="portrait" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{ item.memberName }}</text>
					<text class="con">{{ item.consultContent }}</text>
					<view class="bot">
						<text class="attr">购买类型：{{ item.attr }}</text>
						<text class="time">{{ item.consultAddtime | formatCreateTime}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header"><text>图文详情</text></view>
			<rich-text :nodes="desc"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>

			<view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite(goods)">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group"><button type="primary" class=" action-btn no-border add-cart-btn" @click="addGroup(goods)">发起拼单</button></view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="sku.pic"></image>
					<view class="right">
						<text class="price">¥{{ sku.price }}</text>
						<text class="stock">库存：{{ sku.stock }}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in specList" :key="index" class="attr-list">
					<text>{{ item.name }}</text>
					<view class="item-list">
						<text
							v-for="(childItem, childIndex) in specChildList"
							v-if="childItem.pid === item.id"
							:key="childIndex"
							class="tit"
							:class="{ selected: childItem.selected }"
							@click="selectSpec(childIndex, childItem.pid)"
						>
							{{ childItem.name }}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
import Api from '@/common/api';
import share from '@/components/share';
import { mapState } from 'vuex';
export default {
	components: {
		share
	},
	data() {
		return {
			specClass: 'none',
			specSelected: [],
			small: null,
			sku: [],
			detailData: [],
			serviceList:[],
			goods: [],
			group: [],
			favorite: true,
			shareList: [],
			groupMemberList: [],
			consultList: [],
			consultCount: {
				all: 0,
				bad: 0,
				general: 0,
				goods: 0
			},
			imgList: [
				{
					src: 'https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg'
				},
				{
					src: 'https://gd3.alicdn.com/imgextra/i3/TB1RPFPPFXXXXcNXpXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg'
				},
				{
					src: 'https://gd2.alicdn.com/imgextra/i2/38832490/O1CN01IYq7gu1UGShvbEFnd_!!38832490.jpg_400x400.jpg'
				}
			],
			ssss: [
				{ title: '小心愿，大梦想', pic: '../../static/vip-card-bg.png', count: '34', time: '1625293470350' },
				{ title: '杭州国际时', pic: '../../static/vip-card-bg.png', count: '36', time: '1725293470350' },
				{ title: '怪兽bobo全', pic: '../../static/vip-card-bg.png', count: '74', time: '154429253270350' },
				{ title: '汉风唐韵 、别', pic: '../../static/vip-card-bg.png', count: '266', time: '15255753270350' },
				{ title: '听说同台“PK”？', pic: '../../static/vip-card-bg.png', count: '97', time: '15252553270450' }
			],
			desc: `

				`,
			skuList: [],
			specList: [],
			specChildList: [],
			active: 'tab-container1',
			pinkFont: true,
			// 上拉刷新、下拉加载
			allLoaded: false, //如果为true,禁止上拉刷新
			autoFill: false, //取消自动填充，
			list: []
		};
	},
	async onLoad(ops) {
		//接收传值,id里面放的是标题，因为测试数据并没写id
		let id = ops.id;

		if (id) {
			this.logining = true;
			let params = { id: ops.id, groupId: ops.groupId };
			let data = await Api.apiCall('get', Api.goods.groupGoodsDetail, params);
			this.logining = false;

			if (data) {
				let detailData = data.goods;
				let goods = detailData.goods;
				this.goods = goods;
				this.group = data.group;
				this.favorite = data.favorite;

				/*setInterval(() => {
					data.memberGroupList.map((obj, index) => {
						this.$set(obj, 'djs', this.InitTime(obj.endTime));
					});


				}, 500);*/
				this.groupMemberList = data.memberGroupList;

				this.typeGoodsList = detailData.typeGoodsList;
				var subImages = goods.albumPics;
				this.desc = goods.detailHtml;
				this.small = subImages.split(',');
				var sers = goods.serviceIds;
				if (sers && sers.indexOf("1") != -1){
					this.serviceList.push('无忧退货');
				}
				if (sers && sers.indexOf("2") != -1){
					this.serviceList.push('快速退款');
				}
				if (sers && sers.indexOf("3") != -1){
					this.serviceList.push('正品保证');
				}
				//await this.$api.json('detailData');
				let shareList = await this.$api.json('shareList');
				this.loaded = true;
				this.detailData = detailData;
				this.shareList = shareList;
				this.specList = detailData.productAttributeValueList;
				this.skuList = detailData.skuStockList;
				if (this.specList) {
					this.specList.forEach(item => {
						let valuesA = item.value.split(',');

						if (valuesA) {
							for (let cItem of valuesA) {
								let att = {};
								att.pid = item.id;
								att.name = cItem;
								this.specChildList.push(att);
							}
						}
					});
				}

				uni.setNavigationBarTitle({
					title: goods.name
				});
			}
			if (this.hasLogin) {
				let params = { goodsId: ops.id };
				await Api.apiCall('post', Api.goods.addView, params);
			}
			let params1 = { goodsId: ops.id };
			let consoltL = await Api.apiCall('get', Api.goods.consultList, params1);
			this.consultList = consoltL.list;
			this.consultCount = consoltL.count;
		}

		if (this.specList) {
			//规格 默认选中第一条
			var specs = '';
			this.specList.forEach(item => {
				for (let cItem of this.specChildList) {
					if (cItem.pid === item.id) {
						this.$set(cItem, 'selected', true);
						this.specSelected.push(cItem);
						specs = cItem.name + ',' + specs;
						break; //forEach不能使用break
					}
				}
			});
			let valuesA = specs.substr(0, specs.length - 1).split(',');

			this.skuList.forEach(item => {
				if (valuesA.length == 1 && item.sp1 == valuesA[0]) {
					this.sku = item;
				}
				if (valuesA.length == 2 && item.sp2 == valuesA[0] && item.sp1 == valuesA[1]) {
					this.sku = item;
				}
				if (valuesA.length == 3 && item.sp3 == valuesA[0] && item.sp2 == valuesA[1] && item.sp1 == valuesA[2]) {
					this.sku = item;
				}
				if (!this.sku.pic) {
					this.sku.pic = this.goods.pic;
				}
				if (!this.sku.stock) {
					this.sku.stock = 0;
				}
				if (!this.sku.price) {
					this.sku.price = this.goods.price;
				}
			});
		}
		this.shareList = await this.$api.json('shareList');
	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	methods: {
		toTimeStamp(strtime) {
			var strtime = index;
			var date = new Date(strtime);
			var time = Date.parse(date) / 1000;
			return time;
		},
		InitTime(endtime) {
			var dd,
				hh,
				mm,
				ss = null;
			var time = parseInt(endtime) - new Date().getTime();

			if (time <= 0) {
				return '结束';
			} else {
				dd = Math.floor(time / 60 / 60 / 24);
				hh = Math.floor((time / 60 / 60) % 24);
				mm = Math.floor((time / 60) % 60);
				ss = Math.floor(time % 60);
				var str = dd + '天' + hh + '小时' + mm + '分' + ss + '秒';
				return str;
			}
		},

		//规格弹窗开关
		toggleSpec() {
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.specClass = 'show';
			}
		},
		//选择规格
		selectSpec(index, pid) {
			let list = this.specChildList;
			list.forEach(item => {
				if (item.pid === pid) {
					this.$set(item, 'selected', false);
				}
			});

			this.$set(list[index], 'selected', true);
			//存储已选择
			/**
			 * 修复选择规格存储错误
			 * 将这几行代码替换即可
			 * 选择的规格存放在specSelected中
			 */
			var specs = '';
			this.specSelected = [];
			list.forEach(item => {
				if (item.selected === true) {
					this.specSelected.push(item);
					specs = item.name + ',' + specs;
				}
			});
			let valuesA = specs.substr(0, specs.length - 1).split(',');

			this.skuList.forEach(item => {
				if (valuesA.length == 1 && item.sp1 == valuesA[0]) {
					this.sku = item;
				}
				if (valuesA.length == 2 && item.sp2 == valuesA[0] && item.sp1 == valuesA[1]) {
					this.sku = item;
				}
				if (valuesA.length == 3 && item.sp3 == valuesA[0] && item.sp2 == valuesA[1] && item.sp1 == valuesA[2]) {
					this.sku = item;
				}
				if (!this.sku.pic) {
					this.sku.pic = this.goods.pic;
				}
				if (!this.sku.stock) {
					this.sku.stock = 0;
				}
				if (!this.sku.price) {
					this.sku.price = this.goods.price;
				}
			});
		},
		//分享
		share() {
			this.$refs.share.toggleMask();
		},
		//收藏
		toFavorite(item) {
			if (!this.hasLogin) {
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
			} else {
				this.favorite = !this.favorite;
				let params = { objId: item.id, type: 1, name: item.name, meno1: item.pic, meno2: item.price, meno3: item.sale };
				Api.apiCall('post', Api.goods.favoriteSave, params);
			}
		},
		async addGroup(item) {
			// 发起拼团
			if (!this.hasLogin) {
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
			}
			let data;
			let id = item.id;
			if (this.sku && this.sku.id) {
			if(this.sku.stock<1){
            			   uni.showToast({title:"库存不够！"});
            			   return;
            			}
				uni.navigateTo({
					url: `/pages/order/createOrder?groupId=${this.group.id}&&id=${item.id}&&groupType=1&&type=1&&skuId=${this.sku.id}`
				});
			} else {
			if(this.goods.stock<1){
                        			   uni.showToast({title:"库存不够！"});
                        			   return;
                        			}
				uni.navigateTo({
					url: `/pages/order/createOrder?groupId=${this.group.id}&&id=${item.id}&&groupType=1&&type=1`
				});
			}
		},

		async acceptGroup(item) {
			console.log(item)
			console.log(this.goods)
			// 参与拼团
			if (!this.hasLogin) {
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
			}
			if (this.sku && this.sku.id) {
			if(this.sku.stock<1){
            			   uni.showToast({title:"库存不够！"});
            			   return;
            			}
				uni.navigateTo({
					url: `/pages/order/createOrder?groupId=${item.groupId}&&mgid=${item.id}&&id=${this.goods.id}&&groupType=2&&type=1&&skuId=${this.sku.id}'
					}`
				});
			} else {
			if(this.goods.stock<1){
                        			   uni.showToast({title:"库存不够！"});
                        			   return;
                        			}
				uni.navigateTo({
					url: `/pages/order/createOrder?groupId=${item.groupId}&&mgid=${item.id}&&id=${this.goods.id}&&groupType=2&&type=1`
				});
			}
		},

		stopPrevent() {}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-bottom: 160upx;
}
.icon-you {
	font-size: $font-base + 2upx;
	color: #888;
}
.carousel {
	height: 722upx;
	position: relative;
	swiper {
		height: 100%;
	}
	.image-wrapper {
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		display: flex;
		justify-content: center;
		align-content: center;
		height: 750upx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

/* 标题简介 */
.introduce-section {
	background: #fff;
	padding: 20upx 30upx;

	.title {
		font-size: 32upx;
		color: $font-color-dark;
		height: 50upx;
		line-height: 50upx;
	}
	.price-box {
		display: flex;
		align-items: baseline;
		height: 64upx;
		padding: 10upx 0;
		font-size: 26upx;
		color: $uni-color-primary;
	}
	.price {
		font-size: $font-lg + 2upx;
	}
	.m-price {
		margin: 0 12upx;
		color: $font-color-light;
		text-decoration: line-through;
	}
	.coupon-tip {
		align-items: center;
		padding: 4upx 10upx;
		background: $uni-color-primary;
		font-size: $font-sm;
		color: #fff;
		border-radius: 6upx;
		line-height: 1;
		transform: translateY(-4upx);
	}
	.bot-row {
		display: flex;
		align-items: center;
		height: 50upx;
		font-size: $font-sm;
		color: $font-color-light;
		text {
			flex: 1;
		}
	}
}
/* 分享 */
.share-section {
	display: flex;
	align-items: center;
	color: $font-color-base;
	background: linear-gradient(left, #fdf5f6, #fbebf6);
	padding: 12upx 30upx;
	.share-icon {
		display: flex;
		align-items: center;
		width: 70upx;
		height: 30upx;
		line-height: 1;
		border: 1px solid $uni-color-primary;
		border-radius: 4upx;
		position: relative;
		overflow: hidden;
		font-size: 22upx;
		color: $uni-color-primary;
		&:after {
			content: '';
			width: 50upx;
			height: 50upx;
			border-radius: 50%;
			left: -20upx;
			top: -12upx;
			position: absolute;
			background: $uni-color-primary;
		}
	}
	.icon-xingxing {
		position: relative;
		z-index: 1;
		font-size: 24upx;
		margin-left: 2upx;
		margin-right: 10upx;
		color: #fff;
		line-height: 1;
	}
	.tit {
		font-size: $font-base;
		margin-left: 10upx;
	}
	.icon-bangzhu1 {
		padding: 10upx;
		font-size: 30upx;
		line-height: 1;
	}
	.share-btn {
		flex: 1;
		text-align: right;
		font-size: $font-sm;
		color: $uni-color-primary;
	}
	.icon-you {
		font-size: $font-sm;
		margin-left: 4upx;
		color: $uni-color-primary;
	}
}

.c-list {
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	background: #fff;
	.c-row {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		position: relative;
	}
	.tit {
		width: 140upx;
	}
	.con {
		flex: 1;
		color: $font-color-dark;
		.selected-text {
			margin-right: 10upx;
		}
	}
	.bz-list {
		height: 40upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		text {
			display: inline-block;
			margin-right: 30upx;
		}
	}
	.con-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		color: $font-color-dark;
		line-height: 40upx;
	}
	.red {
		color: $uni-color-primary;
	}
}

/* 评价 */
.eva-section {
	display: flex;
	flex-direction: column;
	padding: 20upx 30upx;
	background: #fff;
	margin-top: 16upx;
	.e-header {
		display: flex;
		align-items: center;
		height: 70upx;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		.tit {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 4upx;
		}
		.tip {
			flex: 1;
			text-align: right;
		}
		.icon-you {
			margin-left: 10upx;
		}
	}
	.logo {
		display: block;
		width: 50upx;
		height: 50upx;
		border-radius: 100px;
	}
}
.eva-box {
	display: flex;
	padding: 20upx 0;
	.portrait {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		border-radius: 100px;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: $font-base;
		color: $font-color-base;
		padding-left: 26upx;
		.con {
			font-size: $font-base;
			color: $font-color-dark;
			padding: 20upx 0;
		}
		.bot {
			display: flex;
			justify-content: space-between;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
}
/*  详情 */
.detail-desc {
	background: #fff;
	margin-top: 16upx;
	.d-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		position: relative;

		text {
			padding: 0 20upx;
			background: #fff;
			position: relative;
			z-index: 1;
		}
		&:after {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300upx;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
		}
	}
}

/* 规格选择弹窗 */
.attr-content {
	padding: 10upx 30upx;
	.a-t {
		display: flex;
		image {
			width: 170upx;
			height: 170upx;
			flex-shrink: 0;
			margin-top: -40upx;
			border-radius: 8upx;
		}
		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
			line-height: 42upx;
			.price {
				font-size: $font-lg;
				color: $uni-color-primary;
				margin-bottom: 10upx;
			}
			.selected-text {
				margin-right: 10upx;
			}
		}
	}
	.attr-list {
		display: flex;
		flex-direction: column;
		font-size: $font-base + 2upx;
		color: $font-color-base;
		padding-top: 30upx;
		padding-left: 10upx;
	}
	.item-list {
		padding: 20upx 0 0;
		display: flex;
		flex-wrap: wrap;
		text {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #eee;
			margin-right: 20upx;
			margin-bottom: 20upx;
			border-radius: 100upx;
			min-width: 60upx;
			height: 60upx;
			padding: 0 20upx;
			font-size: $font-base;
			color: $font-color-dark;
		}
		.selected {
			background: #fbebee;
			color: $uni-color-primary;
		}
	}
}

/*  弹出层 */
.popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 99;

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		.mask {
			animation: hidePopup 0.2s linear both;
		}
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		min-height: 40vh;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.btn {
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(120%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(120%);
		}
	}
}

/* 底部操作菜单 */
.page-bottom {
	position: fixed;
	left: 30upx;
	bottom: 30upx;
	z-index: 95;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 690upx;
	height: 100upx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
	border-radius: 16upx;

	.p-b-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: $font-sm;
		color: $font-color-base;
		width: 96upx;
		height: 80upx;
		.yticon {
			font-size: 40upx;
			line-height: 48upx;
			color: $font-color-light;
		}
		&.active,
		&.active .yticon {
			color: $uni-color-primary;
		}
		.icon-fenxiang2 {
			font-size: 42upx;
			transform: translateY(-2upx);
		}
		.icon-shoucang {
			font-size: 46upx;
		}
	}
	.action-btn-group {
		display: flex;
		height: 76upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #fa436a;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
		margin-left: 20upx;
		position: relative;
		&:after {
			content: '';
			position: absolute;
			top: 50%;
			right: 50%;
			transform: translateY(-50%);
			height: 28upx;
			width: 0;
			border-right: 1px solid rgba(255, 255, 255, 0.5);
		}
		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180upx;
			height: 100%;
			font-size: $font-base;
			padding: 0;
			border-radius: 0;
			background: transparent;
		}
	}
}
</style>
