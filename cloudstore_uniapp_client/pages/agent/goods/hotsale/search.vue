<template>
	<view class="container">
		<nav-bar backState="1000">搜索商品</nav-bar>
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
			<view class="tag-title">历史记录</view>
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
		onLoad () {
			this.historyList = Array.from(uni.getStorageSync('searchHistory'))
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
				}
				if (this.searchValue.length === 0) {
					this.$api.msg('请输入需要搜索的商品')
					return false
				}
				this.historyList.push(this.searchValue)
				uni.setStorageSync('searchHistory', this.historyList)
				uni.navigateTo({
				    url: "/pages/agent/goods/category/category?goodsName="+this.searchValue
				});
			}
		}
	}
</script>

<style  lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background-color: #FFF;
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
		padding: 30upx 30upx 0;
		width: 100%;
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
