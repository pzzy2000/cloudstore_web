<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
<!--      <div class="avatar-wrapper">-->
<!--&lt;!&ndash;        <img class="user-avatar" :src="avatar">&ndash;&gt;-->
<!--      </div>-->
      <div style="display: inline-block; float: right; cursor: pointer; color: #1f2d3d">{{userType}}<span style="margin: 0 10px">/</span>{{userName}}
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data() {
    return {
     userType: '',
      userAccont: '',
      userName: ''
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    switch (localStorage.getItem('userType')) {
      case 'supplier': this.userType = "供应商";
        break;
      case 'agent': this.userType = "代理商";
        break;
      case 'platform': this.userType = "平台";
        break;
    }
    this.userAccont = localStorage.getItem('userAccont');
    this.userName = localStorage.getItem('userName');
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.setCookie('loginToken', "", -1);
      this.setCookie('username', "", -1);
      this.setCookie('password', "", -1);
      location.reload()  //为了重新实例化vue-router对象 避免bug
    },
    setCookie(c_name,value,expire) {
      let date=new Date()
      date.setSeconds(date.getSeconds()+expire)
      document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

