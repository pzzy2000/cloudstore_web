<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on" :model="signForm" ref="signForm" label-position="left">
        <h2 class="login-title color-main">用户注册</h2>
        <el-form-item prop="name">
          <el-input name="username" type="text" v-model="signForm.name" autoComplete="off" placeholder="请输入名字">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input name="username" type="text" v-model="signForm.phone" autoComplete="off" placeholder="请输入手机号">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" v-model="signForm.password" autoComplete="on" placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input name="username" type="text" v-model="signForm.code" autoComplete="off" placeholder="请输入手机验证码">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleSign">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png';
  import {sign} from '@/api/sign'
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
        signForm: {
          name: '',
          phone: '',
          password: '',
          code: ''
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        dialogVisible:false,
        supportDialogVisible:false
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleSign() {
        this.signForm.access = this.signForm.phone;
        sign(this.signForm).then(res => {
          console.log(res);
          if (res.result.code == 0) {
            this.$message({
              message: '注册成功',
              type: 'success',
              duration: 800
            });
            this.$router.push("/login")
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
    width: 30%;
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
</style>
