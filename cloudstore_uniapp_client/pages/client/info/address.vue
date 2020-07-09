<template>
	<view class="content b-t">
		<nav-bar backState="1000">选择地址</nav-bar>
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.status ==1 " class="tag">默认</text>
				</view>
				<view class="u-box">
					<view class="">
						<text class="name">{{item.name}} {{item.phone}} </text><br/>
						<text class="name">{{item.detailAddress}} </text><br/>
						<text class="address">{{item|address}}</text>
					</view>
					<view class="">
						<text class="address text-red" v-if='isDelete' @click.stop="deleteAddress(item.id)">删除</text>
					</view>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item.id)"></text>
		</view>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			
		</text>
		
		<button class="add-btn" @click="addAddress">新增地址</button>
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
				isDelete: true
			}
		},
		components:{
			navBar
		},
		onLoad(option){
			console.log(option.source);
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
				console.log(type,id)
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
					console.log(list)
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
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.name{
			margin-right: 30upx;
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
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
