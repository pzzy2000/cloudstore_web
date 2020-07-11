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
          <el-form-item label="审核状态：" prop="status">
            <el-input-dispatcher v-model="baseinfoForm.msg" />
          </el-form-item>
          <br />
          <el-form-item label="地址：" prop="address">
            <el-input-dispatcher v-model="baseinfoForm.address" />
          </el-form-item>
          <br />
          <el-form-item label="商铺名称：" prop="shopName">
            <el-input-dispatcher v-model="baseinfoForm.shopName" />
          </el-form-item>
          <br />
          <el-form-item label="证件类型：" prop="cardType">
            <el-input-dispatcher v-model="baseinfoForm.cardType" />
          </el-form-item>
          <br />
          <el-form-item label="证件号码：" prop="cardNo">
            <el-input-dispatcher v-model="baseinfoForm.cardNo" />
          </el-form-item>
          <br />
          <el-form-item label="详细住址：" prop="detailAddress">
            <el-input-dispatcher v-model="baseinfoForm.detailAddress" />
          </el-form-item>
          <br />
          <el-form-item label="身份证正反面：">
            <el-table :data="baseinfoForm.goodsPhotos">
              <el-table-column width="100" align="center">
                <template slot-scope="scope">
                  <el-image :src="scope.row.url"></el-image>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div style="overflow: hidden">
            <el-button size="small" style="float: right" @click="backpage">返回</el-button>
            <el-button style="float: right" size="small" @click="refused" v-show="isshow">拒绝</el-button>
            <el-button type="primary" style="float: right; margin-right: 20px" size="small" @click="submitApply" v-show="isshow">审核通过</el-button>
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
          goodsPhotos: []
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
          if (this.baseinfoForm.provinceBean == null){
            this.baseinfoForm.address = ''
          }else{
            this.baseinfoForm.address = this.baseinfoForm.provinceBean.name + ' ' + this.baseinfoForm.cityBean.name + ' ' + this.baseinfoForm.areaBean.name;
          }
          console.log(this.baseinfoForm.address)
          switch (this.baseinfoForm.status) {
            case 0: this.baseinfoForm.msg = '待审核';
              break;
            case 1: this.baseinfoForm.msg = '已通过';
              break;
            case 2: this.baseinfoForm.msg = '已拒绝';
              break;
          }
        })
      },
      refused() {
        verified({status: 2, id: this.$route.query.id}).then(res => {
          console.log(res);
          if (res.result.code == 0) {
            this.$message({
              message: '拒绝成功',
              type: 'success',
              duration: 800
            });
          }
        })
      },
      submitApply() {
        verified({status: 1, id: this.$route.query.id}).then(res => {
          console.log(res);
          if (res.result.code == 0) {
            this.$message({
              message: '通过成功',
              type: 'success',
              duration: 800
            });
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
      },
      backpage() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>
  .el-table >>> .el-table__header-wrapper{
    display: none;
  }
  .el-table td, .el-table th.is-leaf{
    border-bottom: none !important;
  }
</style>
