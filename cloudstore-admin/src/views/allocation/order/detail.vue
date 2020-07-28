<template>
  <div>
    <!--    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->
    <!--      <el-menu-item index="1">全部订单(<span>1000</span>)</el-menu-item>-->
    <!--      <el-menu-item index="2">待付款(<span>1000</span>)</el-menu-item>-->
    <!--      <el-menu-item index="3">待发货(<span>1000</span>)</el-menu-item>-->
    <!--      <el-menu-item index="4">已发货(<span>1000</span>)</el-menu-item>-->
    <!--      <el-menu-item index="5">已完成(<span>1000</span>)</el-menu-item>-->
    <!--      <el-menu-item index="6">已关闭(<span>1000</span>)</el-menu-item>-->
    <!--    </el-menu>-->
    <el-card class="filter-container" shadow="never" style="margin: 20px 20px 0 20px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button size="small" style="float: right;margin-left: 15px;margin-bottom: 10px;" @click="backPage">返回
        </el-button>
        <el-button
          style="float: right;margin-bottom: 10px;"
          @click="handleSearchList"
          type="primary"
          size="small">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px;margin-bottom: 10px;"
          @click="handleResetSearch('searchList')"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed></el-table-column>
        <el-table-column label="商品名称" align="center" fixed prop="goodsName" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="商品SKU" align="center" prop="skuCode" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="商品规格" align="center" prop="goodsModule" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="商品数量" align="center" prop="goodCount" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人姓名" align="center" prop="clientName" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人电话" align="center" prop="clientPhone" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人地址" align="center" prop="clientAddress" :formatter="showAllocDetail" width="300">
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="showAllocDetail">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container" style="margin-right: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="pageList.pageSize"
        :page-sizes="[10]"
        :current-page.sync="pageList.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchDetailList as fetchList} from '@/api/allocation'
  import {formatDate} from '@/assets/common/data.js'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "list",
    data() {
      return {
        activeIndex: '1',
        orderList: [],
        listLoading: false,
        pageList: Object.assign({}, defaultList),
        total: 1,
        dialogVisible: false,
        btnMsg: '',
        type: ''
      }
    },
    created() {
      this.getList();
    },
    filters: {
      // 时间格式自定义 只需把字符串里面的改成自己所需的格式
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },

    },
    methods: {
      showAllocDetail(row, r) {
        switch (r.property) {
          case 'goodsName': {
            try {
              return row.orderDetailBean.goodsBean.goodsName;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'skuCode': {
            try {
              return row.orderDetailBean.goodsSkuBean.skuCode;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'goodsModule': {
            try {
              return row.orderDetailBean.goodsSkuBean.skuKey + " / " + row.orderDetailBean.goodsSkuBean.skuValue;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }

          case 'goodCount': {
            try {
              return row.orderDetailBean.quantity;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'clientName': {
            try {
              return row.orderBean.clientAddressBean.name;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'clientPhone': {
            try {
              return row.orderBean.clientAddressBean.phone;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'clientAddress': {
            try {
              return row.orderBean.clientAddressBean.detailAddress;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }

          case 'orderStatus': {
            try {
              let status = row.orderBean.orderStatus;
              switch (status) {
                case 'payed':
                  return '已支付';
                default :
                  return '没支付';
              }

            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
        }
      },
      getList() {
        this.pageList.allocationId = this.$route.query.id;
        fetchList(this.pageList).then(res => {
          if (res.result.code == 0) {
            this.orderList = res.result.result.records;
            this.total = parseInt(res.result.result.total);
          }
        })
      },
      backPage() {
        this.$router.back();
      },
      showDanger() {
        this.isshow = false;
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSearchList() {
        alert("搜索事件！")
      },
      handleResetSearch(formName) {
        this.$refs[formName].resetFields();
      },
      handleSizeChange() {
        this.getList();
      },
      handleCurrentChange() {
        this.getList();
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {
          });
      }
    }
  }
</script>

<style scoped>
  .el-menu {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .el-menu.el-menu-demo {
    border: none;
  }

  .el-menu-item {
    width: 150px;
    height: 40px;
    margin-left: 20px;
    line-height: 40px;
    text-align: center;
  }

  .el-menu .el-menu-item:hover {
    color: #1abc9c;
  }

  .el-menu .el-menu-item:hover span {
    color: #1abc9c;
  }

  .el-menu .el-menu-item span {
    color: red;
  }

  .el-menu--horizontal > .el-menu-item.is-active {
    border: none;
    background-color: #1abc9c !important;
    color: white;
  }

  .el-menu--horizontal > .el-menu-item.is-active span {
    color: white;
  }

  .el-menu-item {
    border-bottom-color: #e4e4e4 !important;
    border: 1px solid #e4e4e4;
  }

  .el-step.is-vertical >>> .el-step__icon {
    width: 12px !important;
    height: 12px !important;
  }

  .el-step.is-vertical >>> .el-step__line {
    display: none !important;
  }

  .el-step.is-vertical >>> .el-step__main {
    padding: 0;
  }

  .el-step.is-vertical >>> .el-step__head.is-finish {
    color: #c0c4cc !important;
    border-color: #c0c4cc !important;
  }

  .el-step.is-vertical >>> .el-step__title.is-finish {
    color: #c0c4cc;
  }

  .el-step.is-vertical >>> .el-step__description.is-finish {
    color: #c0c4cc;
  }
</style>
