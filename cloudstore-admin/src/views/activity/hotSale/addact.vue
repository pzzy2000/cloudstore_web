<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-divider content-position="left"><i class="el-icon-search"></i>添加线下活动</el-divider>
      <el-form :model="activityForm" label-width="120px" size="small" ref="activityForm" :rules="rules">
        <el-form-item label="活动名称：" prop="name">
          <el-input-dispatcher v-model="activityForm.name" placeholder="请输入活动名称" style="width: 350px" />
        </el-form-item>
<!--        <el-form-item label="请选择代理：" prop="agentId">-->
<!--          <el-select v-model="activityForm.agentId" placeholder="请选择活动类型代理" clearable>-->
<!--            <el-option v-for="item in agentList" :key="item.id" :label="item.name" :value="item.id">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="开始时间：" prop="startTime" >
          <el-date-picker v-model="activityForm.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable  :picker-options="startDatePicker" type="date" placeholder="请选择活动开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker v-model="activityForm.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable  :picker-options="endDatePicker" type="date" placeholder="请选择活动结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动类型：" prop="toType">
          <el-select v-model="activityForm.toType" placeholder="请选择活动类型" clearable>
            <el-option v-for="item in toTypelist" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动图片(一张)：" prop="picture">
          <SingleUpload v-model="picture" logotype="activity"></SingleUpload>
        </el-form-item>
        <el-form-item label="活动海报图片(一张)：" prop="activePoster" v-if="activityForm.toType == 'haibao' ? true : false">
          <SingleUpload v-model="activePoster" logotype="haibao"></SingleUpload>
        </el-form-item>
<!--        <el-checkbox v-model="checked" style="margin-left: 120px">是否参加佣金活动</el-checkbox>-->
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
  import { fetchListall } from '@/api/activity'
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
          agentId: '',
          startTime: '',
          endTime: '',
          picture: [],
          activePoster: [],
          toType: ''
        },
        isshow: true,
        optType: 'save',
        rwDispatcherState: 'write',
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            // { min: 2, max: 4, message: "长度在2到4个字之间", trigger: "blur" }
          ],
          agentId: [{ required: true, message: '请选择代理', trigger: 'change' }],
          startTime: [{ required: true, message: '开始时间必填哦', trigger: 'blur' }],
          endTime: [{ required: true, message: '结束时间必填哦', trigger: 'blur' }],
          picture: [{ required: true, message: '必须上传图片', trigger: 'change' }],
          activePoster: [{ required: true, message: '必须上传图片', trigger: 'change'}],
          toType: [{ required: true, message: '活动类型不能为空', trigger: 'change' }]
        },
        // checked: false,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        picture: [],
        activePoster: [],
        toTypelist: [{label: '商品列表', value: 'list'}, {label: '海报', value: 'haibao'}],
        agentList: []
      }
    },
    created() {
      this.picture = [];
      if (this.$route.query.id !== undefined) {
        this.getOneact();
        this.optType = 'update';
        this.isshow = false;
      };
      this.getAgentlist();
    },
    methods: {
      getAgentlist() {
        fetchListall({pageNum: 1, pageSize: 10, optType: 'search'}).then(response => {
          if (response.result.code == 0) {
            this.agentList = response.result.result.records;
            let obj = {name: '公司', id: -1};
            this.agentList.unshift(obj);
          }
        });
      },
      getOneact() {
        getoneAct({id: this.$route.query.id}).then(res => {
          this.activityForm = res.result.result;
          this.activityForm.startTime = new Date(this.activityForm.startTime);
          this.activityForm.endTime = new Date(this.activityForm.endTime);
          // if (this.activityForm.addProfit == 1) {
          //   this.checked = true;
          // }else {
          //   this.checked = false;
          // }
          if (this.activityForm.picture !== null && this.activityForm.picture !== undefined) {
            let Picobj = {};
            Picobj.uid = this.activityForm.picture;
            Picobj.url = this.activityForm.picturePice;
            this.picture.push(Picobj);
          }
          if (this.activityForm.activePoster !== null && this.activityForm.activePoster !== undefined) {
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
        let pic = []
        for (let i=0; i< this.picture.length; i++){
          pic.push(this.picture[i].uid);
        }
        this.activityForm.picture = pic;
        let activepic = []
        for (let i=0; i< this.activePoster.length; i++){
          activepic.push(this.activePoster[i].uid);
        }
        this.$set(this.activityForm, 'activePoster', activepic)
        // this.activityForm.activePoster = activepic;
        console.log(this.activityForm);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确定提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitAct();
            }).catch(e => e)
          }
        })
      },
      submitAct() {
        // let changeCheck;
        // if (this.checked){
        //   changeCheck = '1'
        // }else {
        //   changeCheck = '0'
        // }
        this.activityForm.startTime = formatDate(new Date(this.activityForm.startTime), 'yyyy-MM-dd');
        this.activityForm.endTime = formatDate(new Date(this.activityForm.endTime), 'yyyy-MM-dd');
        let obj = {
          name: this.activityForm.name,
          agentId: this.activityForm.agentId,
          startTime: this.activityForm.startTime,
          endTime: this.activityForm.endTime,
          picture: this.activityForm.picture,
          activePoster: this.activityForm.activePoster,
          addProfit: 1,
          optType: this.optType,
          toType: this.activityForm.toType,
          type: 2
        }
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
