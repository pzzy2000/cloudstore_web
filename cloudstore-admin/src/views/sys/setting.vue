<template>
  <div style="margin-top: 20px">
    <el-form :model="pageList" size="small" label-width="48%">
      <el-form-item label="订单超时时间：" prop="code">
        <el-date-picker-dispatcher v-model="pageList.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" clearable>
        </el-date-picker-dispatcher>
      </el-form-item>
      <el-form-item label="自动确认收货时间：" prop="code">
        <el-date-picker-dispatcher v-model="pageList.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" clearable>
        </el-date-picker-dispatcher>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button type="primary" @click="update" size="small" v-show="rwDispatcherState == 'read' ? true : false">修改</el-button>
      <el-button type="primary" @click="submit" size="small" v-show="rwDispatcherState == 'write' ? true : false">提交</el-button>
      <el-button @click="cancel" size="small" v-show="rwDispatcherState == 'write' ? true : false">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "setting",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        pageList: {},
        rwDispatcherState: 'read'
      }
    },
    methods: {
      update() {
        this.rwDispatcherState = "write";
      },
      submit() {},
      cancel() {
        this.rwDispatcherState = "read";
      }
    }
  }
</script>

<style scoped>

</style>
