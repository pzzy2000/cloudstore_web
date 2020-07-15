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
      <div style="color: #f06d44; display: inline-block; float: left; text-indent: 20px">
        当前订单状态:{{this.baseInfo|showOrderStatus}}
      </div>
      <div style="float: right; margin-right: 20px">
<!--        <el-button size="mini">修改收货人信息</el-button>-->
<!--        <el-button size="mini">修改费用信息</el-button>-->
<!--        <el-button size="mini">发送站内信息</el-button>-->
        <el-button size="mini">关闭订单</el-button>
        <el-button size="mini">备注订单</el-button>
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
      <el-table-column prop="payTime" label="支付时间" align="center">
      </el-table-column>
      <el-table-column prop="weixinNumber" label="微信流水号" align="center">
      </el-table-column>
<!--      <el-table-column prop="area" label="订单类型" align="center">-->
<!--      </el-table-column>-->
    </el-table>
<!--    <el-table :data="baseInfo" border style="width: 96%; margin-left: 2%">-->
<!--      <el-table-column prop="person" label="配送方式" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="supplierId" label="物流单号" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="postcode" label="自动确认收货时间" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="area" label="订单可得优币" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="area" label="订单可得成长值" align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="area" label="活动信息" align="center">-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>收货人信息</span>
    </el-card>
    <el-table :data="baseInfoList" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="clientAddressBean.name" label="收货人" align="center" >

      </el-table-column>
      <el-table-column prop="clientAddressBean.phone" label="手机号码" align="center">
      </el-table-column>
      <el-table-column prop="clientAddressBean.detailAddress" label="地址" align="center" :formatter="showArea">
      </el-table-column>
      <el-table-column prop="clientAddressBean.detailAddress" label="地址" align="center">
      </el-table-column>
    </el-table>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>商品信息</span>
    </el-card>
    <el-table :data="baseInfo.orderDetailsBean" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="goodsName" label="商品名称" align="center" :formatter="showgoods">
      </el-table-column>
      <el-table-column prop="goodsId" label="商品名称" align="center">
      </el-table-column>
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
    <
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

  export default {
    name: "readorder",
    data() {
      return {
        consigneeMsg: [
          {person: "大梨", phone: '18000000000', postcode: '518000', area: '广东省深圳市南山区科兴科学园'}
        ],
        baseInfo:{},
        baseInfoList:[],
        parentObj: {}
      }
    },
    filters:{

      showOrderStatus:function (data) {
             switch (data.orderStatus) {
                case 'payed':{
                  return "已支付"
                }
                default:{
                  return data.orderStatus;
                }
             }
      }
    },
    created() {
      this.parentObj = this.$route.params.obj;
      console.log(this.parentObj);
      this.getList();
    },
    methods: {
      showgoods:function(row,index){
        let property = index.property;
        console.log(row,index);
        let  goods =row.goodsBean;
        switch (property) {
             case 'goodsName' :{
               return goods.goodsName;
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
      showArea(data){
        try{
             let address = data.clientAddressBean;
             return address.provinceBean.name +"/"+address.cityBean.name+"/"+address.areaBean.name;
        }catch (e) {
          return "获取地址出错";
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
