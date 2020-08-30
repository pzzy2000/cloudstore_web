<template>
  <div>
    <vue-qr :text="goodQrcode" :size="200"></vue-qr>
  </div>
</template>

<script>
  import vueQr from 'vue-qr'
  import axios from 'axios'
  import {getToken} from "../../../utils/auth"
  import {switchForm} from '@/api/iunits'
  export default {
    name: "qrCode",
    components: {
      vueQr
    },
    data() {
      return {
        goodQrcode: ''
      }
    },
    created() {
      this.qrcode({activityGoodsId: this.$route.query.id}, '二维码');
    },
    methods: {
      qrcode(params, shopname) {
        axios({
          headers: {
            'auth': getToken()
          },
          method: 'POST',
          data: switchForm(params),
          url: 'http://106.52.184.24:18888/platform/goods/qrCode',
          responseType: "arraybuffer" //此处必须设置，不然会报已损坏
        }).then(function(res) {
          // 将后台的图片二进制流转为为base64
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        }).then(data => {
          var alink = document.createElement("a");
          alink.href = data;
          alink.download = shopname; //图片名
          alink.click();
          // console.log(data)
          // this.imgdwn = data; // data即为图片地址
          this.$router.go(-1);
        });
      }
    }
  }
</script>

<style scoped>

</style>
