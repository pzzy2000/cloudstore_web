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
            <el-input-dispatcher style="width: 580px" v-model="baseinfo.supplierName" placeholder="供应商名字"></el-input-dispatcher>
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
            <el-input-dispatcher style="width: 214px" v-model="blicense.workNumber" placeholder="员工人数"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="简介：" style="width: 100%;" required>
            <el-input-dispatcher style="width: 930px" v-model="blicense.introduce" placeholder="简介"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="主营品牌：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.brand" placeholder="主营品牌"></el-input-dispatcher>
          </el-form-item>

         <!-- <el-form-item label="主营产品：">
            <el-input-dispatcher style="width: 214px" v-model="blicense.mainProduct" placeholder="主营产品"></el-input-dispatcher>
          </el-form-item> -->

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
            <el-input-dispatcher style="width: 214px" v-model="blicense.registerCapital" placeholder="注册资本"></el-input-dispatcher>
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="法人：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.legalPerson" placeholder="法人"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="证件类型：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.cardType" placeholder="证件类型"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="证件号码：" required>
            <el-input-dispatcher style="width: 214px" v-model="blicense.cardNo" placeholder="证件号码"></el-input-dispatcher>
          </el-form-item>
          <br/>
          <el-form-item label="证件照片：" required>
            <div v-if="rwDispatcherState =='read'">

                <el-image  v-for=" (item,index) in cardPhotos" :src="item.url"  :key='index'  style="width: 150px; height: 150px;margin-right: 20px;">
                     <div slot="placeholder" class="image-slot">
                       加载中<span class="dot">...</span>
                     </div>
                </el-image>

            </div>
            <div v-else>
             <localmulti-upload v-model="cardPhotos"></localmulti-upload>
            </div>
          </el-form-item>
          <br />
          <el-form-item label="营业执照照片：" required>
          <div v-if="rwDispatcherState =='read'">
                    <el-image  v-for=" (item,index) in licensePhotos" :src="item.url"  :key='index'  style="width: 150px; height: 150px;margin-right: 20px;">
                         <div slot="placeholder" class="image-slot">
                           加载中<span class="dot">...</span>
                         </div>
                    </el-image>
          </div>

          <div v-else>
                   <localmulti-upload v-model="licensePhotos"></localmulti-upload>
          </div>
         </el-form-item>

        </el-form>
        <div>
          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(true)" :style="{ display: shownUpdateSubelButton}"
            size="small">
            更新
          </el-button>

          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(false)" :style="{ display: shownUpdateButton}"
            size="small">
            取消
          </el-button>

          <el-button style="float: right;margin-bottom: 10px; margin-right: 20px;" :style="{ display: shownUpdateButton}"
            @click="savebaseinfo('baseinfoFrom')" type="primary" size="small">
            提交
          </el-button>

        </div>
      </div>
    </el-card>
  </div>

</template>

<script>
  import localmultiUpload from '@/components/Upload/localmultiUpload';
  import {
    searchSupplierDetail,saveSupplierInfo
  } from '@/api/supplier' ;

  import{photoUrl} from '@/api/iunits';

  export default {
    name: "supplierBaseinfo",
    components: {
      localmultiUpload
    },
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {

      return {
        // baseInfo: Object.assign({}, defaultBaseInfo),
        updateParams:{
          from:'SysUser'
        },
        baseinfo:{
              supplierName: '',
              phone: '',
              shopName: '',
              notice: ''
        },
        blicense: {
              licenseName: '',
              creditCode: '',
              introduce: '',
              workNumber: '',
              brand: '',
              startTime: '',
              phone: '',
              email: '',
              registerCapital: '',
              legalPerson: '',
              cardType: '',
              cardNo: '',
              cardPhoto:[],
        },
        cardPhotos:[],
        licensePhotos:[],
        rwDispatcherState: 'write',
        shownUpdateButton: "none",
        shownUpdateSubelButton: "",
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

      shownUpdateSbutton(action) {
        if (action == true) {
          this.shownUpdateButton = ""
          this.shownUpdateSubelButton = "none"
          this.rwDispatcherState = "write" //write  read
        } else {
          this.shownUpdateButton = "none"
          this.shownUpdateSubelButton = ""
          this.rwDispatcherState = "read" //write  read
        }

      },

      async loadInfo() {
        await searchSupplierDetail({
          supplierId: this.supplierId
        }).then(response => {
          if (response.result.result.supplier != null) {
           this.baseinfo.supplierName = response.result.result.supplier.name;
           this.baseinfo.phone = response.result.result.supplier.phone;
           this.baseinfo.shopName = response.result.result.shop.shopName;
           this.baseinfo.notice = response.result.result.shop.notice;
           this.blicense.licenseName = response.result.result.supplierMainInfo.licenseName;
           this.blicense.creditCode = response.result.result.supplierMainInfo.creditCode;
           this.blicense.workNumber = response.result.result.supplierMainInfo.workNumber;
           this.blicense.introduce = response.result.result.supplierMainInfo.introduce;
           this.blicense.brand = response.result.result.supplierMainInfo.brand;
           this.blicense.startTime = response.result.result.supplierMainInfo.startTime;
           this.blicense.phone = response.result.result.supplierMainInfo.phone;
           this.blicense.email = response.result.result.supplierMainInfo.email;
           this.blicense.registerCapital = response.result.result.supplierMainInfo.registerCapital;
           this.blicense.legalPerson = response.result.result.supplierMainInfo.legalPerson;
           this.blicense.cardType = response.result.result.supplierMainInfo.cardType;
           this.blicense.cardNo = response.result.result.supplierMainInfo.cardNo;
           this.cardPhotos =response.result.result.supplierMainInfo.cardPhotos;
           this.licensePhotos = response.result.result.supplierMainInfo.licensePhotos;
          }
        });
      },

      savebaseinfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                console.log(this.blicense);
                let  picId=[];
                for(let  i=0; i<this.cardPhotos.length ; i++){
                      let  x = this.cardPhotos[i];
                      picId.push(this.cardPhotos[i].uid);
                }


                this.blicense.cardPhoto = picId;

                let  licensePhotoId=[];
                for(let  i=0; i<this.licensePhotos.length ; i++){
                      let  x = this.licensePhotos[i];
                      licensePhotoId.push(this.licensePhotos[i].uid);
                }
                this.blicense.licensePhoto = licensePhotoId;
                saveSupplierInfo(this.baseinfo,this.blicense).then(response=>{
                  this.cardPhotos =response.result.result.supplierMainInfo.cardPhotos;
                  this.rwDispatcherState="read";
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  // this.$router.go(0)
                  this.$forceUpdate();
                });
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },

      handlePictureCardPreview(){

      },

      handleRemove(){

      },
      dialogVisible(){

      }

    }
  }
</script>

<style>
</style>
