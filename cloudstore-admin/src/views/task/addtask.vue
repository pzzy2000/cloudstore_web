<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px">
      <el-divider content-position="left"><i class="el-icon-search"></i>添加任务</el-divider>
      <el-form label-width="150px" :model="taskList" :rules="rules" ref="taskList">
        <el-form-item label="任务名称：" prop="name">
          <el-input-dispatcher placeholder="请输入任务名称" v-model="taskList.name" style="width: 300px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="任务类型：" prop="type">
          <el-select v-model="taskList.type" placeholder="请选择任务类型" clearable>
            <el-option label="定时" value="timer">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始时间：" prop="startTime">
          <el-date-picker v-model="taskList.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="执行计划：" prop="exePlan">
          <el-input-dispatcher placeholder="请输入执行计划" v-model="taskList.exePlan" style="width: 300px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="执行方法：" prop="className">
          <el-input-dispatcher placeholder="请输入执行方法" v-model="taskList.className" style="width: 300px"></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="计划描述：" prop="desc">
          <el-input-dispatcher type="textarea" placeholder="请输入计划描述" v-model="taskList.desc" style="width: 300px" rows="3"></el-input-dispatcher>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="addLogis('taskList')" v-show="rwDispatcherState === 'write'" size="mini">提交</el-button>
          <el-button @click="resetForm('taskList')" v-show="optType == 'save'" size="mini">重置</el-button>
          <el-button v-show="rwDispatcherState === 'write'" @click="backLastpage" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {planSave} from '@/api/task';
  export default {
    name: "addtask",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        taskList: {
          name: '',
          type: '',
          startTime: '',
          exePlan: '',
          className: '',
          desc: ''
        },
        rwDispatcherState: 'write',
        rules: {
          name: [
            {required: true, message: '请输入公司名称', trigger: 'blur'},
          ],
          code: [
            {required: true, message: '请输入公司编码', trigger: 'blur'},
          ],
        },
        logisId: '',
        optType: ''
      }
    },
    // created() {
    //   if (this.$route.query.rds !== undefined){
    //     this.logisticsList.name = this.$route.query.name;
    //     this.logisticsList.code = this.$route.query.code;
    //   }
    //   this.optType = this.$route.query.optType;
    // },
    methods: {
      addLogis(formName) {
        let obj = {
          name: this.taskList.name,
          type: this.taskList.type,
          startTime: this.taskList.startTime,
          exePlan: this.taskList.exePlan,
          className: this.taskList.className,
          desc: this.taskList.desc,
          status: 'stop',
          optType: 'save'
        }
        planSave(obj).then(res => {
          console.log(res);
          return;
          if (res.result.code == 0){
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.$router.push("/sys/task/list")
          }
        })
      },
      backLastpage() {
        this.$router.push("/sys/task/list")
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
