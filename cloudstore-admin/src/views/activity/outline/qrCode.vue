<template>
  <div>
    <vue-qr :text="goodQrcode" :size="200"></vue-qr>
    <div style="text-align: center; margin-top: 50px">
      <el-button @click="backPage">返回</el-button>
    </div>
  </div>
</template>

<script>
  import vueQr from 'vue-qr'
  import {qrcode} from '@/api/product'
  import axios from 'axios'
  import {getToken} from "../../../utils/auth";
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
      this.qrcode('二维码');
    },
    methods: {
      qrcode(shopname) {
        axios({
          headers: {
            'auth': getToken()
          },
          method: 'POST',
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
        });
      },
      backPage() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
