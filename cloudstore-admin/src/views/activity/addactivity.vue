<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :model="activityForm" label-width="120px" size="small">
        <el-form-item label="活动名称：">
          <el-input-dispatcher v-model="activityForm.activityName" placeholder="请输入活动名称" style="width: 350px" />
        </el-form-item>
        <div style="text-align: center">
          <el-button
            type="primary"
            size="small"
            @click="subActname"
          >提交</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
    import { addActivity } from '@/api/tracking'
    export default {
      name: "addactivity",
      provide () {
        return {
          rwDispatcherProvider: this
        }
      },
      data() {
        return {
          activityForm: {
            activityName: ''
          },
          rwDispatcherState: 'write'
        }
      },
      methods: {
        subActname() {
          if (this.activityForm.activityName == ''){
            alert("请输入活动名称")
          }else {
            addActivity({name: this.activityForm.activityName, optType: "save"}).then(res => {
              console.log(res);
              if (res.result.code == 0){
                this.$router.push("/sys/activity/list")
              }
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
