<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>{{operaType}}用户信息</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="userinfo" size="small" label-width="140px" ref="userinfo" :rules="rules">
          <el-form-item label="用户名称：" prop="name">
            <el-input-dispatcher style="width: 214px" v-model="userinfo.name" placeholder="用户名称"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="登录名：" prop="access">
            <el-input-dispatcher style="width: 214px;"  v-model="userinfo.access" placeholder="登录名"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="注册电话：" prop="phone">
            <el-input-dispatcher style="width: 214px" v-model="userinfo.phone" placeholder="注册电话"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="用户类型：" prop="userType">
            <el-input-dispatcher style="width: 214px" v-model="userinfo.userType" placeholder="用户类型"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="创建时间：" prop="createDate">
            <el-input-dispatcher style="width: 214px" v-model="userinfo.createDate" placeholder="创建时间"></el-input-dispatcher>
          </el-form-item>
          <br />
<!--          <el-form-item label="审核状态：" prop="status">-->
<!--            <el-input-dispatcher style="width: 214px" v-model="userinfo.status" placeholder="审核状态"></el-input-dispatcher>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <div style="overflow: hidden">
        <el-button
          style="float: right;margin-right: 15px"
          @click="toback()"
          size="small">
          返回
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="resetForm('userinfo')"
          size="small"
          v-show="optType == 'add'">
          重置
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          :style="{ display: visibleUpdate}"
          v-show="rwDispatcherState == 'write'&&operaType == '添加'"
          @click="handleSubmituser()"
          type="primary"
          size="small">
          提交
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          :style="{ display: visibleUpdate}"
          v-show="rwDispatcherState == 'write'&&operaType == '更新'"
          @click="handleUpdateuser()"
          type="primary"
          size="small">
          更新
        </el-button>
      </div>
    </el-card>
  </div>
</template> 

<script>
  import { getOneuser, submitUser } from '@/api/sysuser'
  export default {
     provide () {
        return {
          rwDispatcherProvider: this
        }
      },
    data() {
      // editinfo: this.$route.query.info
      // pageNum: this.$route.query.pageNum
      // pageSize: this.$route.query.pageSize
      function checkSpecialKey(str) {
        var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
        for (var i = 0; i < str.length; i++) {
          if (specialKey.indexOf(str.substr(i, 1)) != -1) {
            return false;
          }
        }
        return true;
      };
      var validateInput = (rule, value, callback) => {
        if (!checkSpecialKey(value)) {
          callback(new Error("不能含有特殊字符！！"));
        } else {
          callback();
        }
      };
      return {
        operaType: '',
        rwDispatcherState: 'write',
        visibleUpdate:'',// none 隐藏
        optType: '',
        userinfo: {
          name: '',
          access: '',
          phone: '',
          userType: ''
        },
        // editinfo: this.$route.query.info,
        pageNum: this.$route.query.pageNum,
        pageSize:this.$route.query.pageSize,
        rules: {
          name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          access: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ]
        }
      }
    },

    created() {
      // console.log('from  user list ... ', " pageNum " + this.pageNum + " pageSize " + this.pageSize + "  user id " + this.userinfo.id);
      // console.log('ss',this.$route.query.info.name);
      // this.userinfo =this.$route.query.info;
      // this.userinfo.name ='111';
      // this.rwDispatcherState="read"//write  read
      // this.visibleUpdate="none";
      if (this.$route.query.type !== 'add') {
        this.getList();
      }
      this.optType = this.$route.query.type;
      this.rwDispatcherState = this.$route.query.rds;
      switch (this.$route.query.type) {
        case 'add': return this.operaType = "添加";
          break;
        case 'update': return this.operaType = "更新";
          break;
        case 'read': return this.operaType = "查看";
          break;
      }
    },
    methods: {
       getList() {
         getOneuser({id: this.$route.query.userId}).then(res => {
           console.log(res);
           if (res.result.code == 0) {
             this.userinfo = res.result.result;
           }
         })
       },
      toback(){
        this.$router.back();
      },
      // loadData() {
      //   this.userinfo.name = '12121212';
      // },
      handleSubmituser() {
         console.log('提交事件');
        // submitUser().then(res => {
        //   console.log(res);
        // })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$message({
          message: '重置成功',
          type: 'success',
          duration: 800
        });
      },
      handleUpdateuser() {
        alert("提交了编辑")
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
    }
    .el-rate, .el-rate__icon {
      height: 40px;
      line-height: 40px;
    }
</style>
