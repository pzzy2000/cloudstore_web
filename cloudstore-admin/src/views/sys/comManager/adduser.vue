<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px">
      <el-form :model="userForm" label-width="120px" size="small" ref="userForm" :rules="rules">
        <el-form-item label="名字：" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入名字" style="width: 350px" />
        </el-form-item>
        <el-form-item label="访问账号：" prop="access" >
          <el-input v-model="userForm.access" placeholder="请输入访问账号" style="width: 350px" />
        </el-form-item>
        <el-form-item label="密码：" prop="password" >
          <el-input v-model="userForm.password" placeholder="请输入密码" style="width: 350px" />
        </el-form-item>
        <el-form-item label="电话：" prop="phone" >
          <el-input v-model="userForm.phone" placeholder="请输入电话" style="width: 350px" />
        </el-form-item>
<!--        <el-form-item label="密码：" prop="password">-->
<!--          <el-input v-model="userForm.password" placeholder="请输入密码" style="width: 350px" />-->
<!--        </el-form-item>-->
        <div style="text-align: center">
          <el-button type="primary" size="small" @click="subForm('userForm')">提 交</el-button>
          <el-button size="small" @click="resetForm('userForm')">重 置</el-button>
          <el-button size="small" @click="toback">返 回</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {adduser, getAnuser, upduser} from '@/api/sysManager'
  export default {
    name: "adduser",
    data() {
      return {
        userForm: {
          name: '',
          phone: '',
          access:'',
          password: ''
        },
        rules: {
          name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
          access:[{ required: true, message: '请输入访问账号', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {min: 6, max: 12, message: "长度在6到12个字符", trigger: 'blur'}
          ],
          phone: [
            { required: true, message: '请输入电话', trigger: 'blur' },
            { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '格式不对', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.$route.query.id !== undefined) {
        this.getOneuser();
      }
    },
    methods: {
      getOneuser() {
        getAnuser({id: this.$route.query.id}).then(res => {
          if (res.result.code == 0) {
            this.userForm = res.result.result;
          }
        })
      },
      subForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.userForm)
            this.$confirm('是否提交?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.$route.query.id !== undefined) {
                this.userForm.optType = 'update';
                upduser(this.userForm).then(res => {
                  if (res.result.code == 0) {
                    this.$router.back();
                    this.$message({
                      message: '修改成功',
                      type: 'success',
                      duration: 800
                    })
                  }
                })
              } else {
                this.userForm.optType = 'save';
                adduser(this.userForm).then(res => {
                  if (res.result.code == 0) {
                    this.$router.back();
                    this.$message({
                      message: '添加成功',
                      type: 'success',
                      duration: 800
                    })
                  }
                })
              }
            }).catch(e => e)
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$message({
          message: '重置成功',
          type: 'success',
          duration: 800
        })
      },
      toback() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
