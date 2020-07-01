<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px">
      <el-divider content-position="left"><i class="el-icon-search"></i>添加物流公司</el-divider>
      <el-form label-width="150px" :model="logisticsList" :rules="rules" ref="logisticsList">
        <el-form-item label="物流公司：" prop="name">
          <el-input-dispatcher placeholder="请输入物流公司" v-model="logisticsList.name" style="width: 350px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="物流公司编码：" prop="code">
          <el-input-dispatcher placeholder="请输入物流公司编码" v-model="logisticsList.code" style="width: 350px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="addLogis('logisticsList')" v-show="rwDispatcherState === 'write'" size="mini">提交</el-button>
          <el-button @click="resetForm('logisticsList')" v-show="optType == 'save'" size="mini">重置</el-button>
          <el-button v-show="rwDispatcherState === 'write'" @click="backLastpage" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getOnelogis, addlogis } from '@/api/tracking';
    export default {
      name: "addlogistics",
      provide() {
        return {
          rwDispatcherProvider: this
        }
      },
      data() {
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
        var validateSurnmae = (rule, value, callback) => {
          let reg = /^[A-Za-z]+$/
          if (!reg.test(value)) {
            callback(new Error("只能输入英文"))
          } else {
            callback()
          }
        };
        return {
          logisticsList: {
            name: '',
            code: ''
          },
          rwDispatcherState: 'write',
          rules: {
            name: [
              {required: true, message: '请输入公司名称', trigger: 'blur'},
              { min: 3, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'},
              { validator: validateInput, trigger: 'blur' }
            ],
            code: [
              {required: true, message: '请输入公司编码', trigger: 'blur'},
              { min: 3, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
              { validator: validateSurnmae, trigger: 'blur' }
            ],
          },
          logisId: '',
          optType: ''
        }
      },
      created() {
        if (this.$route.query.rds !== undefined){
          this.logisticsList.name = this.$route.query.name;
          this.logisticsList.code = this.$route.query.code;
        }
        this.optType = this.$route.query.optType;
      },
      methods: {
        addLogis(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let obj = {
                name: this.logisticsList.name,
                code: this.logisticsList.code,
                optType: this.$route.query.optType
              }
              if (this.$route.query.id !== undefined){
                obj.id = this.$route.query.id
              }
              if (this.$route.query.optType == "save"){
                addlogis(obj).then(res => {
                  if (res.result.code == 0){
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    });
                    this.$router.push("/sys/tracking/list")
                  }
                })
              }else {
                addlogis(obj).then(res => {
                  if (res.result.code == 0){
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                    this.$router.push("/sys/tracking/list")
                  }
                })
              }
            }else {
              return false;
            }
          })
        },
        backLastpage() {
          this.$router.push("/sys/tracking/list")
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.$message({
            message: '重置成功',
            type: 'success',
            duration: 800
          });
        }
        // toggleRds() {
        //   if (this.rwDispatcherState === 'write'){
        //     this.rwDispatcherState = "read";
        //   }else {
        //     this. rwDispatcherState = "write";
        //   }
        // }
      }
    }
</script>

<style scoped>

</style>
