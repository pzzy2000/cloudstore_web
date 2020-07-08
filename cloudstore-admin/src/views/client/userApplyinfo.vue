<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-divider content-position="left"><i class="el-icon-search"></i>代理申请详情</el-divider>
        <el-form :inline="true" :model="baseinfoForm" ref="baseinfoFrom" size="small" label-width="130px">
          <el-form-item label="名字：" prop="name">
            <el-input-dispatcher v-model="baseinfoForm.name" />
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
            <el-button style="float: right" size="mini" @click="refused" v-show="isshow">拒绝</el-button>
            <el-button type="primary" style="float: right; margin-right: 20px" size="mini" @click="submitApply" v-show="isshow">审核通过</el-button>
          </div>
        </el-form>
      </div>
    </el-card>

  </div>
</template>

<script>
  import { getOneapply, verified } from '@/api/client'
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
          detailAddress: '',
          phone: ''
        },
        rwDispatcherState: 'read',
        isshow: true
      }
    },
    created() {
      this.getOneapply();
    },
    methods: {
      getOneapply() {
        getOneapply({id: this.$route.query.id}).then(res => {
          console.log(res);
          this.baseinfoForm = res.result.result;
          if (res.result.result.status !== 0) {
            this.isshow = false;
          }
        })
      },
      refused() {
        verified({status: 2, id: this.$route.query.id}).then(res => {
          console.log(res);
        })
      },
      submitApply() {
        verified({status: 1, id: this.$route.query.id}).then(res => {
          console.log(res);
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
