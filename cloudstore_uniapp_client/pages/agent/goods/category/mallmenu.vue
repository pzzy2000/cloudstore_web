<template>
	<view class="u-wrap">
		<nav-bar>商品分类</nav-bar>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in itemList" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index, item.text, item.value)">
					<text class="u-line-1">{{item.text}}</text>
				</view>
			</scroll-view>
			<block style="height: 100%;">
				<scroll-view scroll-y class="right-box">
					<view class="page-view">
						<view class="class-item">
							<view class="item-container">
								<view class="thumb-box" v-for="(item2, index1) in categoryList" :key="index1" @click="toReclassify(item2,index1)">
									<image class="item-menu-image" :src="item2.pic" mode="aspectFit" :fade-show="false" lazy-load="false"></image>
									<view class="item-menu-name">{{item2.text}}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				title: '',
				itemList: [],
				categoryId: [],
				categoryList: []
			}
		},
		components: {
			navBar
		},
		onLoad() {
			this.loadgoodsType ()
		},
		methods: {
			async loadgoodsType () { //初始化加载商品一级分类
				let params = {
					pageNum: '1',
					parentId: 0
				};
				let list = await Api.apiCall('post', Api.agent.category.list, params, true);
				if (list) {
					if (list.result.records.length != 0) {
						for (let tmp in list.result.records) {
							this.itemList.push({
								text: list.result.records[tmp].name,
								value: list.result.records[tmp].id,
							})
						}
						this.categoryId = this.itemList[0].value
						this.title = this.itemList[0].text
						this.typeChange(this.categoryId)
					} else {
						this.$api.msg('暂无分类数据')
					}
				} else {
					this.$api.msg('请求失败')
				}
			},
			async typeChange(id) { //选择商品类型
				this.categoryList.length = 0
				let params = {
					pageNum: '1',
					parentId: id
				};
				let list = await Api.apiCall('post', Api.agent.category.list, params, true);
				if (list) {
					for (let tmp in list.result.records) {
						this.categoryList.push({
							text: list.result.records[tmp].name,
							value: list.result.records[tmp].id,
							pic: list.result.records[tmp].categoryPicUrl
						})
					}
				}
			},
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index,text, id) {
				this.categoryId = id
				if(index == this.current) return ;
				this.title = text
				this.current = index;
				this.typeChange(id)
			},
			toReclassify (item,index) {
				var tmpData = []
				for (let tmp in this.categoryList) {
					tmpData.push({
						value: this.categoryList[tmp].value,
						text: this.categoryList[tmp].text
					})
				}
				if (tmpData){
					uni.navigateTo({
						url:'/pages/agent/goods/category/reclassify?categoryOneId='+this.categoryId +'&title='+this.title+'&current='+index+'&categoryList='+ JSON.stringify(tmpData)
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: #000;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #fff;
		border-bottom: 2upx solid #f5f5f5;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #666;
		letter-spacing: 4upx;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #3AAAFF;
		font-size: 26upx;
		background: #E4F4FF;
		letter-spacing: 2upx;
	}
	
	.u-tab-item-active{
		font-weight: bold;
		&::before {
			content: "";
			position: absolute;
			border-left: 4upx solid #3AAAFF;
			height: 100%;
			right: 0;
			top: 0;
		}
	}

	.u-tab-view {
		height: 100%;
		background-color: #ffff;
	}
	
	.right-box {
		background-color: #f5f5f5;
	}
	
	.class-item {
		padding: 16rpx;
		border-radius: 8rpx;
	}
	.item-title {
		font-size: 26rpx;
		color: #000;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 26rpx;
		color: #666;
		letter-spacing: 2upx;
		margin-top: 10upx;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
	
	.thumb-box {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 20rpx 0;
	}
	
	.item-menu-image {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		box-shadow: 2upx 2upx 5upx rgba(58,170,255, 0.2);
	}
</style>
