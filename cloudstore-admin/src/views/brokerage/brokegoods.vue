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
          <el-form-item>
            <el-select v-model="listQuery.categoryThreeId" remote v-on:change="seclectCategory($event, 3)" placeholder="三级分类" :loading="loading" clearable>
              <el-option v-for="item in category.three" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" @click="backPage" style="float: right">返 回</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
                border>
        <el-table-column label="商品名称" align="center" fixed="">
          <template slot-scope="scope">{{scope.row.goodsBean.goodsName | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="商品品牌" align="center">
          <template slot-scope="scope">{{scope.row.goodsBean.goodsBrand | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="商品货号" align="center">
          <template slot-scope="scope">{{scope.row.goodsBean.goodsNumber | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="商品规格类别" width="150" align="center" :formatter="propertyBean">
        </el-table-column>
        <el-table-column label="产地" width="250" align="center" :formatter="showAddress">
        </el-table-column>
        <el-table-column label="商品分类" width="200" align="center" :formatter="goodsCategory">
        </el-table-column>
        <el-table-column label="销售价格/市场价" width="150" align="left">
          <template slot-scope="scope"> ￥{{scope.row.goodsBean.salePrice}} / ￥{{scope.row.goodsBean.martPrice}}</template>
        </el-table-column>
        <el-table-column label="所属店铺" width="150" align="left" :formatter="suppilerShop">
        </el-table-column>
        <el-table-column label="所属供应商" width="150" align="left" :formatter="suppiler">
        </el-table-column>
<!--        <el-table-column label="商品图片" width="100" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-image v-for=" (item,index) in scope.row.goodsBean.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">-->
<!--              <div slot="placeholder" class="image-slot">-->
<!--                加载中<span class="dot">...</span>-->
<!--              </div>-->
<!--            </el-image>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="addsku(scope.$index, scope.row)">SKU佣金管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
                     :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in editSkuInfo.productAttr" :label="item.name" :key="item.id" align="center">
          <template slot-scope="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // import {fetchList, updateDeleteStatus, updateNewStatus, updateRecommendStatus, updatePublishStatus} from '@/api/product'
  import {getGoodslist, fetchListWithChildren} from '@/api/brokerage';
  // import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/skuStock'
  // import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  // import {fetchList as fetchBrandList} from '@/api/brand'
  // import {fetchListWithChildren} from '@/api/productCate'
  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 10,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo: {
          dialogVisible: false,
          productId: null,
          productSn: '',
          productAttributeCategoryId: null,
          stockList: [],
          productAttr: [],
          keyword: null
        },
        category: {
          one: [],
          two: [],
          three: []
        },
        operates: [{
          label: "商品上架",
          value: "publishOn"
        },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
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
          return row.goodsBean.categoryOneBean.name + "/" + row.goodsBean.categoryTwoBean.name + "/" + row.goodsBean.categoryThreeBean.name;
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
        let id = this.$route.query.id;
        this.listQuery.activityId = id;
        getGoodslist(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
          if (idx == 0) {
            if (res.result.result.records.length == 0) {
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
      getBrandList() {
        fetchBrandList({
          pageNum: 1,
          pageSize: 10
        }).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({
              label: brandList[i].name,
              value: brandList[i].id
            });
          }
        });
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({
                  label: list[i].children[j].name,
                  value: list[i].children[j].id
                });
              }
            }
            this.productCateOptions.push({
              label: list[i].name,
              value: list[i].id,
              children: children
            });
          }
        });
      },
      handleShowSkuEditDialog(index, row) {
        this.editSkuInfo.dialogVisible = true;
        this.editSkuInfo.productId = row.id;
        this.editSkuInfo.productSn = row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword = null;
        fetchSkuStockList(row.id, {
          keyword: this.editSkuInfo.keyword
        }).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
        if (row.productAttributeCategoryId != null) {
          fetchProductAttrList(row.productAttributeCategoryId, {
            type: 0
          }).then(response => {
            this.editSkuInfo.productAttr = response.data.list;
          });
        }
      },
      handleSearchEditSku() {
        fetchSkuStockList(this.editSkuInfo.productId, {
          keyword: this.editSkuInfo.keyword
        }).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
      },
      handleEditSkuConfirm() {
        if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible = false;
          });
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
      handleBatchOperate() {
        if (this.operateType == null) {
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的商品',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updatePublishStatus(1, ids);
              break;
            case this.operates[1].value:
              this.updatePublishStatus(0, ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1, ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0, ids);
              break;
            case this.operates[4].value:
              this.updateNewStatus(1, ids);
              break;
            case this.operates[5].value:
              this.updateNewStatus(0, ids);
              break;
            case this.operates[6].value:
              break;
            case this.operates[7].value:
              this.updateDeleteStatus(1, ids);
              break;
            default:
              break;
          }
          this.getList(1);
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
      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList(1);
      },
      backPage() {
        this.$router.back();
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
    }
  }
</script>
<style scoped>
  .el-table >>> th.gutter{
    display: table-cell !important;
  }
</style>
