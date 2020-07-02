<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-search"></i>
      <span>数据列表</span>
      <el-form ref="levelForm" :model="levelForm" :rules="rules" label-width="120px" style="margin-top: 20px">
        <el-form-item label="等级名字" prop="levelName">
          <el-input-dispatcher v-model="levelForm.levelName" auto-complete="off" style="width: 350px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="等级编码" prop="levelCode">
          <el-input-dispatcher v-model="levelForm.levelCode" auto-complete="off" style="width: 350px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="上架数量" prop="putNumber">
          <el-input-dispatcher v-model="levelForm.putNumber" auto-complete="off" style="width: 350px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleConfirm('levelForm')" size="small" v-show="rwDispatcherState == 'write'">提 交</el-button>
          <el-button @click="resetForm('levelForm')" size="small" v-show="optType == 'add'">重 置</el-button>
          <el-button @click="backLastpage" size="small">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {saveUpdateLevel} from '@/api/agent'
    export default {
      name: "addlevel",
      provide () {
        return {
          rwDispatcherProvider: this
        }
      },
      data() {
        return {
          levelForm: {},
          rules: {
            levelName: [
              { required: true, message: '请输入等级名称', trigger: 'blur' }
            ]
          },
          optType: '',
          rwDispatcherState: 'write'
        }
      },
      created() {
        this.optType = this.$route.query.type;
        this.rwDispatcherState = this.$route.query.rds;
      },
      methods: {
        handleConfirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.$route.query.type == "add"){
                let data = {
                  levelName: this.levelForm.levelName,
                  levelCode: this.levelForm.levelCode,
                  putNumber: this.levelForm.putNumber,
                  optType: 'save',
                };
                saveUpdateLevel(data).then(response=>{
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.dialogVisible = false;
                  this.getList();
                });
              }else{
                let data = {
                  id: this.$route.query.id,
                  levelName: this.levelForm.levelName,
                  levelCode: this.levelForm.levelCode,
                  putNumber: this.levelForm.putNumber,
                  optType: 'update',
                };
                saveUpdateLevel(data).then(response=>{
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.dialogVisible = false;
                  this.getList();
                });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        backLastpage() {
          this.$router.go(-1)
        }
      }
    }
</script>

<style scoped>

</style>
