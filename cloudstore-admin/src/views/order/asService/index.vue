<template>
  <div>
<!--    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->
<!--      <el-menu-item index="1">全部申请(<span>1000</span>)</el-menu-item>-->
<!--      <el-menu-item index="2">待处理(<span>1000</span>)</el-menu-item>-->
<!--      <el-menu-item index="3">退货中(<span>1000</span>)</el-menu-item>-->
<!--      <el-menu-item index="4">已完成(<span>1000</span>)</el-menu-item>-->
<!--      <el-menu-item index="5">已拒绝(<span>1000</span>)</el-menu-item>-->
<!--    </el-menu>-->
    <el-card class="filter-container" shadow="never" style="margin: 0 20px">
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
          <el-form-item label="用户信息：" prop="count">
<!--            <el-input style="width: 214px" v-model="searchList.count" placeholder="用户账号"></el-input>-->
            <remoteCom v-model="pageList.clientIds" ref="clearInput" url="/manage/search/client/search" @tochild="tochild"></remoteCom>
          </el-form-item>
          <el-form-item label="订单信息：" prop="count">
            <remoteCom v-model="pageList.orderId" ref="clearInputTwo" url="/manage/search/order/search" @tochild="tochildTwo"></remoteCom>
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
        <el-table-column type="selection" width="60px" align="center"></el-table-column>
        <el-table-column label="服务单号" align="center" prop="number" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.orderBean.number}}</template>-->
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderNumber" :formatter="showMsg">
          <!--          <template slot-scope="scope">{{scope.row.orderBean.number}}</template>-->
        </el-table-column>
        <el-table-column label="下单时间" align="center" prop="createTime" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.orderBean.createTime | formatDate}}</template>-->
        </el-table-column>
        <el-table-column label="用户账号" align="center" prop="userphone" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.clientAddressBean.phone}}</template>-->
        </el-table-column>
        <el-table-column label="退款金额" align="center" prop="payPrice" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.orderBean.payPrice}}</template>-->
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="name" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.clientBean.name}}</template>-->
        </el-table-column>
        <el-table-column label="申请状态" align="center">
          <template slot-scope="scope">{{scope.row.type | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="readOrder(scope.$index, scope.row)">{{scope.row.type | changeShow}}</el-button>
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
  import {afterSalelist} from '@/api/order'
  import { formatDate } from '@/assets/common/data.js'
  import remoteCom from '@/components/remoteCom'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "asService",
    components: {
      remoteCom
    },
    data() {
      return {
        activeIndex: '1',
        searchList: {},
        orderList: [{
          code: '',
          goods: '',
          ordertime: '',
          count: '',
          cost: '',
          apply: '',
          ordertype: '',
          status: ''
        }],
        listLoading: false,
        pageList: Object.assign({}, defaultList),
        total: 1,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        options: [
          {label: "APP订单", value: "1"},
          {label: "小程序订单", value: "2"},
          {label: "微信订单", value: "3"}
        ],
        dialogVisible: false,
        btntext: ''
      }
    },
    created() {
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
      changeStatus(data) {
        switch (data) {
          case 'wait': return "待支付";
            break;
          case 'complete': return "已支付";
            break;
          case 'close': return "超时关闭";
            break;
        }
      },
      changeMsg(data) {
        switch (data) {
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
      },
      changeShow(data) {
        switch (data) {
          case '1': return "查看详情";
            break;
          case '0': return "前往审核";
            break;
          case '2': return "查看详情";
            break;
          default: return "查看详情";
            break;
        }
      }
    },
    methods: {
      tochild(item, callback){
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`用户账号：${item.phone} / 用户名称：${item.name}`);
      },
      tochildTwo(item, callback){
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`订单编号：${item.number}`);
      },
      showMsg(row, col) {
        switch (col.property) {
          case "number":{
            try {
              return row.id;
            }catch (e) {
              return '数据读取错误'
            }
          }
          case "userphone":{
            try {
              return row.clientBean.phone
            }catch (e) {
              return '数据读取错误'
            }
          }
          case "createTime":{
            try {
              return row.orderBean.createTime
            }catch (e) {
              return '数据读取错误'
            }
          }
          case "payPrice":{
            try {
              return row.orderBean.payPrice
            }catch (e) {
              return '数据读取错误'
            }
          }
          case "name":{
            try {
              return row.clientBean.name
            }catch (e) {
              return '数据读取错误'
            }
          }
          case "orderNumber":{
            try {
              return row.orderBean.number
            }catch (e) {
              return '数据读取错误'
            }
          }
        }
      },
      getList(idx) {
        afterSalelist(this.pageList).then(res => {
          if (res.result.code == 0) {
            this.orderList = res.result.result.records;
            this.total = parseInt(res.result.result.total);
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
          }
        })
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSearchList() {
        this.pageList.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch(formName) {
        this.pageList = Object.assign({}, defaultList),
        this.$refs.clearInput.clearInput();
        this.getList(2);
      },
      handleSizeChange() {
        this.getList(1);
      },
      handleCurrentChange() {
        this.getList(1);
      },
      readOrder(index, row){
        console.log(index, row);
        this.$router.push({path: "/order/manage/asinfo", query: {id: row.id}})
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
      }
    }
  }
</script>

<style scoped>
  .el-menu{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-menu.el-menu-demo{
    border: none;
  }
  .el-menu-item{
    width: 150px;
    height: 40px;
    margin-left: 20px;
    line-height: 40px;
    text-align: center;
  }
  .el-menu .el-menu-item:hover{
    color: #1abc9c;
  }
  .el-menu .el-menu-item span{
    color: red;
  }
  .el-menu .el-menu-item:hover span{
    color: #1abc9c;
  }
  .el-menu--horizontal>.el-menu-item.is-active{
    border: none;
    background-color: #1abc9c !important;
    color: white;
  }
  .el-menu--horizontal>.el-menu-item.is-active span{
    color: white;
  }
  .el-menu-item{
    border-bottom-color: #e4e4e4 !important;
    border: 1px solid #e4e4e4;
  }
</style>
