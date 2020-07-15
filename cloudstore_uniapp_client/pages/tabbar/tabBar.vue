<template>
	
		<view class="tabBar">
		        <view v-for="(item,index) in tabbar" :key="item.pagePath" v-if="item.role == role "
				 class="tabbar_item"  @click="navTo(item,index)">
		            <image v-if="item.id==ids" :src="item.selectedIconPath" mode="" class="image"></image>
		            <image v-else :src="item.iconPath" mode="" class="image"></image>
		            <view class="text">{{item.text}}</view>
		        </view>
		</view>
	
</template>

<script>
	
	export default {
		name:"tabbar",
		props: {
			ids:{
				type: String,
				default: ''
			},
			role:{
				type: String,
				default: 'client'
			}
		},
	
				// created() {
				// 	this.current = this.tabBarIndex
				// },
				// watch: {
				// 	tabBarIndex() {
				// 		this.current = this.tabBarIndex
				// 	}
				// },
		data() {
			return {
				current: 0,
				page: 'contact',
				showPage: false,
				containerHeight: 400,
				tabbar: [
					// client 
					{
						"pagePath": "/pages/client/recommend/index",
						"iconPath": "/static/tab-home.png",
						"selectedIconPath": "/static/tab-home-current.png",
						"role": "client",
						"id":'ctj',
						"text": "推荐"
					},
					{
						"pagePath": "/pages/client/shares/index",
						"iconPath": "/static/tab-home.png",
						"selectedIconPath": "/static/tab-home-current.png",
						"role": "client",
						"id":'cfx',
						"text": "分享"
					}, 
					{
						"pagePath": "/pages/client/cart/index",
						"iconPath": "/static/tab-home.png",
						"selectedIconPath": "/static/tab-home-current.png",
						"role": "client",
						"id":'cgwc',
						"text": "购物车"
					},
					{
						"pagePath": "/pages/client/info/index",
						"iconPath": "/static/tab-home.png",
						"selectedIconPath": "/static/tab-home-current.png",
						"role": "client",
						"id":'cwd',
						"text": "我的"
					},

					//end

					{
						"pagePath": "/pages/agent/goods/hotsale/hotsale",
						"iconPath": "/static/tab-cate.png",
						"selectedIconPath": "/static/tab-cate-current.png",
						id:'armsp',
						"role": "agent",
						"text": "热门商品"
					},

					{
						"pagePath": "/pages/agent/goods/category/category",
						"iconPath": "/static/tab-cate.png",
						"selectedIconPath": "/static/tab-cate-current.png",
						"role": "agent",
						id:'aspfl',
						"text": "商品分类"
					},
					{
						"pagePath": "/pages/agent/home/index",
						"iconPath": "/static/fujin.png",
						"selectedIconPath": "/static/fujin_.png",
						"id":"awddl",
						"role": "agent",
						"text": "我的代理"
					},
					{
						"pagePath": "/pages/agent/money/profit",
						"iconPath": "/static/tab-cart.png",
						"selectedIconPath": "/static/tab-cart-current.png",
						"id":"awdsy",
						"role": "agent",
						"text": "我的收益"
					},
					{
						"pagePath": "/pages/agent/info/index",
						"iconPath": "/static/tab-my.png",
						"selectedIconPath": "/static/tab-my-current.png",
						"id":"adlxx",
						"role": "agent",
						"text": "代理信息"
					}

				]
			};
		},
		mounted() {
			// true为判断条件，根据实际的需求替换即可
			// if (true) {
			// 	this.tabbar.splice(1, 0, {
			// 		"pagePath": "/pages/tabBar/manage/manage",
			// 		"iconPath": "/static/tabBar/home.png",
			// 		"selectedIconPath": "/static/tabBar/home_col.png",
			// 		"text": "管理",
			// 		"fontIcon": "icon-guanli"
			// 	})
			// }
		},
		methods: {
			
		setshow(show){
			this.showPage=show;
		},

        dd(item){
			if(this.showPage==true)return;
			this.setshow(true);
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
			let xx= this.setshow;
			uni.reLaunch({
				url: item.pagePath,
				complete:function(){
					xx(false);
					uni.hideLoading();
				}
			});
		},

		 async	navTo(item, index) {
				if(item.role ==='client'){
					uni.switchTab({
						url: item.pagePath
					})	
				}else{
					await this.dd(item);
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
    //导航栏设置
    $isRadius:20upx; //左上右上圆角
    $isWidth:100vw; //导航栏宽度
    $isBorder:1px solid #eeeeee; //边框 不需要则设为0px
    $isBg:white; //背景
     
    // 选中设置
    $chooseTextColor:#1b60ac; //选中时字体颜色
    $chooseBgColor:white; //选中时背景颜色 transparent为透明
 
    //未选中设置
    $normalTextColor:#999; //未选中颜色
 
    .tabBar {
        width: $isWidth;
        height:90upx;
        position: fixed;
        bottom: 1upx;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 998;
        background-color: $isBg;
        color: $normalTextColor;
        border-left: $isBorder;
        border-top: $isBorder;
        border-right: $isBorder;
        display: flex;
        justify-content: space-around;
        border-top-right-radius: $isRadius;
        border-top-left-radius: $isRadius;
        box-sizing: border-box;
        overflow: hidden;
 
        .tabbar_item {
            width: 25%;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
 
            &.active {
                /* border-left: $isBorder;
                border-top: $isBorder; */
                background: $chooseBgColor;
                color: $chooseTextColor;
            }
        }
 
        .image {
            width: 36upx;
            height: 36upx;
            margin-left: 5upx;
        }
    }
</style>
