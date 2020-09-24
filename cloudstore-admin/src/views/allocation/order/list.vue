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
          size="mini">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px;margin-bottom: 10px;"
          @click="handleResetSearch()"
          size="mini">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
          <el-form-item label="代理商信息：">
<!--            <el-input style="width: 214px" v-model="listQuery.name" placeholder="代理商名字" clearable></el-input>-->
            <remoteCom v-model="listQuery.agentIds" ref="clearInput" url="/manage/search/agent/search" @tochild="tochild"></remoteCom>
          </el-form-item>
<!--          <el-form-item label="代理商电话：">-->
<!--            <el-input style="width: 214px" v-model="listQuery.phone" placeholder="代理商电话" clearable></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="开始时间：">
            <el-date-picker v-model="listQuery.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable type="date" placeholder="请选择开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker v-model="listQuery.endsTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="配送单号：">
            <el-input style="width: 214px" v-model="listQuery.allocationNo" placeholder="配送单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="配送状态：">
            <el-select v-model="listQuery.status" placeholder="请选择配送状态" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" @click="exportExcel" size="mini" style="float: right" v-if="powershowing(power.ps_agent_export)" :disabled="disabled">
        {{btnText}}</el-button>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="代理商名字" align="center" fixed prop="agentName" :formatter="showAllocInfo">
        </el-table-column>
         <el-table-column label="代理商电话" align="center" prop="agentPhone" :formatter="showAllocInfo">
        </el-table-column>
        <el-table-column label="代理商地址"  align="center" prop="agentaddress" :formatter="showAllocInfo">
        </el-table-column>
        <el-table-column label="配送单号" align="center">
           <template slot-scope="scope">{{scope.row.allocationNo}}</template>
        </el-table-column>
        <el-table-column label="配送时间" align="center">
          <template slot-scope="scope">{{scope.row.allocationTime | formatDate}}</template>
        </el-table-column>
         <!--
        <el-table-column label="配送状态" align="center" prop="allocStatus" :formatter="showAllocInfo">
        </el-table-column>
        -->
        <el-table-column label="操作" align="center" v-if="powershowing(power.ps_agent_detail)">
          <template slot-scope="scope">
            <el-button size="mini" @click="readOrder(scope.$index, scope.row)">配送详情</el-button>
<!--
            <el-button size="mini" :disabled="scope.row.status == 'yps' ? true : false" @click="peisong(scope.$index, scope.row)">一键配送</el-button>
          <el-button :type="scope.row.orderStatus === 'close' ? 'danger' : 'primary'" size="mini" @click="delLogis(scope.row)">{{scope.row.orderStatus | changeMsg}}</el-button>-->
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
        :page-size="listQuery.pageSize"
        :page-sizes="[10]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="物流信息" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <div style="height: 200px;">
        <el-steps direction="vertical" :active="1">
          <el-step title="步骤 1">
            <i class="el-icon-circle" slot="icon"></i>
          </el-step>
          <el-step title="步骤 2">
            <i class="el-icon-circle" slot="icon"></i>
          </el-step>
          <el-step title="步骤 3">
            <i class="el-icon-circle" slot="icon"></i>
          </el-step>
        </el-steps>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import { fetchAgentList  as fetchList, peisong} from '@/api/allocation'
    import { formatDate } from '@/assets/common/data.js'
    import remoteCom from '@/components/remoteCom'
    import {powershow} from "@/utils/power";
    import {exportMethod} from '@/api/exportMethod'
    const defaultList = {
      pageNum: 1,
      pageSize: 10,
      optType:'search',
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
          orderList: [],
          listLoading: false,
          listQuery: Object.assign({}, defaultList),
          total: 1,
          dialogVisible: false,
          btnMsg: '',
          type: '',
          statusList: [{label: "待配送", value: 'dps'}, {label: "已配送", value: 'yps'}, {label: "已送达", value: 'ysd'}],
          power: '',
          btnText: '导出',
          disabled: false
        }
      },
      beforeCreate() {
        that = this;
      },
      created() {
        this.power = JSON.parse(localStorage.getItem('opt'));
        this.getList(1);
      },
      activated() {
        this.getList(1)
      },
      filters: {
        // 时间格式自定义 只需把字符串里面的改成自己所需的格式
        formatDate(time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },

      },
      methods: {
        async exportExcel() {
          this.btnText = "导出中";
          this.disabled = true;
          if (this.listQuery.endsTime !== '' && this.listQuery.endsTime !== undefined) {
            let str = this.listQuery.endsTime.substr(0, 10);
            this.listQuery.endsTime = str + ' 23:59:59';
          }
          let obj = {
            url: './platform/order/allocation/exportExcel',//http://106.52.184.24:18888
            method: 'POST',
            fileName: '订单表格',
            data: this.listQuery
          }
          let n = await exportMethod(obj);
          if (n == 0) {
            this.$message({
              message: '导出成功',
              type: 'success',
              duration: 800
            })
            this.btnText = "导出";
            this.disabled = false;
          }
        },
        powershowing(key) {
          return powershow(key);
        },
        tochild(item, callback){
          // return `用户名称：${item.name} / 用户账号：${item.access}`;
          callback(`代理商名字：${item.name} / 代理商电话：${item.phone}`);
        },
        peisong(index, row) {
          peisong({allocationId: row.id}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '配送成功',
                type: 'success',
                duration: 800
              })
              this.getList(1);
            }
          })
        },
        showAllocInfo(row,r){
          switch(r.property){
            case 'agentName':{
              try{
                return  row.agentBean.name;
               }catch(e){
                return  '数据读取错误';
               }
               break;
            }

            case 'agentPhone':{
             try{
                   return  row.agentBean.phone;
             }catch(e){
              return  '数据读取错误';
             }
             break;
            }

            case 'agentaddress':{
             try{
                   return  row.agentBean.provinceBean.name+"/"+row.agentBean.cityBean.name+"/"+row.agentBean.areaBean.name+"/"+row.agentBean.townBean.name+"/"+row.agentBean.detailAddress;
             }catch(e){
              return  '数据读取错误';
             }
             break;
            }
            case 'allocStatus':{
              try{
                 let allocStatus  = row.status;
                   switch(allocStatus){
                      case 'dps': return  '待配送';
                      case 'yps': return '已配送';
                      case 'ysd': return '已送达';
                      default: return '状态错误';
                   }
               }catch(e){
                return  '数据读取错误';
               }
               break;
           }
         }
        },
        getList(idx) {
          fetchList(this.listQuery).then(res => {
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
        showDanger() {
          this.isshow = false;
        },
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        },
        handleSearchList() {
          if (this.listQuery.endsTime !== '' && this.listQuery.endsTime !== undefined) {
            let str = this.listQuery.endsTime.substr(0, 10);
            this.listQuery.endsTime = str + ' 23:59:59';
          }
          this.listQuery.pageNum = 1;
          this.getList(0);
        },
        handleResetSearch() {
          this.listQuery = Object.assign({}, defaultList);
          this.$refs.clearInput.clearInput();
          this.getList(2)
        },
        handleSizeChange() {
          this.getList(1);
        },
        handleCurrentChange() {
          this.getList(1);
        },
        readOrder(index, row){
          this.$router.push({path: "/allocation/order/agent/detail", query: {id: row.id}});
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
