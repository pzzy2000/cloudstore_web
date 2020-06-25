<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px">
      <el-divider content-position="left"><i class="el-icon-search"></i>添加物流公司</el-divider>
      <el-form label-width="150px" style="width: 600px" :model="logisticsList" :rules="rules" ref="logisticsList">
        <el-form-item label="物流公司：" prop="name">
          <el-input-dispatcher placeholder="请输入物流公司" v-model="logisticsList.name"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="物流公司编码：" prop="ide">
          <el-input-dispatcher placeholder="请输入物流公司编码" v-model="logisticsList.ide"></el-input-dispatcher>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addLogis" v-show="rwDispatcherState === 'write'">添加</el-button>
          <el-button v-show="rwDispatcherState === 'write'" @click="toggleRds">取消</el-button>
          <el-button v-show="rwDispatcherState === 'read'" @click="toggleRds">编辑</el-button>
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
          logisticsList: {},
          rwDispatcherState: 'read',
          rules: {
            name: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
            ide: [{required: true, message: '请输入公司编码', trigger: 'blur'}],
          },
          logisId: ''
        }
      },
      created() {
        this.rwDispatcherState = this.$route.query.rds;
        this.logisId = this.$route.query.id;

      },
      methods: {

        addLogis() {
          let obj = {
            name: this.logisticsList.name,
            code: this.logisticsList.ide
          };
          addlogis(obj).then(res => {
            console.log(res);
          })
        },
        toggleRds() {
          if (this.rwDispatcherState === 'write'){
            this.rwDispatcherState = "read";
          }else {
            this. rwDispatcherState = "write";
          }
        }
      }
    }
</script>

<style scoped>

</style>
