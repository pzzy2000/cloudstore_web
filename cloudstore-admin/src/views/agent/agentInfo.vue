<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-divider content-position="left"><i class="el-icon-search"></i> {{titleMsg}}</el-divider>
        <el-form :inline="true" :model="baseinfoForm" ref="baseinfoFrom" size="small" label-width="130px" :rules="rules">
          <el-form-item label="代理商名字：" prop="name">
            <el-input-dispatcher v-model="baseinfoForm.name" />
          </el-form-item>
          <br />
          <el-form-item label="地址：" prop="address">
            <el-input-dispatcher v-model="baseinfoForm.address" />
          </el-form-item>
          <br />
          <el-form-item label="详细地址：" prop="detailAddress">
            <el-input-dispatcher v-model="baseinfoForm.detailAddress" />
          </el-form-item>
          <br />
          <el-form-item label="所属账号：" prop="phone">
            <el-input-dispatcher v-model="baseinfoForm.phone" />
          </el-form-item>
          <br />
          <div style="overflow: hidden">
            <el-button style="float: right" size="mini" @click="toLastpage">返回</el-button>
            <el-button style="float: right; margin-right: 20px" size="mini" @click="resetForm('baseinfoFrom')" v-show="optType == 'add'">重置</el-button>
            <el-button type="primary" style="float: right; margin-right: 20px" size="mini" v-show="rwDispatcherState == 'write'&&titleMsg == '添加代理商'" @click="submitAgent('baseinfoFrom')">提交</el-button>
            <el-button type="primary" style="float: right; margin-right: 20px" size="mini" v-show="rwDispatcherState == 'write'&&titleMsg == '编辑代理商'">完成</el-button>
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
            phone: ''
          },
          rwDispatcherState: 'write',
          titleMsg: '',
          optType: '',
          rules: {
            name: [{ required: true, message: '请输入代理商名字', trigger: 'blur' }],
            address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
            detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
            phone: [{ required: true, message: '请输入所属账号', trigger: 'blur' }]
          }
        }
      },
      created() {
        this.optType = this.$route.query.type;
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
        },
        submitAgent(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert("提交事件")
            }
          })
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
