<template>
    <view>
        <web-view :src="url" ></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                url: 'http://www.sz-guochuang.com/fl/ymg_ysxy.html'
            }
        },
        onLoad(options) {
            if (options && options.url) {
                this.url = options.url;
            }
        },
        methods: {
            getMessage(event) {
                // uni.showModal({
                //     content: JSON.stringify(event.detail),
                //     showCancel: false
                // });
            }
        }
    }
</script>

<style>

</style>

