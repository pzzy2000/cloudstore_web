<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :model="activityForm" label-width="120px" size="small" ref="activityForm" :rules="rules">
        <el-form-item label="活动名称：" prop="name">
          <el-input-dispatcher v-model="activityForm.name" placeholder="请输入活动名称" style="width: 350px" />
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime" >
          <el-date-picker v-model="activityForm.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable  :picker-options="startDatePicker" type="date" placeholder="请选择活动开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker v-model="activityForm.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable  :picker-options="endDatePicker" type="date" placeholder="请选择活动结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动图片(一张)：" prop="picture">
          <SingleUpload v-model="picture" logotype="activity"></SingleUpload>
        </el-form-item>
        <el-form-item label="活动海报图片(一张)：" prop="activePoster">
          <SingleUpload v-model="activePoster" logotype="haibao"></SingleUpload>
        </el-form-item>
        <el-checkbox v-model="checked" style="margin-left: 120px">是否参加佣金活动</el-checkbox>
        <div style="text-align: right">
          <el-button type="primary" size="small" @click="subActname('activityForm')">提 交</el-button>
          <el-button size="small" @click="resetForm('activityForm')" v-show="isshow">重 置</el-button>
          <el-button size="small" @click="toback">返 回</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {addActivity, getoneAct} from '@/api/activity';
  import {msg} from '@/api/iunits'
  import SingleUpload from '@/components/Upload/singleUpload';
  import { formatDate } from '@/assets/common/data.js'
  export default {
    name: "addactivity",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    components: {
      SingleUpload
    },
    data() {
      return {
        activityForm: {
          name: '',
          startTime: '',
          endTime: '',
          picture: [],
          activePoster: []
        },
        isshow: true,
        optType: 'save',
        rwDispatcherState: 'write',
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 4, message: "长度在2到4个字之间", trigger: "blur" }
          ],
          startTime: [{ required: true, message: '开始时间必填哦', trigger: 'blur' }],
          endTime: [{ required: true, message: '结束时间必填哦', trigger: 'blur' }],
          picture: [{ required: true, message: '必须上传图片', trigger: 'blur' }],
          activePoster: [{ required: true, message: '必须上传图片', trigger: 'blur' }]
        },
        checked: true,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        picture: [],
        activePoster: []
      }
    },
    created() {
      this.picture = [];
      if (this.$route.query.id !== undefined) {
        this.getOneact();
        this.optType = 'update';
        this.isshow = false;
      }
    },
    methods: {
      getOneact() {
        getoneAct({id: this.$route.query.id}).then(res => {
          this.activityForm = res.result.result;
          this.activityForm.startTime = new Date(this.activityForm.startTime);
          this.activityForm.endTime = new Date(this.activityForm.endTime);
          if (this.activityForm.addProfit == 1) {
            this.checked = true;
          }else {
            this.checked = false;
          }
          if (this.activityForm.picture !== null || this.activityForm.picture !== undefined) {
            let Picobj = {};
            Picobj.uid = this.activityForm.picture;
            Picobj.url = this.activityForm.picturePice;
            this.picture.push(Picobj);
          }
          if (this.activityForm.activePoster !== null || this.activityForm.activePoster !== undefined) {
            let actPicobj = {};
            actPicobj.uid = this.activityForm.activePoster;
            actPicobj.url = this.activityForm.posterPice;
            this.activePoster.push(actPicobj);
          }
        })
      },
      toback() {
        this.$router.back();
      },
      subActname(formName) {
        console.log(this.picture);
        let pic = []
        for (let i=0; i< this.picture.length; i++){
          pic.push(this.picture[i].uid);
        }
        this.activityForm.picture = pic;
        let activepic = []
        for (let i=0; i< this.activePoster.length; i++){
          activepic.push(this.activePoster[i].uid);
        }
        this.activityForm.activePoster = activepic;
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
        this.activityForm.startTime = formatDate(new Date(this.activityForm.startTime), 'yyyy-MM-dd');
        this.activityForm.endTime = formatDate(new Date(this.activityForm.endTime), 'yyyy-MM-dd');
        let obj = {
          name: this.activityForm.name,
          startTime: this.activityForm.startTime,
          endTime: this.activityForm.endTime,
          picture: this.activityForm.picture,
          activePoster: this.activityForm.activePoster,
          addProfit: changeCheck,
          optType: this.optType
        }
        console.log(obj);
        if (this.$route.query.id !== undefined) {
          obj.id = this.$route.query.id
          addActivity(obj).then(res => {
            if (res.result.code == 0) {
              msg("修改活动成功");
              this.$router.back();
            }
          })
        } else {
          addActivity(obj).then(res => {
            if (res.result.code == 0) {
              msg("添加活动成功");
              this.$router.back();
            }
          })
        }

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.picture = [];
        this.activePoster = [];
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
