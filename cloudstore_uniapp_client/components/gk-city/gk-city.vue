<template>
	<view>
		<view class="mask" :class="{'maskShow' : showPicker}" @click="hide" @click.stop.prevent @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="cpicker-content" :class="{'cpickerShow' : showPicker}">
			<!-- 优惠券页面，仿mt -->
			<view class="city-head" @click.stop.prevent @touchmove.stop.prevent catchtouchmove="true">
				<view class="city-head-title">请选择所在地区</view>
				<icon type="clear" v-if="rightIcon" class="rightIcon" size="20" color="#cccccc" @click="hide"></icon>
			</view>
			<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft" >
				<view
					v-for="(item,index) in tabbars" 
					class="nav-item"
					:id="'tab'+index"
					:key="index"
					@click="changeTab(index)"
				><text class="nav-bar-title" :class="{'current': index === tabCurrentIndex}">{{item.text}}</text></view>
			</scroll-view>
			<view class="city_content"> 
				<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" :cscrollTop="scrollTop" :current="tabCurrentIndex" :scroll-top="scrollTop">
					<block v-for="(item,index) in tabbars[tabCurrentIndex].selfData" :key="index">
						<view class="flex-row-c-c" @click="changCity(tabCurrentIndex,item)">
							<icon type="success_no_circle" v-if="tabbars[tabCurrentIndex].value==item.value" :id="'show'+tabCurrentIndex" class="ischeck" size="14" color="#00B1B7" ></icon>
							<text class="city-text">{{item.text}}</text>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	let windowWidth = 0,scrollTimer = false, tabBar;
	export default {
		name: 'UniCityNvue',
		props: {
			pickerSize: {    // 使用多少个tab
				type: [Number, String],
				default: 1
			},
			provincedata: {      // 默认的省市区id，如果不使用id的情况下则为[]；
				type:Array,
				default:function(){
					return  [];
				},
			}
		},
		data() {
			return {
				rightIcon:true,
				scrollLeft: 0, //顶部选项卡左滑距离
				scrollTop:0,
				enableScroll: true,
				tabCurrentIndex: 0, //当前选项卡索引
				tabbars:this.provincedata,
				pickersize: this.pickerSize,
				showPicker: false
			}
		},
		methods: {
			show(){
				this.showPicker = true;
			},
			hide(){
				this.showPicker = false;
			},
			//tab切换
			async changeTab(e){
				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				let width = 0; 
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index; 
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				this.tabCurrentIndex = index; 
				setTimeout(()=>{
					this.getScroll("show"+index);
				}, 10)
			},
			//获得元素的size
			getElSize(id) { 
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().in(this).select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			changCity: function (index,item) {
				if(this.tabbars[index].value!=item.value){
					this.tabbars[index].text=item.text;
					this.tabbars[index].value=item.value;
					if(index<(this.tabbars.length-1)){
						this.tabbars.splice(index+1,this.tabbars.length-index-1)
					}
					if(this.tabbars.length<this.pickersize){
						var current={
								text:"请选择",
								value:"",
								selfData:item.children
							}
						this.tabbars.push(current);
						this.tabCurrentIndex++; 
						this.scrollTop=0;
					}else{
						this.$emit('funcvalue',this.tabbars);
						this.hide();
					}
				}
			},
			getScroll(id) {
				uni.createSelectorQuery().in(this).select('.panel-scroll-box').boundingClientRect((data)=>{
					uni.createSelectorQuery().in(this).select('#' + id).boundingClientRect((res)=>{
						if(res != undefined && res != null && res != ''){
							this.scrollTop=res.top-data.top;
						}
					}).exec()
				}).exec();
			}
		}
	}
</script>

<style lang="scss">
/* 优惠券面板 */
.mask {
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, .6);
    opacity: 0;
    transition: all .3s ease;
}
.maskShow {
    visibility: visible;
    opacity: 1;
}
.cpicker-content {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #FFFFFF;
    transition: all .3s ease;
    transform: translateY(100%);
    z-index: 3000;
}
.cpickerShow {
    transform: translateY(0);
}
.city-head {
    width: 750rpx;
    height: 88rpx;
    flex-direction: column;
    border-bottom-width: 1px;
    border-bottom-color: #F4F4F4;
    border-bottom-style: solid;
}
.city-head-title {
    font-size: 15px;
    line-height: 88rpx;
    align-items: center;
    /* #ifndef APP-NVUE */
    text-align: center;
    /* #endif */
}
.rightIcon {
    position: absolute;
    right: 15px;
    top: 12px;
    font-size: 10px;
    color: #BEBEBE;
}
.nav-bar {
    position: relative;
    z-index: 10;
    height: 80upx;
    padding-left: 5px;
    width: 750rpx;
    flex-direction: row;
    background-color: #FFFFFF;
}

.nav-item {
    /* #ifndef APP-NVUE */
    display: inline-flex!important;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex-direction: row!important;
    /* #endif */
    width: 170rpx;
    padding: 7px 0px;
    line-height: 26px;
    align-items: center;
    justify-content: center;
    color: #303133;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
}
.nav-bar-title {
    font-size: 12px;
}
.current {
    color: #00B1B7;
    border-color: #00B1B7;
    border-bottom-width: 4rpx;
    border-bottom-style: solid;
}
.current:after {
    width: 50%;
}
.nav-item:after {
    width: 0;
    height: 0;
    border-color: #00B1B7;
    border-bottom-width: 4rpx;
    border-bottom-style: solid;
    position: absolute;
    left: 50%;
    bottom: 0;
    transition-property: transform;
    transition-duration: .3s;
    transition-timing-function: ease;
} 
.panel-scroll-box {
    height: 516rpx;
    margin-top: 8px;
}
.flex-row-c-c {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex-direction: row;
    /* #endif */
    padding-left: 25px;
}
.city-text {
    /* #ifdef APP-NVUE */
    flex-direction: row;
    /* #endif */
    height: 35px;
    line-height: 35px;
    font-size: 13px;
}
.hide {
    opacity: 0;
}
.ischeck {
    /* #ifndef APP-NVUE */
    display: inline-flex!important;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex-direction: column;
    /* #endif */
    margin-right: 5px;
    vertical-align: middle;
}

</style>