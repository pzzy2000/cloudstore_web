<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">全部订单(<span>1000</span>)</el-menu-item>
      <el-menu-item index="2">待付款(<span>1000</span>)</el-menu-item>
      <el-menu-item index="3">待发货(<span>1000</span>)</el-menu-item>
      <el-menu-item index="4">已发货(<span>1000</span>)</el-menu-item>
      <el-menu-item index="5">已完成(<span>1000</span>)</el-menu-item>
      <el-menu-item index="6">已关闭(<span>1000</span>)</el-menu-item>
    </el-menu>
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
        <el-form :inline="true" :model="searchList" size="small" label-width="130px" ref="searchList">
          <el-form-item label="订单编号：" prop="name">
            <el-input style="width: 214px" v-model="searchList.code" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="下单时间：" prop="code">
            <el-date-picker v-model="searchList.ordertime" type="date" placeholder="选择日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户账号：" prop="count">
            <el-input style="width: 214px" v-model="searchList.count" placeholder="用户账号"></el-input>
          </el-form-item>
          <el-form-item label="订单类型：" prop="ordertype">
            <el-select v-model="searchList.ordertype" placeholder="请选择">
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
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="订单编号" align="center" fixed>
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="商品" align="center">
          <template slot-scope="scope">{{scope.row.goods}}</template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{scope.row.count}}</template>
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">{{scope.row.payPrice}}</template>
        </el-table-column>
        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">{{scope.row.payType}}</template>
        </el-table-column>
        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">{{scope.row.ordertype}}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">{{scope.row.orderStatus | changeStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="readOrder(scope.$index, scope.row)">查看订单</el-button>
            <el-button type="danger" size="mini" @click="delLogis(scope.row)">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
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
    import {fetchList} from '@/api/order'
    import { formatDate } from '@/assets/common/data.js'
    const defaultList = {
      pageNum: 1,
      pageSize: 10,
      optType:'search'
    };
    export default {
      name: "list",
      data() {
        return {
          activeIndex: '1',
          searchList: {},
          orderList: [{
            code: '1111',
            goods: '12313',
            ordertime: '12313',
            count: '123132',
            cost: '11123',
            apply: '321321',
            ordertype: '45678',
            status: '32164'
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
          ]
        }
      },
      created() {
        this.getList();
      },
      filters: {
        // 时间格式自定义 只需把字符串里面的改成自己所需的格式
        formatDate(time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
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
        }
      },
      methods: {
        getList() {
          fetchList(this.pageList).then(res => {
            if (res.result.code == 0) {
              this.orderList = res.result.result.records;
              this.total = parseInt(res.result.result.total);
            }
          })
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
        readOrder(index, row){
          console.log(index, row);
          this.$router.push("/order/manage/readorder")
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
  .red{
    color: red;
  }
</style>
