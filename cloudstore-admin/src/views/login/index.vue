<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center">

        </div>
        <h2 class="login-title color-main">Y咪购供应商管理平台</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm['bean.access']"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm['bean.password']"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
         <!-- <el-button style="width: 45%" type="primary" @click.native.prevent="handleTry">
            获取体验账号
          </el-button> -->
          <!--
        </el-form-item>
        <el-form-item style="text-align: center;letter-spacing: 1px">
          <span style="font-size: 12px; color: #8c939d">没有账号？<a href="void:javascript(0)" class="sign" @click="tosign">去注册</a></span>
        </el-form-item>
        -->
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="公众号二维码"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="30%">
      <div style="text-align: center">
        <span class="font-title-large"><span class="color-main font-extra-large">关注公众号</span>回复<span class="color-main font-extra-large">体验</span>获取体验账号</span>
        <br>
        <img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg" width="160" height="160" style="margin-top: 10px">
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
  //import login_center_bg from '@/assets/images/login_center_bg.png'
  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          'bean.access': '',
          'bean.password': '',
          'bean.logintype': 'supplier',
          'bean.action': 'password'
        },
        loginRules: {
          'bean.access': [{required: true, trigger: 'blur', validator: validateUsername}],
          'bean.password': [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        // login_center_bg,
        dialogVisible:false,
        supportDialogVisible:false
      }
    },
    created() {
      // this.loginForm['bean.access'] = getCookie("username");
      // this.loginForm['bean.password'] = getCookie("password");
      // if(this.loginForm['bean.access']  === undefined||this.loginForm['bean.access'] ==null||this.loginForm['bean.access'] ===''){
      //   this.loginForm['bean.access']  = 'admin';
      // }
      // if(this.loginForm['bean.password'] === undefined||this.loginForm['bean.password']==null){
      //   this.loginForm['bean.password'] = '';
      // }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            // let isSupport = getSupport();
            // if(isSupport===undefined||isSupport==null){
            //   this.dialogVisible =true;
            //   return;
            // }
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              setCookie("username",'xxooxx',15);
              setCookie("password",'xx00xx',15);
              this.$router.push({path: '/'});
              // this.$store.dispatch('userType', )
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },
      handleTry(){
        this.dialogVisible =true
      },
      dialogConfirm(){
        this.dialogVisible =false;
        setSupport(true);
      },
      dialogCancel(){
        this.dialogVisible = false;
        setSupport(false);
      },
      tosign() {
        this.$router.push("/sign")
      }
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
  .sign{
    font-size: 13px;
    color: #007aff;
  }
  /*.el-form-item:last-child{*/
  /*  margin-bottom: 0;*/
  /*}*/
</style>
