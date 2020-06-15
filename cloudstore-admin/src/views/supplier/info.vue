<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>
          <!--基本信息--></span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="baseinfo" ref="baseinfoFrom" size="small" label-width="130px">
          <el-divider content-position="left"><i class="el-icon-search"></i> 供应商信息</el-divider>
          <el-form-item label="供应商名字：" required>
            <el-input-dispatcher style="width: 580px" v-model="baseinfo.name" placeholder="供应商名字"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="联系电话：" required>
            <el-input-dispatcher style="width: 214px" v-model="baseinfo.phone" placeholder="供应商名字"></el-input-dispatcher>
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-search"></i> 店铺信息</el-divider>
          <el-form-item label="店铺名字：" required>
            <el-input-dispatcher style="width: 580px" v-model="baseinfo.shopName" placeholder="店铺名字"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="店铺告示：" style="width: 100%;" required>
            <el-input-dispatcher style="width: 930px" v-model="baseinfo.notice" placeholder="店铺告示"></el-input-dispatcher>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-divider content-position="left"><i class="el-icon-search"></i> 营业执照</el-divider>
        <el-form :inline="true" :model="blicense" size="small" label-width="130px">
          <el-form-item label="执照名称：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.licenseName" placeholder="执照名称"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="信用代码：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.creditCode" placeholder="信用代码"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="员工人数：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.introduce" placeholder="员工人数"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="简介：" style="width: 100%;" required>
            <el-input-dispatcher style="width: 930px" v-model="blicense.introduce" placeholder="简介"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="主营品牌：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.brand" placeholder="主营品牌"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="主营产品：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.brand" placeholder="主营产品"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="成立时间：" required>
            <el-date-picker-dispatcher type="date" placeholder="成立时间" v-model="blicense.startTime" style="width: 214px"></el-date-picker-dispatcher>
          </el-form-item>

          <el-form-item label="电话：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.phone" placeholder="电话"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="邮箱：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.email" placeholder="邮箱"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="注册资本：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.phone" placeholder="注册资本"></el-input-dispatcher>
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="法人：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.legalPerson" placeholder="法人"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="证件类型：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.legalPerson" placeholder="证件类型"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="证件号码：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.legalPerson" placeholder="证件号码"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="证件照片：" required>
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" limit="4"
              :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <br />
          <el-form-item label="营业执照照片：" required>
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview"
              limit="4" :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div>
          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(true)"
           :style="{ display: shownUpdateSubelButton}"
            size="small">
            更新
          </el-button>

          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(false)"
           :style="{ display: shownUpdateButton}"
            size="small">
            取消
          </el-button>

          <el-button style="float: right;margin-bottom: 10px; margin-right: 20px;"
          :style="{ display: shownUpdateButton}"
            @click="savebaseinfo('baseinfoFrom')" type="primary"
            size="small">
            提交
          </el-button>

        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
  import {
    searchSupplierDetail
  } from '@/api/supplier'

  export default {
    name: "supplierBaseinfo",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        rwDispatcherState: 'write',
        baseinfo: {
          name:""
        },
        blicense: {},
        shownUpdateButton:"none",
        shownUpdateSubelButton:"",
        supplierId: typeof(this.$route.query.supplierId) == 'undefined' ? null : this.$route.query.supplierId,

      }
    },
     mounted() {
                // mounted在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
            },
    created() {
      this.rwDispatcherState = "read" //write  read
      // this.baseinfo.name="www";
      this.blicense.startTime = "2012-02-12"
      this.loadInfo();
    },

    mounted() {

    },
    methods: {

      shownUpdateSbutton(action){
        if(action ==true){
        this.shownUpdateButton=""
        this.shownUpdateSubelButton="none"
        this.rwDispatcherState = "write" //write  read
        }else{
          this.shownUpdateButton="none"
          this.shownUpdateSubelButton=""
          this.rwDispatcherState = "read" //write  read
        }

      },

      async loadInfo() {
        await searchSupplierDetail({
          supplierId: this.supplierId
        }).then(response => {
          if (response.result.result.supplier != null) {
            this.baseinfo.name = response.result.result.supplier.name;
            this.baseinfo.phone = response.result.result.supplier.phone;
            console.log(" this.baseinfo.name  " + this.baseinfo.name);
          }
        });
      },

      savebaseinfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style>
</style>
