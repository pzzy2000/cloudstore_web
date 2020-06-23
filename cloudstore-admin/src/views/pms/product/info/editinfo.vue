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
          <el-form-item label="退货规则：" prop="returnRuleId">
            <el-select-dispatcher v-model="baseinfo.returnRuleId" id="returnRuleId" placeholder="退货规则">

            </el-select-dispatcher>
          </el-form-item>

          <el-form-item label="运费规则：" prop="freightRuleId">
            <el-select-dispatcher v-model="baseinfo.freightRuleId" id="freightRuleId">
            </el-select-dispatcher>
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
          <el-form-item required prop="cityId">
            <el-select-dispatcher v-model="baseinfo.cityId" :options="category1" remote placeholder="市" :loading="loading"
              v-on:change="selectDistrict($event, 2)">
              <el-option v-for="item in district.city" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item required prop="areaId">
            <el-select-dispatcher v-model="baseinfo.areaId" :options="category1" remote placeholder="区/县" :loading="loading"
              v-on:change="selectDistrict($event, 3)">
              <el-option v-for="item in district.area" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>

          <el-form-item label="副标题：" required prop="goodsSubtitle">
            <el-input-dispatcher v-model="baseinfo.goodsSubtitle"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="商品品牌：" prop="goodsBrand">
            <el-input-dispatcher v-model="baseinfo.goodsBrand"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="商品货号：" prop="goodsNumber">
            <el-input-dispatcher v-model="baseinfo.goodsNumber"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="商品售价：" required prop="salePrice">
            <el-input-dispatcher v-model="baseinfo.salePrice"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="市场价：" required prop="martPrice">
            <el-input-dispatcher v-model="baseinfo.martPrice"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="计量单位：" prop="unit">
            <el-input-dispatcher v-model="baseinfo.unit"></el-input-dispatcher>
          </el-form-item>


        </el-form>
        <div style="text-align:center">

          <el-button style="float: none;margin-bottom: 10px;" @click="addProduct" :style="{ display: button.add}" size="small">
            增加
          </el-button>

          <el-button style="float: none;margin-bottom: 10px;" @click="resetProduct" :style="{ display: button.reset}"
            size="small">
            重置
          </el-button>


          <el-button style="float: none;margin-bottom: 10px;" @click="updateProduct" :style="{ display: button.update}"
            size="small">
            更新
          </el-button>

          <el-button style="float: none;margin-bottom: 10px;" @click="cancelList" :style="{ display: button.cancel}"
            size="small">
            返回
          </el-button>

        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {
    msg
  } from '@/api/iunits';

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
    name: "goodBaseinfo",
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
          cancel: 'none',
          reset: "none"
        },
        goodsId: null,
        rwDispatcherState: 'write',
      }
    },
    mounted() {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  mounted 2");
      // mounted在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
    },

    beforeMount() {},


    created() {
      this.reload();

    },

    mounted() {
      this.reload()
    },


    watch: {
      '$route'(to, from) {
        console.log('to=' + to)
        this.reload()
      }
    },
    methods: {

      showinfoBut() {
        this.button.add = "none";
        this.button.reset = "none";
        this.button.update = "none";
        this.button.cancel = "none";
      },

      showAddBut() {
        this.button.add = "";
        this.button.reset = "";
        this.button.update = "none";
        this.button.cancel = "none";
      },
      showUpdateBut() {
        this.button.add = "none";
        this.button.reset = "none";
        this.button.update = "";
        this.button.cancel = "";
      },
      reload() {
        let action = this.$route.query.action; //1:增加 2：编辑 0:查看,默认是查看

        action = parseInt((typeof(action) == 'undefined') ? "1" : action);
        switch (action) {
          case 0:
            this.rwDispatcherState = "read"; //write  read
            this.goodsId = (typeof(this.$route.query.goodsId) == 'undefined') ? -1 : this.$route.query.goodsId;
            this.showinfoBut();
            break;
          case 1:
            this.rwDispatcherState = "write"; //write  read
            this.showAddBut();
            this.baseinfo = {};
            break;
          case 2:
            this.rwDispatcherState = "write";
            this.goodsId = (typeof(this.$route.query.goodsId) == 'undefined') ? -1 : this.$route.query.goodsId;
            this.showUpdateBut();
            break;
        }
        if (action == 2 || action == 0) {
          this.loadInfo();
        }
        this.searchRootCategory();
        this.selectRootDistrict();
      },


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



      async loadInfo() {

        if (this.goodsId === null) {
          msg("系统错误,没有发现商品信息[id]");
          return;
        };
        let goodsId_ = this.goodsId;
        console.log("load  goods info  goodsid : " + goodsId_);
        await getProduct({
          id: goodsId_
        }).then(response => {
          if (response) {
            this.baseinfo = response.result.result;
          } else {
            msg("系统错误,获得商品信息错误");
          }

        });
      },

      cancelList() {
        if (window.history.length > 1) {
          this.$router.back()
        } else {
          this.$router.push('/sys/goods/list')
        }

      },

      updateProduct(){
         msg("更新");
      },

      resetProduct(){
         msg("重置form");
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
    }
  }
</script>

<style>
</style>
