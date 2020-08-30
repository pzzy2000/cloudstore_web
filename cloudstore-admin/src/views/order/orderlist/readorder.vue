<template>
  <div>
<!--    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">-->
<!--      <el-steps :active="2" align-center finish-status="success">-->
<!--        <el-step title="提交订单" description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--        <el-step title="支付订单" description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--        <el-step title="平台发货" description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--        <el-step title="确认收货" description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--        <el-step title="完成评价" description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--      </el-steps>-->
<!--    </el-card>-->
    <div style="background-color: #f3f3f3; height: 70px; line-height: 70px; overflow: hidden">
      <div style="display: inline-block; float: left; text-indent: 20px">
        当前订单状态:<span style="color: #f06d44;">&nbsp;&nbsp;{{baseInfo | showOrderStatus}}</span>
      </div>
      <div style="float: right; margin-right: 20px">
<!--        <el-button size="mini">修改收货人信息</el-button>-->
<!--        <el-button size="mini">修改费用信息</el-button>-->
<!--        <el-button size="mini">发送站内信息</el-button>-->
<!--        <el-button size="mini">关闭订单</el-button>-->
<!--        <el-button size="mini">备注订单</el-button>-->
        <el-button size="mini" @click="backPage">返回</el-button>
      </div>
    </div>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>基本信息</span>
    </el-card>
    <el-table :data="baseInfoList" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="number" label="订单编号" align="center">
      </el-table-column>
      <el-table-column prop="payPrice" label="订单金额" align="center">
      </el-table-column>

      <el-table-column prop="payNumber" label="支付流水号" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" align="center">
      </el-table-column>
      <el-table-column label="支付时间" align="center">
        <template slot-scope="scope">{{scope.row.payTime | formatDate}}</template>
      </el-table-column>
      <el-table-column prop="weixinNumber" label="微信流水号" align="center">
      </el-table-column>
      <el-table-column prop="transportType" label="配送类型" align="center" :formatter="transportType">
      </el-table-column>

    </el-table>

    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>配送信息</span>
    </el-card>
    <el-table :data="baseInfoList" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="transportType" label="配送类型" align="center" :formatter="transport">
      </el-table-column>
      <el-table-column prop="address" label="配送地址"       align="center" :formatter="transport">
      </el-table-column>
      <el-table-column prop="community" label="配送社区"      align="center" :formatter="transport">
      </el-table-column>
      <el-table-column prop="detailAddress"  label="详细地址" align="center" :formatter="transport">
      </el-table-column>
      <el-table-column prop="name"  label="联系人"            align="center" :formatter="transport">
      </el-table-column>
      <el-table-column prop="phone"  label="联系电话"          align="center" :formatter="transport">
      </el-table-column>


    </el-table>



    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>收货人信息</span>
    </el-card>
    <el-table :data="baseInfoList" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="clientAddressBean.name" label="收货人" align="center" >
        <template slot-scope="scope">{{scope.row.clientAddressBean.name}}</template>
      </el-table-column>
      <el-table-column prop="clientAddressBean.phone" label="手机号码" align="center">
        <template slot-scope="scope">{{scope.row.clientAddressBean.phone}}</template>
      </el-table-column>
     <el-table-column prop="clientAddressBean.detailAddress" label="详细地址" align="center">
       <template slot-scope="scope">{{scope.row.clientAddressBean | showArea}}</template>
     </el-table-column>

     <el-table-column prop="clientAddressBean.community" label="社区" align="center">
       <template slot-scope="scope">{{scope.row.clientAddressBean.community}}</template>
     </el-table-column>

      <el-table-column prop="clientAddressBean.phone" label="地点" align="center">
        <template slot-scope="scope">{{scope.row.clientAddressBean.detailAddress}}</template>
      </el-table-column>

    </el-table>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>商品信息</span>
    </el-card>
    <el-table :data="baseInfo.orderDetailsBean" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="goodsName" label="商品名称" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="goodssku" label="商品SKU编号" align="center" :formatter="showgoods"></el-table-column>
      <el-table-column prop="goodsmodule" label="商品规格" align="center" :formatter="showgoods"></el-table-column>
      <el-table-column prop="price" label="单价" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="quantity" label="数量" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="payPrice" label="总和" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="activityBean" label="活动" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="agentShopBean" label="代理店铺" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="supplierShopBean" label="供应商" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="status" label="配送状态" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="deliveryType" label="配送类型" align="center" :formatter="showgoods">
      </el-table-column>
    </el-table>
