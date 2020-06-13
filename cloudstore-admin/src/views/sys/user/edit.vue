<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>更新用户信息</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="userinfo" size="small" label-width="140px">
          <el-form-item label="用户名字：">
            <el-input-dispatcher style="width: 214px" v-model="userinfo.name" placeholder="用户名字"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="登录账号：">
            <el-input style="width: 214px;"  v-model="userinfo.access" placeholder="用户名字"></el-input>
          </el-form-item>
          <el-form-item label="注册手机：">
            <el-input style="width: 214px" v-model="userinfo.phone" placeholder="用户名字" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="用户类型：">
            <el-input style="width: 214px" v-model="userinfo.userType" placeholder="用户名字" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="用户状态：">
            <el-input style="width: 214px" v-model="userinfo.status" placeholder="用户名字" disabled=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>

        <span>&nbsp;</span>
        <el-button
          style="float: right;margin-right: 15px"
          @click="toback()"
          size="small">
          返回
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          :style="{ display: visibleUpdate}"
          @click="handleResetSearch()"
           type="primary"
          size="small">
          更新
        </el-button>
      </div>
    </el-card>
  </div>
</template> 


<script>
  export default {
     provide () {
        return {
          rwDispatcherProvider: this
        }
      },
    data() {
      editinfo: this.$route.query.info
      // pageNum: this.$route.query.pageNum
      // pageSize: this.$route.query.pageSize
      return {
         rwDispatcherState: 'write',
         visibleUpdate:'',// none 隐藏
        userinfo: {
          name: '',
          access: '',
          phone: '',
          userType: null
        },
        editinfo: this.$route.query.info,
        pageNum: this.$route.query.pageNum,
        pageSize:this.$route.query.pageSize
      }
    },

    created() {
      // console.log('from  user list ... ', " pageNum " + this.pageNum + " pageSize " + this.pageSize + "  user id " + this.userinfo.id);
      // console.log('ss',this.$route.query.info.name);
      // this.userinfo =this.$route.query.info;
      this.userinfo.name ='111';
      this.rwDispatcherState="read"//write  read
      this.visibleUpdate="none";

    },

    methods: {
      onSubmit() {
        console.log('submit!');
      },
      toback(){
       
          console.log('submit! '+this.pageSize);
      this.$router.push({path:'/sys/user/list',query: {pageNum:this.pageNum,pageSize:this.pageSize}});
      },
      loadData() {
        this.userinfo.name = '12121212';
      }
    }
  }
</script>

<style>
.elm-container {
    text-align: left;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0 0 8px 5px #00000010;
    padding: 40px 20px;
    width: 768px;
    margin: 20px auto;
    .el-rate, .el-rate__icon {
      height: 40px;
      line-height: 40px;
    }
  }
</style>
