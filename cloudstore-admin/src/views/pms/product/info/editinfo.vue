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
          <br />
          <el-form-item label="退货规则："  prop="returnRuleId">
            <el-select-dispatcher v-model="baseinfo.returnRuleId" id="returnRuleId" placeholder="退货规则">

            </el-select-dispatcher>
          </el-form-item>

          <el-form-item label="运费规则："  prop="freightRuleId">
            <el-cascader v-model="baseinfo.freightRuleId" id="freightRuleId">
            </el-cascader>
          </el-form-item>
          <br />
          <el-form-item label="商品分类：" required prop="categoryOneId">
            <el-select-dispatcher v-model="baseinfo.categoryOneId" :options="category1" remote placeholder="一级分类"
              :loading="loading" v-on:change="seclectCategory($event, 1)">
              <el-option v-for="item in category.one" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item required prop="categoryTwoId">
            <el-select-dispatcher v-model="baseinfo.categoryTwoId" :options="category1" remote v-on:change="seclectCategory($event, 2)"
              placeholder="二级分类" :loading="loading">
              <el-option v-for="item in category.two" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item required prop="categoryThreeId">
            <el-select-dispatcher v-model="baseinfo.categoryThreeId" :options="category1" remote v-on:change="seclectCategory($event, 3)"
              placeholder="三级分类" :loading="loading">
              <el-option v-for="item in category.three" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <br />



          <el-form-item label="地区：" required prop="provinceId">
            <el-select-dispatcher v-model="baseinfo.provinceId" :options="category1" remote placeholder="省" :loading="loading"
              v-on:change="selectDistrict($event, 1)">
              <el-option v-for="item in district.province" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item  required prop="cityId">
            <el-select-dispatcher v-model="baseinfo.cityId" :options="category1" remote placeholder="市" :loading="loading"
              v-on:change="selectDistrict($event, 2)">
              <el-option v-for="item in district.city" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
           <el-form-item  required prop="areaId">
          <el-select-dispatcher v-model="baseinfo.areaId" :options="category1" remote placeholder="区/县" :loading="loading"
            v-on:change="selectDistrict($event, 3)">
            <el-option v-for="item in district.area" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select-dispatcher>
          </el-form-item>

          <el-form-item label="副标题：" required prop="goodsSubtitle">
            <el-input v-model="baseinfo.goodsSubtitle"></el-input>
          </el-form-item>
          <br />
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
      if (action == 2) {
        this.loadInfo();
      }
      this.searchRootCategory();
      this.selectRootDistrict();
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

      seclectCategory(event, item) {

        switch (item) {
          case 1:
            { //一级分类
              this.category.two = [];
              this.category.three = [];
              this.baseinfo.categoryTwoId = '';
              this.baseinfo.categoryThreeId = '';
              fetchListWithChildren(event).then(response => {
                let list = response.result.result;
                this.category.two = list;
              });
              break;
            }
          case 2:
            {
              this.category.three = [];
              this.baseinfo.categoryThreeId = '';
              fetchListWithChildren(event).then(response => {
                let list = response.result.result;
                this.category.three = list;
              });
              break;
            }
        }
        this.$forceUpdate();
      },

      selectDistrict(type, item) {
        switch (item) {
          case 1:
            { //一级分类
              this.district.city = [];
              this.district.area = [];
              this.baseinfo.cityId = '';
              this.baseinfo.areaId = '';
              fetchDistrictList({
                codeType: 'city',
                parentId: type
              }).then(response => {
                let list = response.result.result;
                this.district.city = list.records;
              });
              break;
            }
          case 2:
            {
              this.category.area = [];
              this.baseinfo.areaId = '';
              fetchDistrictList({
                codeType: 'district',
                parentId: type
              }).then(response => {
                let list = response.result.result;
                this.district.area = list.records;
              });
              break;
            }
        }
        this.$forceUpdate();
      },

      category1(e) {

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
        await searchSupplierDetail({
          supplierId: this.supplierId
        }).then(response => {
          if (response.result.result.supplier != null) {
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
