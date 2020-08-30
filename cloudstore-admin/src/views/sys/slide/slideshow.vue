<template>
  <div style="margin: 20px">
    <el-form :model="activityForm" label-width="120px" size="small" ref="activityForm" :rules="rules">
      <el-form-item label="海报名称：" prop="name">
        <el-input v-model="activityForm.name" placeholder="请输入海报名称" style="width: 350px" />
      </el-form-item>
      <el-form-item label="上传图片：" prop="picture">
        <SingleUpload v-model="activityForm.picture" logotype="lunbo"></SingleUpload>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select v-model="activityForm.type" placeholder="请选择类型" @change="changeShow" clearable>
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动：" prop="active" v-if="activityForm.type == 'active' ? true : false">
        <el-select v-model="activityForm.active" placeholder="请选择类型" clearable>
          <el-option v-for="item in activeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接：" prop="url" v-if="activityForm.type == 'url' ? true : false">
        <el-input v-model="activityForm.url" style="width: 350px"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin: 20px">
      <el-button size="small" @click="backPage" style="float: right;margin-right: 50px">返回</el-button>
      <el-button v-if="toggleShow" type="primary" size="small" @click="submitForm('activityForm')" style="float: right;margin-right: 20px">提交</el-button>
      <el-button v-else type="primary" size="small" @click="updateForm('activityForm')" style="float: right;margin-right: 20px">更新</el-button>
    </div>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload';
  import {submitPics, getInfo, getActiveList} from '@/api/indexSlid'
  export default {
    name: "slideshow",
    components: {
      SingleUpload
    },
    data() {
      return {
        picture: [],
        activityForm: {
          name: '',
          picture: [],
          type: '',
          active: ''
        },
        typeOptions: [
          {label: '活动', value: 'active'},
          {label: '链接', value: 'url'},
          {label: '无', value: 'none'}
        ],
        rules: {
          name: [{required: true, message: '请输入海报名称', trigger: 'blur'}],
          picture: [{required: true, message: '图片不能为空', trigger: 'change'}],
          type: [{required: true, message: '类型不能为空', trigger: 'change'}],
          active: [{required: true, message: '活动不能为空', trigger: 'change'}],
          url: [{required: true, message: '链接不能为空', trigger: 'blur'}]
        },
        activeList: [],
        toggleShow: true
      }
    },
    created() {
      if (this.$route.query.id !== undefined) {
        this.getList();
        this.toggleShow = false;
      }
    },
    methods: {
      getList() {
        getInfo({id: this.$route.query.id}).then(res => {
          console.log(res);
          let data = res.result.result;
          this.activityForm.name = data.name;
          let pics = [];
          let picobj = {};
          picobj.uid = data.pice;
          picobj.url = data.piceUrl;
          pics.push(picobj);
          this.activityForm.picture = pics;
          this.activityForm.type = data.type;
          this.changeShow(data.type)
          if (data.type == "active") {
            this.activityForm.active = data.relatedId;
          } else {
            this.activityForm.url = data.url;
          }
        })
      },
      changeShow(event) {
        if (event == 'active') {
          getActiveList().then(res => {
            this.activeList = res.result.result.records;
          })
        }
      },
      submitForm(formName) {
        this.SaveOrUpdate(formName, "save");
      },
      updateForm(formName) {
        this.SaveOrUpdate(formName, "update");
      },
      SaveOrUpdate(formName, opt) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj ={};
            let pics = []
            for (let i=0; i<this.activityForm.picture.length; i++) {
              pics.push(this.activityForm.picture[i].uid);
            }
            if (this.activityForm.type == 'active') {
              obj.name = this.activityForm.name;
              obj.pice = pics;
              obj.type = this.activityForm.type;
              obj.relatedId = this.activityForm.active;
              obj.optType = opt
            } else {
              obj.name = this.activityForm.name;
              obj.pice = pics;
              obj.type = this.activityForm.type;
              obj.url = this.activityForm.url;
              obj.optType = opt
            }
            if (this.$route.query.id !== undefined) {
              obj.id = this.$route.query.id;
            }
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              submitPics(obj).then(res => {
                if (res.result.code == 0) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    duration: 800
                  })
                }
                this.$router.back();
              })
            })
          }
        })
      },
      backPage() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
