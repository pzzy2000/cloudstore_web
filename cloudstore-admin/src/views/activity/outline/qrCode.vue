<template>
  <div style="margin-top: 30px;">
    <div style="position: relative;height: 320px">
      <div style="position: absolute; top: 0; left: 50%; margin-left: -128px">
        <div id="qrCode" ref="qrCodeDiv"></div>
      </div>
    </div>
    <div style="text-align: center">
      <div>二维码链接：<span>{{link}}</span></div>
      <el-button @click="backPage" style="margin-top: 20px">返回</el-button>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2';
  export default {
    name: "qrCode",
    // components: {
    //   vueQr
    // },
    created() {
      this.$nextTick(function() {
        new QRCode(this.$refs.qrCodeDiv, {
          text: "https://www.sz-guochuang.com/into?action=xxsp&activityGoodsId=" + this.$route.query.id + '&agentId=' + this.$route.query.agentId,
          width: 256,
          height: 256,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        });
      })
      this.link = "https://www.sz-guochuang.com/into?action=xxsp&activityGoodsId=" + this.$route.query.id + '&agentId=' + this.$route.query.agentId;
    },
    data() {
      return {
        link: ""
        // options: {
        //   text: 'https://www.sz-guochuang.com/into?action=xxsp&activityGoodsId=' + this.$route.query.id
        // }
      }
    },
    // created() {
    //   this.qrcode({activityGoodsId: this.$route.query.id}, '二维码');
    // },
    methods: {
      backPage() {
        this.$router.go(-1)
      },
      // qrcode(params, shopname) {
      //   axios({
      //     headers: {
      //       'auth': getToken()
      //     },
      //     method: 'POST',
      //     data: switchForm(params),
      //     url: 'http://106.52.184.24:18888/platform/goods/qrCode',
      //     responseType: "arraybuffer" //此处必须设置，不然会报已损坏
      //   }).then(function(res) {
      //     // 将后台的图片二进制流转为为base64
      //     return (
      //       "data:image/png;base64," +
      //       btoa(
      //         new Uint8Array(res.data).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ""
      //         )
      //       )
      //     );
      //   }).then(data => {
      //     var alink = document.createElement("a");
      //     alink.href = data;
      //     alink.download = shopname; //图片名
      //     alink.click();
      //     // console.log(data)
      //     // this.imgdwn = data; // data即为图片地址
      //     this.$router.go(-1);
      //   });
      // }
    }
  }
</script>

<style scoped>

</style>
