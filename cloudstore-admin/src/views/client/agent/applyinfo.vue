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
          <el-form-item label="申请代理类型：" prop="agentType">
            <el-input-dispatcher v-model="baseinfoForm.AT" />
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
              <el-table-column width="200" align="center">
                <template slot-scope="scope">
                  <el-image :src="scope.row.url" @dblclick="preview(scope.row)"></el-image>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" style="margin-right: 20px" size="small" @click="submitApply" v-show="isshow">审核通过</el-button>
            <el-button style="margin-right: 20px" size="small" @click="refused" v-show="isshow">拒绝</el-button>
            <el-button size="small" @click="backpage" type="primary">返回</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList"/>
  </div>
</template>

<script>
  import { getOneapply, verified } from '@/api/client'
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";
  export default {
    name: "agent-info",
    provide () {
      return {
        rwDispatcherProvider: this
      }
    },
    components: { ElImageViewer },
    data() {
      return {
        baseinfoForm: {
          goodsPhotos: []
        },
        rwDispatcherState: 'read',
        isshow: true,
        showViewer: false,
        srcList: []
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
          switch (this.baseinfoForm.status) {
            case 0: this.baseinfoForm.msg = '待审核';
              break;
            case 1: this.baseinfoForm.msg = '已通过';
              break;
            case 2: this.baseinfoForm.msg = '已拒绝';
              break;
            default: return this.baseinfoForm.msg = "数据读取错误";
              break;
          }
          switch (this.baseinfoForm.agentType) {
            case "leader": this.baseinfoForm.AT = "团长";
              break;
            case "supplier": this.baseinfoForm.AT = "供应商";
              break;
            case "agent": this.baseinfoForm.AT = "代理商";
              break;
            default: this.baseinfoForm.AT = "数据读取错误";
              break;
          }
          try{
            return this.baseinfoForm.address = this.baseinfoForm.provinceBean.name + this.baseinfoForm.cityBean.name + this.baseinfoForm.areaBean.name + this.baseinfoForm.villageBean.name + this.baseinfoForm.townBean.name;
          }catch (e) {
            return this.baseinfoForm.address = '数据读取出错';
          }finally {
            if (this.baseinfoForm.address !== '数据读取出错'){
              return this.baseinfoForm.detailAddress = this.baseinfoForm.address + this.baseinfoForm.detailAddress;
            }
          }
        })
      },
      preview(row) {
        console.log("+++++++++")
        this.showViewer = true;
        this.srcList[0] = row.url;
      },
      closeViewer() {
        this.showViewer = false
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
            this.$router.go(-1);
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
            this.$router.go(-1);
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
        this.$router.back();
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
