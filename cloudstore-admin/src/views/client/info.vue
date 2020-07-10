<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" label="用户详情" router="true">用户详情</el-menu-item>
      <el-menu-item index="2" label="编辑资料">编辑资料</el-menu-item>
      <el-menu-item index="3" label="登陆日志">登陆日志</el-menu-item>
    </el-menu>
    <div style="margin: 20px 20px 0 20px">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "userinfo",
    data() {
      return {
        activeIndex: '1'
      }
    },
    created() {
      if (this.$route.query.type == '1'){
        this.activeIndex = '1';
      }else if(this.$route.query.type == '2'){
        this.activeIndex = '2';
      }else if(this.$route.query.type == '3') {
        this.activeIndex = '3';
      }else {
        this.activeIndex = '1';
      }
    },
    methods: {
      handleSelect(tab, event) {
        //将新的值和url放在一起拼成一个完整的路径
        this.$router.push({
          path: '/sys/client/userinfo',
          query: {
            type: tab
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-menu{
    margin-bottom: 20px;
  }
  .el-menu.el-menu-demo{
    border: none;
  }
  .el-menu-item{
    width: 150px;
    height: 40px;
    margin-left: 20px;
    line-height: 40px;
    text-align: center;
  }
  .el-menu .el-menu-item:hover{
    color: #1abc9c;
  }
  .el-menu .el-menu-item span{
    color: red;
  }
  .el-menu--horizontal>.el-menu-item.is-active{
    border: none;
    background-color: #1abc9c !important;
    color: white;
  }
  .el-menu--horizontal>.el-menu-item.is-active span{
    color: white;
  }
  .el-menu-item{
    border-bottom-color: #e4e4e4 !important;
    border: 1px solid #e4e4e4;
  }
  .el-step.is-vertical >>> .el-step__icon{
    width: 12px !important;
    height: 12px !important;
  }
  .el-step.is-vertical >>> .el-step__line{
    display: none !important;
  }
  .el-step.is-vertical >>> .el-step__main{
    padding: 0;
  }
  .el-step.is-vertical >>> .el-step__head.is-finish {
    color: #c0c4cc !important;
    border-color: #c0c4cc !important;
  }
  .el-step.is-vertical >>> .el-step__title.is-finish {
    color: #c0c4cc;
  }
  .el-step.is-vertical >>> .el-step__description.is-finish {
    color: #c0c4cc;
  }
</style>
