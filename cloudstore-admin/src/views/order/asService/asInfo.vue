<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>退货商品</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center"></el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.orderDetail[0].detailPic.goodsSkuBean.picUrl" style="width: 80px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.orderDetail[0].detailPic.goodsBean.goodsName}}</template>
        </el-table-column>
        <el-table-column label="价格/货号" align="center">
          <template slot-scope="scope">
            <p>价格：{{scope.row.orderDetail[0].detailPic.goodsBean.price}}</p>
            <p>货号：{{scope.row.orderDetail[0].detailPic.goodsBean.goodsBrand}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" align="center">
          <template slot-scope="scope">
            <p v-for="(item, key) in scope.row.orderDetail[0].detailPic.goodsSkuBean.skuKeys" :key="key">
              {{item}}:{{scope.row.orderDetail[0].detailPic.goodsSkuBean.skuValues[key]}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">{{scope.row.orderDetail[0].detailPic.quantity}}</template>
        </el-table-column>
        <el-table-column label="小计" align="center">
          <template slot-scope="scope">{{scope.row.orderDetail[0].detailPic.payPrice}}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>退货详情</span>
    </el-card>
    <div style="margin: 20px 20px 20px 20px">
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">订单编号</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].orderId}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">申请时间</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.createDate}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">申请状态</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].status | changeMsg}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">用户账号</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.access}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">联系人</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.name}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">联系电话</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.phone}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">退货原因</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].remarks}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr picsale">退货图片</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl picsale" v-if='orderList[0]'>
          <el-image v-for="(item, key) in orderList[0].afterPhotos" :src="item.url" :key="key" style="width: 100px; overflow:initial;"></el-image>
        </div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">订单金额</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].orderDetail[0].detailPic.payPrice}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">申请退款金额</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].orderDetail[0].detailPic.payPrice}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">收货人姓名</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.name}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">收货地址</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.name}}</div></el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="4"><div class="grid-content bg-purple nomarr">联系电话</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple marl" v-if='orderList[0]'>{{orderList[0].clientBean.phone}}</div></el-col>
      </el-row>
    </div>
    <div style="text-align: center; margin: 20px 0"><el-button type="primary">确认</el-button></div>
  </div>
</template>

<script>
  import {getAnorder} from '@/api/order'
  export default {
    name: "asInfo",
    data() {
      return {
        orderList: [],
        listLoading: false
      }
    },
    created() {
      this.getList();
    },
    filters: {
      changeMsg(data) {
        switch (data) {
          case 0: return "申请中";
          break;
          case 1: return "审核通过";
          break;
          case -1: return "申请拒绝";
          break;
          default: return "数据读取出错";
          break;
        }
      }
    },
    methods: {
      getList() {
        getAnorder({id: this.$route.query.id}).then(res => {
          console.log(res)
          this.orderList.push(res.result.result)
          console.log(this.orderList[0].orderDetail[0].detailPic.goodsSkuBean.picUrl)
        })
      }
    }
  }
</script>

<style scoped>
  .el-row:last-child {
    border-bottom: 1px solid #e9e9eb;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .bg-purple {
    /*background: #d3dce6;*/
    border: 1px solid #e9e9eb;
    border-bottom: none;
  }
  .grid-content {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .nomarr{
    border-right: none;
    text-align: right;
    padding-right: 25px;
    background-color: #fafafa;
  }
  .marl{
    text-indent: 25px;
  }
  .picsale{
    height: 150px;
    line-height: 150px;
  }
</style>
