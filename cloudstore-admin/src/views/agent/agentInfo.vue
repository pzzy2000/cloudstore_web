<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-divider content-position="left"><i class="el-icon-search"></i>代理商基本信息</el-divider>
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
          <el-form-item>
            <el-button type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

  </div>
</template>

<script>
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
            name: '1111',
            address: '2222',
            detailAddress: '2323232',
            sysSupplierRankId: '123123',
            phone: '123123'
          },
          rwDispatcherProvider: 'read'
        }
      }
    }
</script>

<style scoped>

</style>
