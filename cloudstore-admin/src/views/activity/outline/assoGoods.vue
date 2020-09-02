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
<!--          <el-form-item label="供应商：">-->
<!--            <remoteCom v-model="listQuery.supplierIds_" ref="clearInput" url="/manage/search/supplier/search" @tochild="tochild"></remoteCom>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" @click="backPage" style="float: right">返回</el-button>
      <el-button type="primary" size="mini" @click="associatedGood" style="float: right; margin-right: 20px">关联商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60px" align="center"></el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.photos" style="width: 56px; height: 56px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" :formatter="goodsinfo" prop='goodsName'>
        </el-table-column>
        <el-table-column label="商品分类" align="center" :formatter="goodsinfo" prop="category">
        </el-table-column>
        <el-table-column label="SKU编号" align="center" :formatter="goodsinfo" prop="skuCode">
        </el-table-column>
        <el-table-column label="规格" align="center" :formatter="goodsinfo" prop="guige">
        </el-table-column>
        <el-table-column label="SKU原价" align="center" :formatter="goodsinfo" prop="skuprice">
        </el-table-column>
        <el-table-column label="活动价格" align="center" prop="offlinePrice" :formatter="nosetting">
        </el-table-column>
        <el-table-column label="团长佣金" align="center" prop="leader" :formatter="nosetting">
        </el-table-column>
        <el-table-column label="客户购买积分" align="center" prop="clientPoints" :formatter="nosetting">
        </el-table-column>
        <el-table-column label="操作" align="center" width="320">
          <template slot-scope="scope">
<!--            <el-button size="mini" @click="readInfo(scope.row)">查看详情</el-button>-->
            <el-button type="primary" size="mini" @click="settingactPrice(scope.row)">设置参数</el-button>
            <el-button size="mini" @click="qrcode(scope.$index, scope.row)">生成二维码</el-button>
            <el-button type="danger" size="mini" @click="handeldel(scope.row)">取消关联</el-button>
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
  import {fetchActivityGoodsLists, delActivityGoodsList, fetchListWithChildren, outAssogoods} from '@/api/activity'
  import {msg} from '@/api/iunits'
  // import remoteCom from '@/components/remoteCom'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "trackinglist",
    // components: {
    //   remoteCom
    // },
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
        addProfit: ''
      }
    },
    created() {
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
    methods: {
      // tochild(item, callback){
      //   // return `用户名称：${item.name} / 用户账号：${item.access}`;
      //   callback(`供应商名称：${item.name} / 供应商电话：${item.phone}`);
      // },
      settingactPrice(row) {
        this.$router.push({path: '/sys/activity/outlinesetParams', query: {id: row.skuId, activityId: this.$route.query.id, activityGoodsId: row.activityGoodsId, offlinePrice: row.offlinePrice}})
      },
      qrcode(index, row) {
        if (row.clientPoints == -1 || row.leader == -1 || row.offlinePrice == -1) {
          this.$message({
            message: '请设置该商品的Sku的相关参数',
            type: 'error',
            duration: 1000
          })
        } else {
          this.$router.push({path: '/sys/activity/qrcode', query: {id: row.activityGoodsId, agentId: this.$route.query.agentId}})
        }
      },
      nosetting(row, col) {
        switch (col.property) {
          case "offlinePrice": {
            try {
              if (row.offlinePrice == -1) {
                return "未设置";
              } else {
                return row.offlinePrice;
              }
            }catch (e) {
              return "数据读取出错";
            }
          }
          case "leader": {
            try {
              if (row.leader == -1) {
                return "未设置";
              } else {
                return row.leader;
              }
            }catch (e) {
              return "数据读取出错";
            }
          }
          case "clientPoints": {
            try {
              if (row.clientPoints == -1) {
                return "未设置";
              } else {
                return row.clientPoints;
              }
            }catch (e) {
              return "数据读取出错";
            }
          }
        }
      },
      readInfo() {},
      getList(idx) {
        this.listLoading = true;
        this.listQuery.joins = 1;
        fetchActivityGoodsLists(this.listQuery).then(response => {
          if (response.result.code == 0) {
            this.list = response.result.result.records;
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
      goodsinfo(row, column) {
        let goods = row.goodsBean;
        switch (column.property) {
          case 'goodsName': {
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
          case 'skuCode':
          {
            try {
              return row.skuCode;
            } catch (e) {
              return '数据读取错误';
            }
          }
          case 'guige':
          {
            try {
              return row.skuKey + ' ' + ':' + ' ' + row.skuValue;
            } catch (e) {
              return '数据读取错误';
            }
          }
          case 'skuprice':
          {
            try {
              return row.price;
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
      associatedGood(row) {
        let id = this.$route.query.id;
        this.$router.push({
          path: "/sys/activity/outlineactGoodslist",
          query: {activityid: id}
        })
      },
      handeldel(row) {
        this.$confirm('是否要取消关联?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          outAssogoods({
            ids: row.activityGoodsId
          }).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '申请退出活动成功',
                type: 'success',
                duration: 800
              })
              this.getList(1);
            }
          })
        });

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
        // this.$forceUpdate();
      }
    }
  }
</script>
<style></style>
