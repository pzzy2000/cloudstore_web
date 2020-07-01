<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>{{titMsg}}</span>
      </div>
      <el-form :inline="true" :model="userForm" size="small" label-width="130px" style="margin-top: 20px" ref="userForm" :rules="rules">
        <el-form-item label="客户名称：" prop="name">
          <el-input-dispatcher style="width: 214px" v-model="userForm.name" placeholder="客户名称"></el-input-dispatcher>
        </el-form-item>
        <br />
        <el-form-item label="客户电话：" prop="phone">
          <el-input-dispatcher style="width: 214px" v-model="userForm.phone" placeholder="客户电话"></el-input-dispatcher>
        </el-form-item>
        <br />
        <el-form-item style="display: block; text-align: right">
          <el-button size="mini" type="primary" v-show="rwDispatcherState == 'write'">提交</el-button>
          <el-button size="mini" v-show="operaType == 'add'" @click="resetForm('userForm')">重置</el-button>
          <el-button size="mini" @click="backLastpage">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
    export default {
      name: "adduser",
      provide() {
        return {
          rwDispatcherProvider: this
        }
      },
      data() {
        function checkPhone(rule,value,callback){
          if(/^1[34578]\d{9}$/.test(value) == false){
            callback(new Error("请输入正确的手机号"));
          }else{
            callback();
          }
        }
        return {
          userForm: {},
          titMsg: '',
          rwDispatcherState: 'write',
          operaType: '',
          rules: {
            name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
            phone: [
              { required: true, message: '请输入客户电话', trigger: 'blur' },
              { validator: checkPhone, trigger: 'blur' }
            ]
          }
        }
      },
      created() {
        switch (this.$route.query.operaType){
          case "add": this.titMsg = "添加客户";
            break;
          case "read": this.titMsg = "查看客户";
            break;
          case "edit": this.titMsg = "编辑客户";
            break;
        }
        this.rwDispatcherState = this.$route.query.rds;
        this.operaType = this.$route.query.operaType;
      },
      methods: {
        backLastpage() {
          this.$router.go(-1);
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.$message({
            message: '重置成功',
            type: 'success',
            duration: 800
          });
        }
      }
    }
</script>

<style scoped>

</style>
