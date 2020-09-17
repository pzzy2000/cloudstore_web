<template> 
  <div class="app-container">
    <div style="border: 1px solid #EBEEF5; padding: 20px; margin-bottom: 20px; font-size: 16px">
      <i class="el-icon-open"></i>当前活动：<span style="color: #f06d44;">{{name}}（{{addProfit}}）</span>
    </div>
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
        <el-form :inline="true" :model="listQuery" size="small" label-width="120px">
          <el-form-item label="商品名称：">
            <el-input style="width: 214px" v-model="listQuery.goodsName" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品分类：" prop="categoryOneId">
            <el-select v-model="listQuery.categoryOneId" remote placeholder="一级分类" :loading="loading" v-on:change="seclectCategory($event, 1)" clearable>
              <el-option v-for="item in category.one" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="categoryTwoId">
            <el-select v-model="listQuery.categoryTwoId" remote v-on:change="seclectCategory($event, 2)" placeholder="二级分类" :loading="loading" clearable>
              <el-option v-for="item in category.two" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item prop="categoryThreeId">-->
<!--            <el-select v-model="listQuery.categoryThreeId" remote v-on:change="seclectCategory($event, 3)" placeholder="三级分类" :loading="loading" clearable>-->
<!--              <el-option v-for="item in category.three" :key="item.id" :label="item.name" :value="item.id">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="供应商：">
            <remoteCom v-model="listQuery.supplierIds_" ref="clearInput" url="/manage/search/supplier/search" @tochild="tochild"></remoteCom>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" size="mini" @click="backPage" style="float: right" v-if="powershowing(power.activity_apply)">申请活动</el-button>
      <el-button size="mini" @click="returnPage" style="float: right; margin-right: 20px">返回</el-button>
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
        <el-table-column label="供应商" align="center" :formatter="goodsinfo" column-key="supplierBean">
        </el-table-column>
        <el-table-column label="供应商店铺" align="center" :formatter="goodsinfo" column-key="supplierShopBean">
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handeldel(scope.row)" v-if="powershowing(power.activity_delasso)">删除</el-button>
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
  import {fetchActivityGoodsList, delActivityGoodsList, fetchListWithChildren} from '@/api/activity'
  import {msg} from '@/api/iunits'
  import remoteCom from '@/components/remoteCom'
  import {powershow} from "@/utils/power";
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "trackinglist",
    components: {
      remoteCom
    },
    data() {
      return {
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        category: {
          one: [],
          two: [],
          three: []
        },
        name: '',
        addProfit: '',
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.listQuery.activityId = this.$route.query.id;
      this.name = this.$route.query.name;
      if (this.$route.query.status == 1) {
        this.addProfit = '已参加佣金活动';
      } else {
        this.addProfit = '未参加佣金活动';
      }
      this.getList(1);
      this.searchRootCategory();
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
      powershowing(key) {
        return powershow(key);
      },
      tochild(item, callback){
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`供应商名称：${item.name} / 供应商电话：${item.phone}`);
      },
      returnPage() {
        this.$router.go(-1);
      },
      getList(idx) {
        this.listLoading = true;
        fetchActivityGoodsList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
          console.log(this.list);
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
                if (goods.categoryThreeBean !== undefined) {
                  return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name + "/" + goods.categoryThreeBean.name;
                } else {
                  return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name;
                }
                // return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name + "/" + goods.categoryThreeBean.name;
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
      searchRootCategory() {
        this.loading = true;
        fetchListWithChildren(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.category.one = list;
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList(0);
      },
      // changeSwitch() {
      //
      // },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList(1);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.$refs.clearInput.clearInput();
        this.listQuery.activityId = this.$route.query.id;
        this.category.two = [];
        this.category.three = [];
        this.getList(2);
        console.log(this.listQuery)
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList(1);
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
            this.getList(1);
          });
        });

      },
      backPage() {
        this.$router.push({path: '/sys/activity/apply', query: {id: this.$route.query.id}});
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
        // this.$forceUpdate();
      },
    }
  }
</script>
<style></style>
