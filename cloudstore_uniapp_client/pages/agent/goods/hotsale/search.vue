<template>
	<view class="container">
		<nav-bar fontColor="#fff"  bgColor="#39a9ff" title="搜索商品" :titleCenter="true">
			<view class="cuIcon-back" slot="left" @click.stop="toHome"></view>
		</nav-bar>
		<!-- <nav-bar backState="1000">搜索商品</nav-bar> -->
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" :value="searchValue" :adjust-position="false" @confirm="search('')" type="text" placeholder="请输入商品名" confirm-type="search" @input="searchInput"></input>
			</view>
			<view class="action">
				<button class="cu-btn search-btn" @click="search('')">搜索</button>
			</view>
		</view>
		<view class="tag-List">
			<view class="tag-tit">
				<view class="tag-record">历史记录</view>
				<view class="empty-record" @click='record'>清空记录</view>
			</view>
			<view class="tag-List-content">
				<view class="tag-text" v-for="(item,index) in historyList" :key='index' @click.stop="search(item)">
					{{item}}
				</view>
			</view>
		</view>
		<view class="tag-List">
			<view class="tag-title">猜你喜欢</view>
			<view class="tag-List-content">
				<view class="tag-text" v-for="(item,index) in likeList" :key='index' @click.stop="search(item)">
					{{item}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				InputBottom: 0,
				historyList: [],
				likeList: ['金龙鱼','面','水饺'],
				searchValue: ''
			}
		},
		components: {
			navBar
		},
		onShow () {
			var tmp = Array.from(uni.getStorageSync('searchHistory'))
			this.historyList = Array.from(new Set(tmp)).slice(0,10)
		},
		onHide() {
			this.searchValue = ""
		},
		methods: {
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			searchInput (e) {
				this.searchValue = e.detail.value
			},
			search (name) {
				if (name) {
					this.searchValue = name
				} else {
					this.historyList.splice(0, 0, this.searchValue)
				}
				if (this.searchValue.length === 0) {
					this.$api.msg('请输入需要搜索的商品')
					return false
				}
				uni.setStorageSync('searchHistory', Array.from(new Set(this.historyList)).slice(0,10))
				uni.navigateTo({
				    url: "/pages/agent/goods/category/category?goodsName="+this.searchValue
				});
			},
			record () {
				if (this.historyList.length != 0) {
					uni.showModal({
						title: '提示',
						content: '确认删除搜索历史',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if(res.confirm) {
								uni.removeStorageSync('searchHistory')
								this.historyList = []
							}else if (res.cancel) {
							}
						},
					});
				} else {
					this.$api.msg('您还没有搜索记录哦')
				}
			},
			toHome () {
				uni.switchTab({
					url:"/pages/agent/goods/hotsale/hotsale"
				})
			}
		}
	}
</script>

<style  lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background-color: #FFF;
		.header {
			.title {
				font-weight: normal;
			}
		}
	}
	.cuIcon-back {
		margin-left: 25upx;
		font-size: 38upx;
		color: #555;
	}
	.cu-bar .search-form {
		margin: 0 0 0 30upx;
	}
	.search-btn {
		background-color: #fff;
		color: #666;
		font-size: 30upx;
	}
	.cu-bar .search-form+.action {
		margin: 0;
	}
	.tag-List {
		padding: 30upx 50upx  0  30upx;
		width: 100%;
		.tag-tit {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20upx;
			.tag-record {
				color: #666666;
				font-size: 26upx;
			}
			.empty-record {
				font-size: 20upx;
				color: #ff0000;
			}
		}
		.tag-title {
			margin-bottom: 20upx;
			color: #666666;
			font-size: 26upx;
		}
		.tag-List-content {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.tag-text {
				height: 35upx;
				line-height: 35upx;
				margin-left: 20upx;
				text-align: center;
				padding: 0 20upx;
				margin-bottom: 20upx;
				background-color: #F5F5F5;
				color: #999999;
				font-size: 22upx;
				border-radius: 16upx;
			}
		}

	}
</style>
