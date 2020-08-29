<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-bottom: 30px">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input style="width: 203px" v-model="listQuery.goodsName" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-input style="width: 203px" v-model="listQuery.goodsBrand" placeholder="商品品牌" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.goodsNumber" placeholder="商品货号" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属供应商：">
            <el-input style="width: 203px" v-model="listQuery.shopName" placeholder="所属供应商" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select v-model="listQuery.categoryOneId" remote placeholder="一级分类" :loading="loading" v-on:change="seclectCategory($event, 1)" clearable>
              <el-option v-for="item in category.one" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.categoryTwoId" remote v-on:change="seclectCategory($event, 2)" placeholder="二级分类" :loading="loading" clearable>
              <el-option v-for="item in category.two" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-select v-model="listQuery.categoryThreeId" remote v-on:change="seclectCategory($event, 3)" placeholder="三级分类" :loading="loading" clearable>-->
          <!--              <el-option v-for="item in category.three" :key="item.id" :label="item.name" :value="item.id">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" @click="backPage" style="float: right">返回</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <!--<el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image v-for=" (item,index) in scope.row.goodsPicesBean.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>-->
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.goodsBean.goodsName | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="商品分类" align="center" :formatter="goodsCategory">
        </el-table-column>
        <el-table-column label="销售价格/市场价" align="center">
          <template slot-scope="scope"> ￥{{scope.row.goodsBean.salePrice}} / ￥{{scope.row.goodsBean.martPrice}}</template>
        </el-table-column>
        <el-table-column label="所属店铺" align="center" :formatter="suppilerShop">
        </el-table-column>
        <el-table-column label="所属供应商" align="center" :formatter="suppiler">
        </el-table-column>
        <el-table-column label="SKU编号" align="center" prop="skuCode">
        </el-table-column>
        <el-table-column label="规格" align="center" prop="skuValue">
        </el-table-column>
        <el-table-column prop="address" label="是否关联" align="center" width="100">
          <template slot-scope="scope" >
            <el-switch v-model="scope.row.joins" :active-value="1" :inactive-value="0" active-color="#409eff" inactive-color="#dcdfe6" @change="changeSwitch($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {getGoodslist, fetchListWithChildren} from '@/api/brokerage';
  import {fetchActivityGoodsLists, inAssogoods, outAssogoods} from '@/api/activity'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "productList",
    data() {
      return {
        category: {
          one: [],
          two: [],
          three: []
        },
        listQuery: Object.assign({}, defaultListQuery),
        list: [],
        total: 0,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }]
      }
    },
    created() {
      this.getList(1);
      this.searchRootCategory();
    },
    activated() {
      this.getList(1);
      this.searchRootCategory();
    },
    watch: {
      selectProductCateValue: function(newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }

      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      },
      changeMsg(data) {
        if (data == null){
          return "数据读取出错"
        }else{
          return data;
        }
      }
    },
    methods: {
      suppilerShop(row, column) {
        try {
          return row.goodsBean.supplierShopBean.shopName;
        } catch (e) {
          return '数据读取错误';
        }
      },
      suppiler(row, column) {
        try {
          return row.goodsBean.supplierBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      goodsCategory(row, column) {
        try {
          if (row.goodsBean.categoryThreeBean !== undefined) {
            return row.goodsBean.categoryOneBean.name + "/" + row.goodsBean.categoryTwoBean.name + "/" + row.goodsBean.categoryThreeBean.name;
          } else {
            return row.goodsBean.categoryOneBean.name + "/" + row.goodsBean.categoryTwoBean.name;
          }
          // return row.goodsBean.categoryOneBean.name + "/" + row.goodsBean.categoryTwoBean.name + "/" + row.goodsBean.categoryThreeBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      propertyBean(row, column) {
        try {
          return row.goodsBean.propertyBean.propertyName;
        } catch (e) {
          return null;
        }
      },
      showAddress(row, column) {
        try {
          return row.goodsBean.provinceBean.name + " " + row.goodsBean.cityBean.name + " " + row.goodsBean.areaBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      addsku(index, row) {
        this.$router.push({path: "/broke/rage/brageinfo", query: {id: row.id}})
      },
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.spData);
        if (spData != null && index < spData.length) {
          return spData[index].value;
        } else {
          return null;
        }
      },
      getList(idx) {
        this.listLoading = true;
        this.listQuery.joins = 0;
        this.listQuery.activityId = this.$route.query.activityid;
        fetchActivityGoodsLists(this.listQuery).then(response => {
          if (response.result.code == 0) {
            this.list = response.result.result.records;
            console.log(this.list);
            this.total = parseInt(response.result.result.total);
          }
          this.listLoading = false;
          if (idx == 0) {
            if (response.result.result.records.length == 0) {
              this.$message({
                message: "暂无数据",
                type: 'warning',
                duration: 800
              })
            }else {
              this.$message({
                message: "查询成功",
                type: 'success',
                duration: 800
              })
            }
          }
          if (idx == 2) {
            this.$message({
              message: "重置成功",
              type: 'success',
              duration: 800
            })
          }
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList(0);
      },
      searchRootCategory() {
        this.loading = true;
        fetchListWithChildren(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.category.one = list;
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList(1);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList(2);
      },
      backPage() {
        this.$router.go(-1);
      },
      seclectCategory(event, item) {
        switch (item) {
          case 1:
          { //一级分类
            this.category.two = [];
            this.category.three = [];
            if (this.listQuery.categoryTwoId !== undefined) {
              this.$set(this.listQuery, 'categoryTwoId', '');
              this.$set(this.listQuery, 'categoryThreeId', '');
            }
            fetchListWithChildren(event).then(response => {
              let list = response.result.result;
              this.category.two = list;
            });
            break;
          }
          case 2:
          {
            this.category.three = [];
            this.$set(this.listQuery, 'categoryThreeId', '');
            fetchListWithChildren(event).then(response => {
              let list = response.result.result;
              this.category.three = list;
            });
            break;
          }
        }
        this.$forceUpdate();
      },
      changeSwitch(idx, row) {
        inAssogoods({
          activityId: this.$route.query.activityid,
          goodsId: row.goodsId,
          goodsSkuId: row.skuId,
          optType: "save"
        }).then(res => {
          if (res.result.code == 0) {
            row.activityGoodsId = res.result.result.id;
            this.$message({
              message: '申请加入活动成功',
              type: 'success',
              duration: 800
            })
            this.getList(1);
          }else{
            setTimeout(function(){
              row.joins = 0;
            },500);
          }
        })
      }
    }
  }
</script>
<style scoped>
  .el-table >>> th.gutter{
    display: table-cell !important;
  }
</style>
