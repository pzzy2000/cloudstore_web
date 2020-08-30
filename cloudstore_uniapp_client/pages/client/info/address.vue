<template>
	<view class="content b-t">
		<nav-bar backState="1000">选择地址</nav-bar>
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="u-box">
					<view class="address-info">
						<text class="address">{{item|address}}</text><br/>
						<text class="name">{{item.community}}&nbsp;&nbsp;{{item.detailAddress}} </text>
						<view class="info">
							<text v-if="item.status ==1 " class="tag text-white default">默认</text>
							<text class="name">{{item.name}} {{item.phone}} </text>
						</view>
					</view>
					<text class="address text-red" v-if='isDelete' @click.stop="deleteAddress(item.id)">删除</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item.id)"></text>
		</view>
		<button class="add-btn bg-blue" @click="addAddress">新增地址</button>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				source: 0,
				addressList: [
				],
				isDelete: true,
			}
		},
		components:{
			navBar
		},
		onLoad(option){
			this.source = option.source;
			this.searchAddressList();
		},
		filters:{
			address(data){
				try{
					return data.provinceBean.name+" "+data.cityBean.name+" "+data.areaBean.name;
				}catch(e){
					return "地址错误"
				}
			}
		},
		methods: {
			 async searchAddressList () { //查询地址列表
			 let params={};
				let list = await Api.apiCall('post', Api.client.address.list, params,true);
				if (list) {
					this.addressList = list.result.records
					if (list.result.total === '1') {
						this.isDelete = false
					}else {
						this.isDelete = true
					}
				}
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().setAddress(item);
					uni.navigateBack()
				}
			},
			addAddress(type, id){
				uni.navigateTo({
					url: '/pages/client/info/addressManage?type='+type+'&id='+id
				});
			},
			async deleteAddress (id) {
				let params={
					ids: id
				};
				let list = await Api.apiCall('post', Api.client.address.deleteAddress, params);
				if (list) {
					if (list.code === 0) {
						this.$api.msg('删除成功');
						this.searchAddressList()
					}else{
						this.$api.msg(list.msg);
					}
				}
			}
			// //添加或修改成功之后回调
			// refreshList(data, type){
			// 	//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			// 	this.addressList.unshift(data);
				
			// 	console.log(data, type);
			// }
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			margin-right: 10upx;
			border: 1px solid #08affe;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 26upx;
			color: #333;
			.name {
				color: #666;
			}
		}
	}
	.u-box{
		font-size: 28upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.address-info {
			width: 85%;
			display: block;
		}
		.address{
			font-size: 26upx;
			color: #333;
			line-height: 40rpx;
		}
		.name{
			margin-right: 30upx;
			font-size: 26upx;
			line-height: 40rpx;
			color: #666;
		}
		.info {
			display: flex;
			align-items: center;
			color: #999;
			font-size: 24upx;
			.default {
				margin-right: 10upx;
				background-image: linear-gradient(90deg,#feca3d,#fe8e16);
				border-radius: 4upx;
				height: 35upx;
				line-height: 35upx;
				text-align: center;
				width: 60upx;
				font-size: 18upx;
			}
			.name {
				color: #999;
				font-size: 24upx;
			}
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		border-radius: 10upx;
	}
</style>
