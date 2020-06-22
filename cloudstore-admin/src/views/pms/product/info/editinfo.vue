<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>
          <!--基本信息--></span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="baseinfo" ref="baseinfoFrom" size="small" label-width="130px">
          <el-divider content-position="left"><i class="el-icon-search"></i>商品基本信息</el-divider>
          <el-form-item label="商品名称：" required prop="goodsName">
            <el-input-dispatcher v-model="baseinfo.goodsName" style="width: 650px;"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="商品品牌："  prop="goodsBrand">
            <el-input v-model="baseinfo.goodsBrand"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="商品货号：" prop="goodsNumber">
            <el-input v-model="baseinfo.goodsNumber"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="商品售价：" required prop="salePrice">
            <el-input v-model="baseinfo.salePrice"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="市场价：" required prop="martPrice">
            <el-input v-model="baseinfo.martPrice"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="计量单位：" prop="unit">
            <el-input v-model="baseinfo.unit"></el-input>
          </el-form-item>


        </el-form>
        <div>

          <el-button style="float: right;margin-bottom: 10px;" @click="addProduct" :style="{ display: button.add}" size="small">
            增加
          </el-button>

          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(true)" :style="{ display: button.update}"
            size="small">
            更新
          </el-button>

          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(false)" :style="{ display: button.cancel}"
            size="small">
            取消
          </el-button>

        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {
    fetchListWithChildren
  } from '@/api/productCate';

  import {
    fetchDistrictList
  } from '@/api/sysdict';

  import {
    getProduct,
    createProduct
  } from '@/api/product';

  export default {
    name: "supplierBaseinfo",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        // baseInfo: Object.assign({}, defaultBaseInfo),
        loading: false,
        baseinfo: {
          id: null
        },
        category: {
          one: [],
          two: [],
          three: []
        },
        district: {
          province: [],
          city: [],
          area: []
        },
        button: {
          update: "none",
          add: "none",
          cancel: 'none'
        },
        rwDispatcherState: 'write',
      }
    },
    mounted() {
      // mounted在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
    },
    created() {
      let action = this.$route.query.action; //1:增加 2：编辑 0:查看,默认是查看
      action = (typeof(action) == 'undefined') ? 1 : action;
      switch (action) {
        case 0:
          this.rwDispatcherState = "read"; //write  read
          break;
        case 1:
          this.rwDispatcherState = "write"; //write  read
          this.button.add = "";
          break;
        case 2:
          this.rwDispatcherState = "write";
          break;

      }
      // if (action == 2) {
      //   this.loadInfo();
      // }
      this.loadInfo();
      // this.searchRootCategory();
      // this.selectRootDistrict();
    },

    mounted() {

    },
    methods: {
      searchRootCategory() {
        this.loading = true;
        fetchListWithChildren(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.category.one = list;
        });
      },
      selectRootDistrict() {
        this.loading = true;
        fetchDistrictList({
          codeType: 'province',
          parentId: 0
        }).then(response => {
          this.loading = false;
          let list = response.result.result;

          this.district.province = list.records;
        });
      },
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
        await getProduct({
          id: this.$route.query.productId
        }).then(response => {
          if (response != null) {
            console.log(response)
            // this.baseinfo.supplierName = response.result.result.supplier.name;
            // this.baseinfo.phone = response.result.result.supplier.phone;
            // this.baseinfo.shopName = response.result.result.shop.shopName;
            // this.baseinfo.notice = response.result.result.shop.notice;
            // this.blicense.licenseName = response.result.result.supplierMainInfo.licenseName;
            // this.blicense.creditCode = response.result.result.supplierMainInfo.creditCode;
            // this.blicense.workNumber = response.result.result.supplierMainInfo.workNumber;
            // this.blicense.introduce = response.result.result.supplierMainInfo.introduce;
            // this.blicense.brand = response.result.result.supplierMainInfo.brand;
            // this.blicense.startTime = response.result.result.supplierMainInfo.startTime;
            // this.blicense.phone = response.result.result.supplierMainInfo.phone;
            // this.blicense.email = response.result.result.supplierMainInfo.email;
            // this.blicense.registerCapital = response.result.result.supplierMainInfo.registerCapital;
            // this.blicense.legalPerson = response.result.result.supplierMainInfo.legalPerson;
            // this.blicense.cardType = response.result.result.supplierMainInfo.cardType;
            // this.blicense.cardNo = response.result.result.supplierMainInfo.cardNo;
          }
        });
      },

      addProduct() {
        this.$refs['baseinfoFrom'].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              createProduct(this.baseinfo).then(response => {
                if (!response) return;
                this.$refs['baseinfoFrom'].resetFields();
                this.$message({
                  message: '增加商品成功',
                  type: 'success',
                  duration: 1000
                });
                //this.$router.go(0)
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

      // savebaseinfo(formName) {
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.$confirm('是否提交数据', '提示', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         type: 'warning'
      //       }).then(() => {
      //         saveSupplierInfo(this.baseinfo, this.blicense).then(response => {
      //           this.$message({
      //             message: '修改成功',
      //             type: 'success',
      //             duration: 1000
      //           });
      //           this.$router.go(0)
      //         });
      //       });
      //     } else {
      //       this.$message({
      //         message: '验证失败',
      //         type: 'error',
      //         duration: 1000
      //       });
      //       return false;
      //     }
      //   });
      // },


    }
  }
</script>

<style>
</style>
