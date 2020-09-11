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
        <div>
          <el-form :inline="true" :model="pageList" size="small" label-width="130px" ref="searchList">
            <el-form-item label="订单编号：">
              <remoteCom v-model="pageList.orderIds" ref="clearInput" url="/manage/search/order/search" @tochild="tochild"></remoteCom>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="margin-top: 15px">
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>物流信息</span>
      <el-button type="primary" @click="wuliupeisong" size="mini" style="float: right">{{msg}}</el-button>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="wuliuTable" :data="wuliuList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column label="发货人姓名" align="center">
          <template slot-scope="scope">{{scope.row.consignerName}}</template>
        </el-table-column>
        <el-table-column label="发货人电话" align="center">
          <template slot-scope="scope">{{scope.row.consignerPhone}}</template>
        </el-table-column>
        <el-table-column label="发货人地址" align="center">
          <template slot-scope="scope">{{scope.row.consignerAddress}}</template>
        </el-table-column>
        <el-table-column label="提货时间" align="center">
          <template slot-scope="scope">{{scope.row.deliveryTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="提送类型" align="center">
          <template slot-scope="scope">{{scope.row.deliveryType | changetype}}</template>
        </el-table-column>
        <el-table-column label="客户单号" align="center">
          <template slot-scope="scope">{{scope.row.customerOrderNumber}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status | changeStatus}}</template>
        </el-table-column>
      </el-table>
      <el-table ref="wuliuTable" :data="wuliuList" style="width:100%" v-loading="listLoading" border>
        <el-table-column label="收货人姓名" align="center">
          <template slot-scope="scope">{{scope.row.consigneeName}}</template>
        </el-table-column>
        <el-table-column label="收货人电话" align="center">
          <template slot-scope="scope">{{scope.row.consigneePhone}}</template>
        </el-table-column>
        <el-table-column label="收货人所在省份" align="center">
          <template slot-scope="scope">{{scope.row.consigneeProvince}}</template>
        </el-table-column>
        <el-table-column label="收货人所在城市" align="center">
          <template slot-scope="scope">{{scope.row.consigneeCity}}</template>
        </el-table-column>
        <el-table-column label="收货人所在地区" align="center">
          <template slot-scope="scope">{{scope.row.consigneeDistrict}}</template>
        </el-table-column>
        <el-table-column label="收货人地址" align="center">
          <template slot-scope="scope">{{scope.row.consigneeAddress}}</template>
        </el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">{{scope.row.logisticsNumber}}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column label="订单号" align="center" width="250" prop="orderNumber" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人姓名" align="center" prop="clientName" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人电话" align="center" prop="clientPhone" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="收件人地址" align="center" prop="clientAddress" :formatter="showAllocDetail" width="300">
        </el-table-column>
        <el-table-column label="订单时间" align="center" prop="createTime" :formatter="showAllocDetail" width="180">
        </el-table-column>
        <el-table-column label="支付时间" align="center" prop="payTime" :formatter="showAllocDetail" width="180">
        </el-table-column>
        <el-table-column label="配送状态" align="center" prop="allocStatus" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="showAllocDetail">
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="readOrder(scope.$index, scope.row)">订单详情</el-button>
            <el-button size="mini" type="primary" :disabled="scope.row.status == 'yps' ? true : false" @click="peisong(scope.$index, scope.row)">配送
            </el-button>

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
  import {fetchDetailList as fetchList, peisong, wuliuInfo, wuliupeisong, wuliuquxiao} from '@/api/allocation'
  import {formatDate} from '@/assets/common/data.js'
  import remoteCom from '@/components/remoteCom'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "list",
    components: {
      remoteCom
    },
    data() {
      return {
        activeIndex: '1',
        orderList: [],
        wuliuList: [],
        listLoading: false,
        pageList: Object.assign({}, defaultList),
        total: 1,
        dialogVisible: false,
        btnMsg: '',
        type: '',
        msg: ''
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
      changetype(data) {
        switch (data) {
          case 1: return "自提";
            break;
          case 2: return "送货";
            break;
          default: return "数据读取错误";
            break;
        }
      },
      changeStatus(data) {
        switch (data) {
          case 'dxd': return "待下单";
            break;
          case 'yxd': return "已下单";
            break;
          case 'yjd': return "已接单";
            break;
          case 'yzh': return "已装货";
            break;
          case 'yqs': return "已签收";
            break;
          default: return "数据读取错误";
            break;
        }
      }
    },
    methods: {
      tochild(item, callback){
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`订单号：${item.number}`);
      },
      wuliupeisong() {
        if (this.wuliuList[0].status == 'dxd') {
          this.$confirm('是否生成物流单号?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            wuliupeisong({id: this.$route.query.id}).then(res => {
              if(res.result.code == 0){
                this.disabled = true;
                this.$message({
                  message: '生成物流单号成功!',
                  type: 'success',
                  duration: 800
                })
                this.getList();
              }
            })
          }).catch(e => e);
        } else {
          this.$confirm('是否取消配送?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            wuliuquxiao({id: this.$route.query.id}).then(res => {
              if(res.result.code == 0){
                this.disabled = true;
                this.$message({
                  message: '取消配送成功!',
                  type: 'success',
                  duration: 800
                })
                this.getList();
              }
            })
          }).catch(e => e);
        }
      },
      showAllocDetail(row, r) {
        switch (r.property) {
          case 'orderNumber': {
            try {
              return row.orderBean.number;
            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
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

          case 'allocStatus': {
            try {
              let status = row.status;
              switch (status) {
                case 'dps':
                  return "待配送";
                  break;
                case 'yps':
                  return "已配送";
                  break;
                default:
                  return "数据读取错误";
                  break;
              }

            } catch (e) {
              return '数据读取错误';
            }
            break;
          }

          case 'orderStatus': {
            try {
              let status = row.orderBean.orderStatus;
              switch (status) {
                case 'wait':
                  return "待支付";
                  break;
                case 'pay':
                  return "支付待确认";
                  break;
                case 'payed':
                  return "已支付";
                  break;
                case 'peisong':
                  return "待配送";
                  break;
                case 'peisoged':
                  return "已配送";
                  break;
                case 'complete':
                  return "已完成";
                  break;
                case 'close':
                  return "超时关闭";
                  break;
                case 'returns':
                  return "退货";
                  break;
                case 'returnsing':
                  return "正在退货";
                  break;
                case 'retud':
                  return "已退货";
                  break;
                default:
                  return "数据读取错误";
                  break;
              }

            } catch (e) {
              return '数据读取错误';
            }
            break;
          }
        }
      },
      peisong(index, row) {
        peisong({id: row.id}).then(res => {
          if (res.result.code == 0) {
            this.$message({
              message: '配送成功',
              type: 'success',
              duration: 800
            })
            this.getList()
            // row.status = res.result.status;
            // row.orderBean.orderStatus = res.result.result.orderBean.orderStatus;
          }
        })
      },
      getList() {
        this.orderList = [];
        this.wuliuList = [];
        this.pageList.allocationId = this.$route.query.id;
        fetchList(this.pageList).then(res => {
          if (res.result.code == 0) {
            this.orderList = res.result.result.records;
            this.total = parseInt(res.result.result.total);
          }
        })
        wuliuInfo({id: this.$route.query.id}).then(res => {
          if (res.result.code == 0) {
            this.wuliuList.push(res.result.result);
            if (this.wuliuList[0].status == 'dxd') {
              this.msg = '物流配送';
            } else {
              this.msg = '取消配送';
            }
          }
        })
      },
      readOrder(index, row) {
        this.$router.push({name: "ps_order_detail", query: {id: row.orderId}});
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
