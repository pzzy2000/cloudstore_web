<template>
    <div>
      <el-card class="operate-container" shadow="never" style="margin: 20px">
        <i class="el-icon-tickets"></i>
        <span>发货列表</span>
      </el-card>
      <el-table :data="baseInfo" border style="margin: 0 20px; width: 98%">
        <el-table-column prop="code" label="订单编号" align="center">
        </el-table-column>
        <el-table-column prop="person" label="收货人" align="center">
        </el-table-column>
        <el-table-column prop="phonenum" label="手机号码" align="center">
        </el-table-column>
        <el-table-column prop="postcode" label="邮政编码" align="center">
        </el-table-column>
        <el-table-column prop="area" label="收货地址" align="center">
        </el-table-column>
        <el-table-column prop="distype" label="配送方式" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.distype" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="input" label="物流单号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.input" placeholder="请输入物流单号"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 20px 0 20px; text-align: center">
        <el-button type="primary">确定</el-button>
        <el-button style="margin-left: 50px">取消</el-button>
      </div>
    </div>
</template>

<script>
    export default {
      name: "index",
      data() {
        return {
          baseInfo: [
            {code: '111', person: '222', phonenum: '333', postcode: '444', area: '555'}
          ],
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }]
        }
      }
    }
</script>

<style scoped>

</style>
