<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>默认佣金 百分比 </span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <table class="datatable">
        <thead>
        <tr>
          <th width="80">
            &nbsp;
          </th>
          <th>
            团长分享佣金
          </th>
          <th>
            代理分享佣金
          </th>
          <th>
            客户分享佣金
          </th>
          <th>
            配送佣金
          </th>
          <th>
            分享积分
          </th>
          <th>
            购买积分
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            默认
          </td>
          <td>
            {{orderList.leader}}%
          </td>
          <td>
            {{orderList.agent}}%
          </td>
          <td>
            {{orderList.client}}%
          </td>
          <td>
            {{orderList.delivery}}%
          </td>
          <td>
            {{orderList.sharePoints}}
          </td>
          <td>
            {{orderList.clientPoints}}
          </td>
        </tr>
        <tr>
          <td>
            最大值
          </td>
          <td>
            {{orderList.maxLeader}}%
          </td>
          <td>
            {{orderList.maxAgent}}%
          </td>
          <td>
            {{orderList.maxClient}}%
          </td>
          <td>
            {{orderList.maxDelivery}}%
          </td>
          <td>
            {{orderList.maxSharePoints}}
          </td>
          <td>
            {{orderList.maxClientPoints}}
          </td>
        </tr>

        </tbody>
      </table>


    </div>
  </div>
</template>

<script>
  import {getdefbroke} from '@/api/brokerage'

  export default {
    name: "index",
    data() {
      return {
        orderList: {},
        listLoading: true
      }
    },
    created() {
      this.getList();
    },
    filters: {
      changeMsg(data) {
        try {
          return data;
        } catch (e) {
          return "数据读取出错"
        }
      }
    },
    methods: {
      // delLogis() {
      //   console.log("1");
      // },
      getList() {
        getdefbroke({id: 1}).then(res => {
          console.log(res);
          this.listLoading = false;
          this.orderList = res.result.result;
        })
      }
    }
  }
</script>

<style>

  .datatable {
    border: 1px solid #ddd;
    border-collapse: collapse;
    width: 100%;

  }

  .datatable td, .datatable th {

    border: 1px solid #ddd;
    text-align: center;
    padding: 0.2em;
  }

  .datatable th {
    border: 1px solid #ddd;
    #background-color: gray;
    font: 14px;
    text-align: center;
    padding: 0.2em;

  }

  .datatable caption {
    font: 14px;
    background: #B0C4DE;
    color: #33517A;
    padding: 0.4em 0 0.3em 0;
    border: 1px solid #789AC6;


  }

  .datatable tr:hover {

    background-color: #DEF7F2;
    color: #000000;
  }

</style>
