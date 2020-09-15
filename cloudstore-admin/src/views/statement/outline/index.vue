<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px 20px 0 20px">
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
      <div style="padding-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
          <el-form-item label="代理信息：">
            <remoteCom v-model="listQuery.agentIds" ref="clearInput" url="/manage/search/agent/search" @tochild="tochild"></remoteCom>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-button type="primary" @click="today" style="margin: 20px 20px 0 20px">今天</el-button>
<!--    <el-button type="primary" style="margin-right: 10px" @click="allday">全天</el-button>-->
    <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      style="margin-top: 20px"
      @change="handleSelect"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd">
    </el-date-picker>
    <div class="table-container" style="margin: 20px">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
      </el-card>
      <el-table ref="productTable" :data="list" style="width: 100%; margin-top: 20px" v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center" fixed></el-table-column>
        <el-table-column label="代理商名字" align="center" prop="name" :formatter="changeShow">
<!--          <template slot-scope="scope">{{scope.row.agentId | changeShow}}</template>-->
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">{{scope.row.date}}</template>
        </el-table-column>
        <el-table-column label="销售总额" align="center">
          <template slot-scope="scope">{{scope.row.saleTotle}}</template>
        </el-table-column>
        <el-table-column label="订单数量" align="center">
          <template slot-scope="scope">{{scope.row.orderNumber}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getOutlinelist} from '@/api/charts'
  import remoteCom from '@/components/remoteCom'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    name: "index",
    components: {
      remoteCom
    },
    data() {
      return{
        list: [],
        listLoading: true,
        listQuery: Object.assign({}, defaultListQuery),
        total: 0,
        value: ''
      }
    },
    created() {
      this.listQuery.type = 0;
      this.getList(this.listQuery);
    },
    // filters: {
    //   changeShow(data) {
    //     if (data == undefined) {
    //       return "公司";
    //     } else {
    //       return data;
    //     }
    //   }
    // },
    methods: {
      tochild(item, callback){
        console.log(item)
        callback(`代理账号：${item.name} / 代理名称：${item.phone}`);
      },
      changeShow(row, col) {
        switch (col.property) {
          case "name":{
            if (row.agentId == -1){
              return "公司";
            } else if (row.agentBean !== undefined) {
              return row.agentBean.name;
            } else {
              return "数据读取出错";
            }
          }
        }
      },
      getList(obj) {
        getOutlinelist(obj).then(res => {
          if (res.result.code == 0) {
            if (res.result.result.records.length == 0) {
              this.$message({
                message: '暂无数据',
                type: 'warning',
                duration: 800
              })
            } else {
              this.$message({
                message: "查询成功",
                type: 'success',
                duration: 800
              })
            }
            this.list = res.result.result.records;
            this.total = parseInt(res.result.result.total);
          }
          this.listLoading = false;
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      today() {
        this.value = '';
        if (this.listQuery.startTime !== undefined) {
          delete this.listQuery.startTime;
        }
        if (this.listQuery.endsTime !== undefined) {
          delete this.listQuery.endsTime;
        }
        this.listQuery.type = 0;
        this.getList(this.listQuery);
      },
      // allday() {
      //   if (this.listQuery.startTime !== undefined) {
      //     delete this.listQuery.startTime;
      //   }
      //   if (this.listQuery.endsTime !== undefined) {
      //     delete this.listQuery.endsTime;
      //   }
      //   this.listQuery.type = 1;
      //   this.getList(this.listQuery);
      // },
      handleSelect() {
        console.log(this.value)
        if (this.listQuery.type !== undefined) {
          delete this.listQuery.type;
        }
        if (this.value !== null){
          this.listQuery.startTime = this.value[0];
          this.listQuery.endsTime = this.value[1];
        } else {
          if (this.listQuery.startTime !== undefined) {
            delete this.listQuery.startTime;
          }
          if (this.listQuery.endsTime !== undefined) {
            delete this.listQuery.endsTime;
          }
          this.listQuery.type = 0;
        }
        this.getList(this.listQuery);
      },
      handleSearchList() {
        this.getList(this.listQuery);
      },
      handleResetSearch() {
        this.listQuery.agentIds = '';
        this.$refs.clearInput.clearInput();
        this.getList(this.listQuery);
      }
    }
  }
</script>

<style scoped>
  .el-date-editor >>> .el-range-separator{
    width: 6%;
  }
</style>
