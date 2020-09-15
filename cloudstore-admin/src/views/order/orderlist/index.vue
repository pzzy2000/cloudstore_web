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
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="pageList" size="small" label-width="130px" ref="searchList">
          <el-form-item label="订单编号：" prop="name">
            <el-input style="width: 214px" v-model="pageList.number" placeholder="订单编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="开始时间：" prop="code">
            <el-date-picker v-model="pageList.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" type="date" :picker-options="startDatePicker" placeholder="选择日期" clearable>
<!--              :picker-options="pickerOptions"-->
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="code">
            <el-date-picker v-model="pageList.endsTime" sformat="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" :picker-options="endDatePicker" placeholder="选择日期" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：" prop="orderstatus">
            <el-select v-model="pageList.orderStatus" placeholder="请选择" clearable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户信息：">
            <remoteCom v-model="pageList.clientIds" url="/manage/search/client/search" @tochild="tochild"></remoteCom>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" @click="exportExcel" size="mini" style="float: right">导出</el-button>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="订单编号" align="center" fixed>
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
<!--        <el-table-column label="商品" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.goods}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="useraccess" label="用户账号" align="center" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.clientBean.access}}</template>-->
        </el-table-column>
        <el-table-column prop="username" label="用户名称" align="center" :formatter="showMsg">
<!--          <template slot-scope="scope">{{scope.row.clientBean.name}}</template>-->
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">￥{{scope.row.payPrice}}</template>
        </el-table-column>
        <el-table-column label="支付方式" align="center">
<!--          <template slot-scope="scope">{{scope.row.payType}}</template>-->
          <template slot-scope="scope">微信</template>
        </el-table-column>
<!--        <el-table-column label="订单类型" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.ordertype}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">{{scope.row.orderStatus | changeStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="readOrder(scope.$index, scope.row)">查看订单</el-button>
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
  import {fetchList} from '@/api/order'
  import {exportMethod} from '@/api/exportMethod'
  import { formatDate } from '@/assets/common/data.js'
  import remoteCom from '@/components/remoteCom'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  let that;
  export default {
    name: "list",
    components: {
      remoteCom
    },
    data() {
      return {
        activeIndex: '1',
        searchList: {
          code: '',
          ordertime: '',
          count: '',
          orderstatus: ''
        },
        orderList: [],
        listLoading: false,
        pageList: Object.assign({
          startTime: '',
          endsTime: '',
        }, defaultList),
        total: 1,
        // pickerOptions: {
        //   disabledDate(time) {
        //     return time.getTime() > Date.now();
        //   }
        // },
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
        dialogVisible: false,
        btnMsg: '',
        type: '',
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
      }
    },
    beforeCreate() {
      that = this;
    },
    created() {
      this.getList(1);
    },
    filters: {
      // showClient(row){
      //        try{
      //          return   "名字:"+row.name+"  登录账号："+row.access;
      //        } catch (e) {
      //          return '数据提取错误'
      //        }
      // },
      // 时间格式自定义 只需把字符串里面的改成自己所需的格式
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      changeStatus(data) {
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
          case 'refunding': return "退款中";
            break;
          case 'refunded': return "已退款";
            break;
          case 'returnsing': return "退货中";
            break;
          case 'returns': return "已退货";
            break;
          default: return "数据读取错误";
            break;
        }
      },
      changeMsg(data) {
        switch (data) {
          case 'wait':
            return "关闭订单";
            break;
          case 'complete':
            return "订单发货";
            break;
          case 'close':
            return "删除订单";
            break;
          default: return "关闭订单";
            break;
        }
      }
    },
    methods: {
      tochild(item, callback){
        console.log(item)
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`用户名称：${item.name} / 用户账号：${item.access}`);
      },
      exportExcel() {
        let obj = {
          url: './platform/order/allocation/exportExcel',//http://106.52.184.24:18888
          method: 'POST',
          fileName: '订单表格'
        }
        exportMethod(obj);
      },
      getList(idx) {
        fetchList(this.pageList).then(res => {
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
      showMsg(row, column) {
        switch (column.property) {
          case "useraccess":{
            try{
              return row.clientBean.access
            }catch (e) {
              return "数据读取出错"
            }
          }
          case "username":{
            try{
              return row.clientBean.name
            }catch (e) {
              return "数据读取出错"
            }
          }
        }
      },
      handleSearchList() {
        // if (this.pageList.startTime !== undefined && this.pageList.startTime !== '') {
        //   this.pageList.startTime = this.pageList.startTime + ' ' + "00:00:00";
        // }
        // if (this.pageList.endTime !== undefined && this.pageList.endTime !== '') {
        //   this.pageList.endTime = this.pageList.endTime + ' ' + "23:59:59";
        // }
        // console.log(this.pageList);
        if (this.pageList.endsTime !== '' && this.pageList.endsTime !== undefined) {
          let str = this.pageList.endsTime.substr(0, 10);
          this.pageList.endsTime = str + ' 23:59:59';
        }
        this.pageList.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch() {
        this.pageList = Object.assign({}, defaultList);
        this.getList(2);
      },
      handleCurrentChange(val) {
        this.pageList.pageNum = val;
        this.getList(1);
      },
      handleSizeChange(val) {
        this.pageList.pageNum = 1;
        this.pageList.pageSize = val;
        this.getList(1);
      },
      readOrder(index, row){
        this.$router.push({name: "order_info", query: {id: row.id}});
      },
      beginDate(){
        const self = this
        return {
          disabledDate(time){
            if (self.pageList.endsTime !== '') {  //如果结束时间不为空，则小于结束时间
              return new Date(self.pageList.endsTime).getTime() <= time.getTime()
            }
          }
        }
      },
      processDate() {
        const  self = this
        return {
          disabledDate(time) {
            if (self.pageList.startTime !== '') {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.pageList.startTime).getTime() >= time.getTime()
            }
          }
        }
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
  .el-menu .el-menu-item:hover span{
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
  .el-step.is-vertical >>> .el-step__icon{
    width: 12px !important;
    height: 12px !important;
  }
  .el-step.is-vertical >>> .el-step__line{
    display: none !important;
  }
  .el-step.is-vertical >>> .el-step__main{
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
