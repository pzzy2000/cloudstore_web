<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <el-steps :active="2" align-center finish-status="success">
        <el-step title="提交订单" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="支付订单" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="平台发货" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="确认收货" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="完成评价" description="这是一段很长很长很长的描述性文字"></el-step>
      </el-steps>
    </el-card>
    <div style="background-color: #f3f3f3; height: 70px; line-height: 70px; overflow: hidden">
      <div style="color: #f06d44; display: inline-block; float: left; text-indent: 20px">当前订单状态：待付款</div>
      <div style="float: right; margin-right: 20px">
        <el-button size="mini">修改收货人信息</el-button>
        <el-button size="mini">修改费用信息</el-button>
        <el-button size="mini">发送站内信息</el-button>
        <el-button size="mini">关闭订单</el-button>
        <el-button size="mini">备注订单</el-button>
      </div>
    </div>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>基本信息</span>
    </el-card>
    <el-table :data="baseInfo" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="订单编号" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="发货单流水号" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="用户账号" align="center">
      </el-table-column>
      <el-table-column prop="area" label="支付方式" align="center">
      </el-table-column>
      <el-table-column prop="area" label="订单来源" align="center">
      </el-table-column>
      <el-table-column prop="area" label="订单类型" align="center">
      </el-table-column>
    </el-table>
    <el-table :data="baseInfo" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="配送方式" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="物流单号" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="自动确认收货时间" align="center">
      </el-table-column>
      <el-table-column prop="area" label="订单可得优币" align="center">
      </el-table-column>
      <el-table-column prop="area" label="订单可得成长值" align="center">
      </el-table-column>
      <el-table-column prop="area" label="活动信息" align="center">
      </el-table-column>
    </el-table>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>收货人信息</span>
    </el-card>
    <el-table :data="consigneeMsg" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="收货人" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="邮政编码" align="center">
      </el-table-column>
      <el-table-column prop="area" label="地址" align="center">
      </el-table-column>
    </el-table>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>商品信息</span>
    </el-card>
    <el-table :data="baseInfo" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="商品图片" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="价格/货号" align="center">
      </el-table-column>
      <el-table-column prop="area" label="属性" align="center">
      </el-table-column>
      <el-table-column prop="area" label="库存" align="center">
      </el-table-column>
      <el-table-column prop="area" label="小计" align="center">
      </el-table-column>
    </el-table>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>费用信息</span>
    </el-card>
    <el-table :data="consigneeMsg" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="商品合计" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="运费" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="优惠券" align="center">
      </el-table-column>
      <el-table-column prop="area" label="优币抵扣" align="center">
      </el-table-column>
    </el-table>
    <el-table :data="consigneeMsg" border style="width: 96%; margin-left: 2%">
      <el-table-column prop="person" label="活动优惠" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="折扣金额" align="center">
      </el-table-column>
      <el-table-column prop="postcode" label="订单总金额" align="center">
      </el-table-column>
      <el-table-column prop="area" label="应付款金额" align="center">
      </el-table-column>
    </el-table>
    <el-card shadow="never" style="margin: 0 20px">
      <i class="el-icon-tickets"></i>
      <span>操作信息</span>
    </el-card>
    <el-table :data="baseInfo" border style="width: 96%; margin-left: 2%">
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
  const defaultList = {
    pageNum: 1,
    pageSize: 10
  };
  export default {
    name: "readorder",
    data() {
      return {
        consigneeMsg: [
          {person: "大梨", phone: '18000000000', postcode: '518000', area: '广东省深圳市南山区科兴科学园'}
        ],
        baseInfo: [],
        parentObj: {}
      }
    },
    created() {
      this.parentObj = this.$route.params.obj;
      console.log(this.parentObj);
      this.getList();
    },
    methods: {
      getList() {
        defaultList.orderId = this.$route.params.id;
        getOneorder(defaultList).then(res => {
          console.log(res);
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
