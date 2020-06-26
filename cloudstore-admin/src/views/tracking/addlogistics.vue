<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px">
      <el-divider content-position="left"><i class="el-icon-search"></i>添加物流公司</el-divider>
      <el-form label-width="150px" style="width: 600px" :model="logisticsList" :rules="rules" ref="logisticsList">
        <el-form-item label="物流公司：" prop="name">
          <el-input-dispatcher placeholder="请输入物流公司" v-model="logisticsList.name"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="物流公司编码：" prop="code">
          <el-input-dispatcher placeholder="请输入物流公司编码" v-model="logisticsList.code"></el-input-dispatcher>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addLogis" v-show="rwDispatcherState === 'write'">提交</el-button>
          <el-button v-show="rwDispatcherState === 'write'" @click="backLastpage">取消</el-button>
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
        return {
          logisticsList: {
            name: '',
            code: ''
          },
          rwDispatcherState: 'write',
          rules: {
            name: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
            code: [{required: true, message: '请输入公司编码', trigger: 'blur'}],
          },
          logisId: ''
        }
      },
      created() {
        if (this.$route.query.rds !== undefined){
          this.logisticsList.name = this.$route.query.name;
          this.logisticsList.code = this.$route.query.code;
        }
      },
      methods: {
        addLogis() {
          let obj = {
            name: this.logisticsList.name,
            code: this.logisticsList.code,
            optType: this.$route.query.optType
          }
          if (this.$route.query.id !== undefined){
            obj.id = this.$route.query.id
          }
          addlogis(obj).then(res => {
            if (res.result.code == 0){
              this.$router.push("/sys/tracking/list")
            }
          })
        },
        backLastpage() {
          this.$router.push("/sys/tracking/list")
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
