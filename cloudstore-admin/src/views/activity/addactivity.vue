<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :model="activityForm" label-width="120px" size="small" ref="activityForm" :rules="rules">
        <el-form-item label="活动名称：" prop="activityName">
          <el-input-dispatcher v-model="activityForm.activityName" placeholder="请输入活动名称" style="width: 350px" />
        </el-form-item>
        <div style="text-align: right">
          <el-button type="primary" size="small" @click="subActname('activityForm')">提 交</el-button>
          <el-button size="small" @click="resetForm('activityForm')">重 置</el-button>
          <el-button size="small" @click="toback">返 回</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {
    addActivity
  } from '@/api/activity';
  import {
    msg
  } from '@/api/iunits'
  export default {
    name: "addactivity",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        activityForm: {
          activityName: ''
        },
        rwDispatcherState: 'write',
        rules: {
          activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
        }
      }
    },
    methods: {
      toback() {
        this.$router.back();
      },
      subActname(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addActivity({
              name: this.activityForm.activityName,
              optType: "save"
            }).then(res => {
              if (res.result.code == 0) {
                msg("添加活动成功");
                this.$router.push("/sys/activity/list")
              }
            })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$message({
          message: '重置成功',
          type: 'success',
          duration: 800
        });
      }
    }
  }
</script>

<style scoped>

</style>
