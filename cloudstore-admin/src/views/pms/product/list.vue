<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询
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
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.shelfStatus" placeholder="请选择上架状态" clearable>
              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属供应商：">
            <remoteCom v-model="listQuery.supplierIds" ref="clearInput" url="/manage/search/supplier/search" @tochild="tochild"></remoteCom>
<!--            <el-input style="width: 203px" v-model="listQuery.shopName" placeholder="所属供应商" clearable></el-input>-->
          </el-form-item>
<!--          <el-form-item label="商品分类：">-->
<!--            <el-input style="width: 203px" v-model="listQuery.goodsNumber" placeholder="商品分类"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="是否删除：">
            <el-select v-model="listQuery.isDelete" placeholder="请选择是否删除" clearable>
              <el-option v-for="item in delList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
      <el-button class="btn-add" @click="handleAddProduct()" size="mini" v-if="powershowing(power.goods_add)">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <!-- <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column> -->
        <el-table-column label="商品名称" width="150" align="center" fixed="">
          <template slot-scope="scope">{{scope.row.goodsName}}</template>
        </el-table-column>
        <el-table-column label="商品品牌" width="150" align="center">
          <template slot-scope="scope">{{scope.row.goodsBrand}}</template>
        </el-table-column>
        <el-table-column label="商品货号" width="150" align="center">
          <template slot-scope="scope">{{scope.row.goodsNumber}}</template>
        </el-table-column>
<!--        <el-table-column label="商品规格类别" width="150" align="center" :formatter="propertyBean">-->
<!--        </el-table-column>-->
        <el-table-column label="产地" width="250" align="center" :formatter="showAddress">
        </el-table-column>
        <el-table-column label="商品分类" width="200" align="center" :formatter="goodsCategory">
        </el-table-column>
        <el-table-column label="销售价格/市场价" width="150" align="left">
          <template slot-scope="scope"> ￥{{scope.row.salePrice}} / ￥{{scope.row.martPrice}}</template>
        </el-table-column>
        <el-table-column label="所属店铺" width="150" align="left" :formatter="suppilerShop">
        </el-table-column>
        <el-table-column label="所属供应商" width="150" align="left" :formatter="suppiler">

        </el-table-column>
        <el-table-column label="商品图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image v-for=" (item,index) in scope.row.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">
<!--              <div slot="placeholder" class="image-slot">-->
<!--                加载中<span class="dot">...</span>-->
<!--              </div>-->
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center" v-if="powershowing(power.sku_updown)">
          <template slot-scope="scope">
            上架：
            <el-switch @change="handlePublishStatusChange($event, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.shelfStatus">
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)" v-if="powershowing(power.goods_info)">查看
            </el-button>
            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)" v-if="powershowing(power.goods_edit)">编辑
            </el-button>
            <el-button size="mini" @click="addsku(scope.$index, scope.row)" v-if="powershowing(power.sku_edit)">SKU管理
            </el-button>
            <!-- <el-button
                size="mini"
                @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button> -->
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="powershowing(power.goods_delete)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary" size="small">
        确定
      </el-button>
    </div>
    -->
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
  import {
    fetchList,
    updateDeleteStatus,
    updateNewStatus,
    updateRecommendStatus,
    updatePublishStatus,
    upOrdown,
  } from '@/api/product'
  import {
    fetchList as fetchSkuStockList,
    update as updateSkuStockList
  } from '@/api/skuStock'
  import {
    fetchList as fetchProductAttrList
  } from '@/api/productAttr'
  import {
    fetchList as fetchBrandList
  } from '@/api/brand'
  import {
    fetchListWithChildren
  } from '@/api/productCate'
  import remoteCom from '@/components/remoteCom'
  import {powershow} from "@/utils/power";
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
    components: {
      remoteCom
    },
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
        delList: [{label: "已删除", value: '1'}, {label: "正常", value: '0'}],
        category: {
          one: [],
          two: [],
          three: []
        },
        operates: [
          {label: "商品上架", value: "publishOn"},
          {label: "商品下架", value: "publishOff"},
          {label: "设为推荐", value: "recommendOn"},
          {label: "取消推荐", value: "recommendOff"},
          {label: "设为新品", value: "newOn"},
          {label: "取消新品", value: "newOff"},
          {label: "转移到分类", value: "transferCategory"},
          {label: "移入回收站", value: "recycle"}
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
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
        }],
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList(1);
      this.searchRootCategory();
      //this.getBrandList();
      //this.getProductCateList();
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
      }
    },
    activated() {
      this.getList(1);
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      tochild(item, callback){
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`供应商账号：${item.name} / 供应商电话：${item.phone}`);
      },
      suppilerShop(row, column) {
        try {
          return row.supplierShopBean.shopName;
        } catch (e) {
          return '数据读取错误';
        }
      },
      suppiler(row, column) {
        try {
          return row.supplierBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      goodsCategory(row, column) {
        try {
          if (row.categoryThreeBean !== null && row.categoryThreeBean !== undefined) {
            return row.categoryOneBean.name + "/" + row.categoryTwoBean.name + "/" + row.categoryThreeBean.name;
          } else {
            return row.categoryOneBean.name + "/" + row.categoryTwoBean.name;
          }
        } catch (e) {
          return '数据读取错误';
        }
      },
      propertyBean(row, column) {
        try {
          return row.propertyBean.propertyName;
        } catch (e) {
          return null;
        }
      },
      searchRootCategory() {
        this.loading = true;
        fetchListWithChildren(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.category.one = list;
        });
      },
      showAddress(row, column) {
        try {
          return row.provinceBean.name + " " + row.cityBean.name + " " + row.areaBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      addsku(index, row) {
        this.$router.push({
          path: "/sys/goods/sku/edit",
          query: {
            goodsid: row.id
          }
        })
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
        fetchList(this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
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
      getBrandList() {
        fetchBrandList({
          pageNum: 1,
          pageSize: 100
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
      handleAddProduct() {
        this.$router.push({
          path: '/sys/goods/add'
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
        this.$refs.clearInput.clearInput();
        this.category.two = [];
        this.category.three = [];
        this.getList(2)
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let ids = [];
          // ids.push(row.id);
          updateDeleteStatus({ids: row.id}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              this.getList(1);
            }
          });
        });
      },
      handleUpdateProduct(index, row) {
        let productId = row.id;
        this.$router.push({
          path: '/sys/goods/edit',
          query: {
            goodsId: productId,
            action: 2,
          }
        });
      },
      handleShowProduct(index, row) {
        let productId = row.id;
        this.$router.push({
          path: '/sys/goods/info',
          query: {
            goodsId: productId,
            action: 0,
          }
        });
      },

      handlePublishStatusChange($event, row) {
        if (row.shelfStatus == 0){//下架
          upOrdown({goodsId: row.id}).then(res => {
            if(res.result.code == 0){
              row.shelfStatus =0;
              this.$message({
                type: 'success',
                message: '下架成功',
                duration: 800
              })
            }
          })
        }else{//上架
          upOrdown({goodsId: row.id}).then(res => {
            if(res.result.code == 0){
              this.$message({
                type: 'success',
                message: '上架成功',
                duration: 800
              })
            }else{
              setTimeout(function(){
                row.shelfStatus =0;
              },1000);
            }
          })
        }
      },

      updateDeleteStatus(obj) {
        // let params = new URLSearchParams();
        // params.append('ids', ids);
        // params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(obj).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList(1);
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
<style></style>
