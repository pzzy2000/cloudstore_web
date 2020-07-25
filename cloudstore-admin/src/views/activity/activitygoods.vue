<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right;margin-bottom: 10px;" @click="handleSearchList()" type="primary" size="small">
          查询
        </el-button>
        <el-button style="float: right;margin-right: 15px;margin-bottom: 10px;" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
          <el-form-item label="商品名称：">
            <el-input style="width: 214px" v-model="listQuery.goodsName" placeholder="商品名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" size="mini" @click="backPage" style="float: right">返回</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60px" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center" :formatter="goodsinfo" column-key='goodsName' fixed="">
        </el-table-column>
        <el-table-column label="商品分类" align="center" fixed :formatter="goodsinfo" column-key="category">
        </el-table-column>
        <el-table-column label="销售价/市场价" align="center" fixed :formatter="goodsinfo" column-key="pics">
        </el-table-column>
        <el-table-column label="商品图片" align="center"  column-key="goodsPhotos">
          <template slot-scope="scope">
            <el-image v-for=" (item,index) in scope.row.goodsPicesBean.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="供应商" align="center" fixed :formatter="goodsinfo" column-key="supplierBean">
        </el-table-column>
        <el-table-column label="供应商店铺" align="center" fixed :formatter="goodsinfo" column-key="supplierShopBean">
        </el-table-column>

        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handeldel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  import {
    fetchActivityGoodsList,delActivityGoodsList
  } from '@/api/activity'
  import {
    msg
  } from '@/api/iunits'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "trackinglist",
    data() {
      return {
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.listQuery.activityId = this.$route.query.id;
      this.getList();
    },
    watch: {
      // selectProductCateValue: function (newValue) {
      //   if (newValue != null && newValue.length == 2) {
      //     this.listQuery.productCategoryId = newValue[1];
      //   } else {
      //     this.listQuery.productCategoryId = null;
      //   }

      // }
    },
    filters: {
      // verifyStatusFilter(value) {
      //   if (value === 1) {
      //     return '审核通过';
      //   } else {
      //     return '未审核';
      //   }
      // }
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchActivityGoodsList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        });
      },
      goodsinfo(row, column) {
        let goods = row.goodsPicesBean;
        switch (column.columnKey) {
          case 'goodsName':
            {
              return goods.goodsName;
            }
          case 'category':
            {
              try {
                return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name + "/" + goods.categoryThreeBean.name;
              } catch (e) {
                return '数据读取错误';
              }
            }
          case 'pics':
            {
              try {
                return '￥' + goods.salePrice + '/' + goods.martPrice;
              } catch (e) {
                return '数据读取错误';
              }
            }
          case 'supplierBean':
            {
              try {
                return goods.supplierBean.name;
              } catch (e) {
                return '数据读取错误';
              }
            }
          case 'supplierShopBean':
            {
              try {
                return goods.supplierShopBean.shopName;
              } catch (e) {
                return '数据读取错误';
              }
            }
        }
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      changeSwitch() {

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      addactivity() {
        this.$router.push({
          path: "/sys/activity/addact"
          // query: {rds: "write"}
        })
      },
      associatedGood(row) {
        this.$router.push({
          path: "/sys/activity/assogoods",
          query: {
            name: row.name,
            activityid: row.id
          }
        })
      },
      handeldel(row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          delActivityGoodsList({ids:ids}).then(response => {
            msg("删除活动商品成功");
            this.getList();
          });
        });

      },
      backPage() {
        this.$router.back();
      }
    }
  }
</script>
<style></style>
