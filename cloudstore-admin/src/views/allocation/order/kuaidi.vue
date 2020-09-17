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
        <el-form :inline="true" :model="pageList" size="small" label-width="130px" ref="searchList">
          <el-form-item label="收件人姓名：" prop="clientName">
            <el-input style="width: 214px" v-model="pageList.clientName" placeholder="订单编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单时间：" prop="createTime">
            <el-date-picker v-model="pageList.createTime" type="date" placeholder="选择日期" :picker-options="pickerOptions" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收件人电话：" prop="clientPhone">
            <el-input style="width: 214px" v-model="pageList.clientPhone" placeholder="用户账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单状态：" prop="orderstatus">
            <el-select v-model="pageList.orderStatus" placeholder="请选择" clearable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column label="收件人姓名" align="center" prop="clientName" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人电话" align="center" prop="clientPhone" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人地址" align="center" prop="clientAddress" :formatter="showAllocDetail" width="300">
        </el-table-column>
        <el-table-column label="订单时间" align="center" prop="createTime" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="支付时间" align="center" prop="payTime" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="showAllocDetail" width="150">
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center" v-if="powershowing(power.ps_kd_info)">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="readOrder(scope.$index, scope.row)">订单详情</el-button>
        <!--            <el-button :type="scope.row.orderStatus === 'close' ? 'danger' : 'primary'" size="mini" @click="delLogis(scope.row)">{{scope.row.orderStatus | changeMsg}}</el-button>-->
                  </template>
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
  import {fetchKdList as fetchList} from '@/api/allocation'
  import {formatDate} from '@/assets/common/data.js'
  import {powershow} from "@/utils/power";
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
        type: '',
        options: [
          {label: "待支付", value: "wait"},
          {label: "支付待确认", value: "pay"},
          {label: "已支付", value: "payed"},
          {label: "待配送", value: "peisong"},
          {label: "已配送", value: "peisoged"},
          {label: "已完成", value: "complete"},
          {label: "超时关闭", value: "close"},
          {label: "退货", value: "returns"},
          {label: "已退货", value: "retud"},
        ],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList(1);
    },
    activated() {
      this.getList(1);
    },
    filters: {
      // 时间格式自定义 只需把字符串里面的改成自己所需的格式
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },

    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
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
              return row.orderBean.clientAddressBean.provinceBean.name + ' ' + row.orderBean.clientAddressBean.cityBean.name + ' ' + row.orderBean.clientAddressBean.areaBean.name + ' ' + row.orderBean.clientAddressBean.detailAddress;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'createTime': {
            try {
              return row.orderBean.createTime;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'payTime': {
            try {
              return formatDate(new Date(row.orderBean.payTime), 'yyyy-MM-dd hh:mm:ss');
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
          case 'orderStatus': {
            try {
              let status = row.orderBean.orderStatus;
              switch (status) {
                case 'wait': return "待支付";
                  break;
                case 'pay': return "支付待确认";
                  break;
                case 'payed': return "已支付";
                  break;
                case 'peisong': return "待配送";
                  break;
                case 'peisoged': return "已配送";
                  break;
                case 'complete': return "已完成";
                  break;
                case 'close': return "超时关闭";
                  break;
                case 'returns': return "退货";
                  break;
                case 'retud': return "已退货";
                  break;
                default: return "数据读取错误";
                  break;
              }

            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
        }
      },
      getList(idx) {
        this.pageList.allocationId = this.$route.query.id;
        fetchList(this.pageList).then(res => {
          if (res.result.code == 0) {
            this.orderList = res.result.result.records;
            this.total = parseInt(res.result.result.total);
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
          }
        })
      },
      readOrder(index, row){
        this.$router.push({path: "/allocation/order/allocation/order/detail", query: {id: row.orderId}});
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
        this.getList(0)
      },
      handleResetSearch(formName) {
        this.pageList = Object.assign({}, defaultList)
      },
      handleSizeChange(val) {
        this.pageList.pageNum = 1;
        this.pageList.pageSize = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.pageList.pageNum = val;
        this.getList(1);
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
