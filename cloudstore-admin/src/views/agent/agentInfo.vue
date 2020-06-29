<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-divider content-position="left"><i class="el-icon-search"></i> {{titleMsg}}</el-divider>
        <el-form :inline="true" :model="baseinfoForm" ref="baseinfoFrom" size="small" label-width="130px">
          <el-form-item label="代理商名字：">
            <el-input-dispatcher v-model="baseinfoForm.name" />
          </el-form-item>
          <br />
          <el-form-item label="地址：">
            <el-input-dispatcher v-model="baseinfoForm.address" />
          </el-form-item>
          <br />
          <el-form-item label="详细地址：">
            <el-input-dispatcher v-model="baseinfoForm.detailAddress" />
          </el-form-item>
          <br />
          <el-form-item label="代理商等级：">
            <el-input-dispatcher v-model="baseinfoForm.sysSupplierRankId" />
          </el-form-item>
          <br />
          <el-form-item label="所属账号：">
            <el-input-dispatcher v-model="baseinfoForm.phone" />
          </el-form-item>
          <br />
          <div style="overflow: hidden">
            <el-button style="float: right" size="mini" @click="toLastpage">返回</el-button>
            <el-button type="primary" style="float: right; margin-right: 20px" size="mini" v-show="rwDispatcherState == 'write'&&titleMsg == '添加代理商'">提交</el-button>
            <el-button type="primary" style="float: right; margin-right: 20px" size="mini" v-show="rwDispatcherState == 'write'&&titleMsg == '编辑代理商'">编辑</el-button>
          </div>
        </el-form>
      </div>
    </el-card>

  </div>
</template>

<script>
  import { getOneagent } from '@/api/agent'
    export default {
      name: "agent-info",
      provide () {
        return {
          rwDispatcherProvider: this
        }
      },
      data() {
        return {
          baseinfoForm: {
            name: '',
            address: '',
            detailAddress: '',
            sysSupplierRankId: '',
            phone: ''
          },
          rwDispatcherState: 'write',
          titleMsg: ''
        }
      },
      created() {
        if (this.$route.query.agentId !== undefined){
          this.getoneAgent();
        }
        this.rwDispatcherState = this.$route.query.rds;
        switch (this.$route.query.type) {
          case 'add': this.titleMsg = '添加代理商';
            break;
          case 'read': this.titleMsg = '查看代理商';
            break;
          case 'update': this.titleMsg = '编辑代理商';
            break;
          default: this.titleMsg = '添加代理商';
            break;
        }
      },
      methods: {
        getoneAgent() {
          getOneagent({id: this.$route.query.agentId}).then(res => {
            console.log(res);
          })
        },
        toLastpage() {
          this.$router.push('/sys/agent/list');
        }
      }
    }
</script>

<style scoped>

</style>
