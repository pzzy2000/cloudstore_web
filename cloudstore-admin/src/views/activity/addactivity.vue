<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :model="activityForm" label-width="120px" size="small" ref="activityForm" :rules="rules">
        <el-form-item label="活动名称：" prop="activityName">
          <el-input-dispatcher v-model="activityForm.activityName" placeholder="请输入活动名称" style="width: 350px" />
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime" >
          <el-date-picker v-model="activityForm.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable  :picker-options="startDatePicker" type="date" placeholder="请选择活动开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker v-model="activityForm.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable  :picker-options="endDatePicker" type="date" placeholder="请选择活动结束时间"></el-date-picker>
        </el-form-item>
        <!--<el-form-item label="上架/下架：" prop="endTime">-->
          <!--<el-radio-group v-model="activityForm.radio">-->
            <!--<el-radio :label="3">上架</el-radio>-->
            <!--<el-radio :label="6">下架</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="活动描述：" prop="desc">-->
          <!--<el-input type="textarea" v-model="activityForm.desc" style="width: 500px;" rows="5" placeholder="请输入描述"></el-input>-->
        <!--</el-form-item>-->
        <el-checkbox v-model="checked" style="margin-left: 120px">是否参加佣金活动</el-checkbox>
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
          activityName: '',
          startTime: '',
          endTime: ''
        },
        rwDispatcherState: 'write',
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 4, message: "长度在2到4个字之间", trigger: "blur" }
          ],
          startTime: [{ required: true, message: '开始时间必填哦', trigger: 'blur' }],
          endTime: [{ required: true, message: '结束时间必填哦', trigger: 'blur' }],
        },
        checked: true,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      }
    },
    methods: {
      toback() {
        this.$router.back();
      },
      subActname(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.checked){
              this.$confirm('勾选了参加佣金活动，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.submitAct();
              }).catch((e) => e);
            }else{
              this.$confirm('没勾选参加佣金活动，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.submitAct();
              }).catch((e) => e);
            }
          }
        })
      },
      submitAct() {
        let changeCheck;
        if (this.checked){
          changeCheck = '1'
        }else {
          changeCheck = '0'
        }
        let obj = {
          name: this.activityForm.activityName,
          startTime: this.activityForm.startTime,
          endTime: this.activityForm.endTime,
          addProfit: changeCheck,
          optType: "save"
        }
        console.log(obj);
        addActivity(obj).then(res => {
          if (res.result.code == 0) {
            msg("添加活动成功");
            this.$router.back();
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
      },
      beginDate(){
        const self = this
        return {
          disabledDate(time){
            if (self.activityForm.endTime !== '') {  //如果结束时间不为空，则小于结束时间
              return new Date(self.activityForm.endTime).getTime() < time.getTime()
            } else {
              return time.getTime() <= Date.now() - 8.64e7
            }
          }
        }
      },
      processDate() {
        const  self = this
        return {
          disabledDate(time) {
            if (self.activityForm.startTime !== '') {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.activityForm.startTime).getTime() > time.getTime()
            } else {
              return time.getTime() <= Date.now() - 8.64e7
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