<!--    <el-card shadow="never" style="margin: 0 20px">-->
<!--      <i class="el-icon-tickets"></i>-->
<!--      <span>费用信息</span>-->
<!--    </el-card>-->
<!--    <el-table :data="consigneeMsg" border style="width: 96%; margin-left: 2%">-->
<!--      <el-table-column prop="person" label="商品合计" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="phone" label="运费" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="postcode" label="优惠券" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="area" label="优币抵扣" align="center">-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <el-table :data="consigneeMsg" border style="width: 96%; margin-left: 2%">-->
<!--      <el-table-column prop="person" label="活动优惠" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="phone" label="折扣金额" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="postcode" label="订单总金额" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="area" label="应付款金额" align="center">-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>操作信息</span>
    </el-card>
    <el-table :data="baseInfoList" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="操作者" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="操作时间" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="订单状态" align="center">
      </el-table-column>
      <el-table-column prop="area" label="付款状态" align="center">
      </el-table-column>
      <el-table-column prop="area" label="发货状态" align="center">
      </el-table-column>
      <el-table-column prop="area" label="备注" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getOneorder} from '@/api/order'
  import { formatDate } from '@/assets/common/data.js'

  export default {
    name: "readorder",
    data() {
      return {
        consigneeMsg: [
          {person: "大梨", phone: '18000000000', postcode: '518000', area: '广东省深圳市南山区科兴科学园'}
        ],
        baseInfo:{},
        baseInfoList:[]
      }
    },
    filters:{
      showOrderStatus:function (data) {
         switch (data.orderStatus) {
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
      showArea(data){
        try{
          return data.provinceBean.name + "/" + data.cityBean.name + "/" + data.areaBean.name ;
        }catch (e) {
          return "获取地址出错";
        }
      },
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    created() {
      this.getList();
    },
    methods: {
      transport:function(row,index){
         let property = index.property;
         let  data = row.transportAgentBean;
         switch(property){
           case 'transportType':{
             return  this.transportType(row,index);
           }
           case 'address':{
                 try{
                     return data.provinceBean.name+"/"+data.cityBean.name+"/"+data.areaBean.name;
                 }catch(e){
                   return '地址读取错误'
                 }
           }
           case 'community':{
                 try{
                     return data.community;
                 }catch(e){
                   return '地址读取错误'
                 }
           }
           case 'detailAddress':{
                 try{
                     return data.detailAddress;
                 }catch(e){
                   return '地址读取错误'
                 }
           }
           case 'phone':{
                 try{
                     return data.phone;
                 }catch(e){
                   return '地址读取错误'
                 }
           }
           case 'name':{
                 try{
                     return data.name;
                 }catch(e){
                   return '地址读取错误'
                 }
           }


         }
      },

      transportType:function(row,index){

         let property = index.property;
         switch(row.transportType){
           case  10: return '代理配送';
           case  20: return '自提';
           case  30: return '快递';
           default:{
             return '错误';
           }
         }
      },
      showgoods:function(row,index){
        let property = index.property;
        let goods =row.goodsBean;
        switch (property) {
          case 'status':{
              switch (row.status) {
                case 'WaitDeliver': return "待发货";
                  break;
                case 'peisoged': return "已配送";
                  break;
                case 'returnsing': return "退货中";
                  break;
                case 'refunding': return "退款中";
                  break;
                case 'refunded': return "以退款";
                  break;
                case 'returns': return "退货成功";
                  break;
                case 'returnsfail': return "退货拒绝";
                  break;
                case 'delivered': return "已收货";
                  break;
                default: return "数据读取错误";
                  break;
              }
          }
          case 'deliveryType':{
            switch (row.deliveryType) {
                 case 'agent': return "团长发货";
                   break;
                 case 'store': return "仓库发货";
                   break;
                 default: return null;
                   break;
              }

          }
          case 'goodsName' :{
            return goods.goodsName;
          }
          case 'goodssku' :{
            try{
               return row.goodsSkuBean.skuCode;
            }catch(e){
              return '数据读取错误';
            }
          }
          case 'goodsmodule' :{
            try{
               return row.goodsSkuBean.skuKey +"/"+row.goodsSkuBean.skuValue ;
            }catch(e){
              return '数据读取错误';
            }
          }
          case 'price' :{
            return row.price;
          }
          case 'quantity' :{
            return row.quantity;
          }
          case 'payPrice' :{
            return row.payPrice;
          }
          case 'activityBean':{
            try{
              return row.activityBean.name;
            }catch (e) {
              return '获取活动数据错误';
            }
          }
          case 'agentShopBean':{
            try{
              return row.agentShopBean.name +"/" +row.agentShopBean.agentBean.name;
            }catch (e) {
              return '获取代理店铺数据错误';
            }
          }
          case 'supplierShopBean':{
            try{
              return row.supplierBean.name+"/"+row.supplierShopBean.shopName;
            }catch (e) {
              return '获取供应商数据错误';
            }
          }
             default:{
               return 'oo';
             }
        }

      },
      getList() {
        let params ={
          id:this.$route.query.id
        }
        getOneorder(params).then(res => {
          // console.log(res);
          this.baseInfo = res.result.result;
          this.baseInfoList.push(res.result.result);
        })
      },
      backPage() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .el-card:first-child{
    border: none;
  }
  .el-card{
    border: none;
  }
</style>
