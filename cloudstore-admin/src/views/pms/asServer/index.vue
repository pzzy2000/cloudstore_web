<template>
  <div style="margin: 20px">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="条款标题" prop="tit">
        <el-input v-model="form.tit"></el-input>
      </el-form-item>
    </el-form>
    <p style="text-indent: 30px;font-size: 14px; color: #606266">请在下方输入服务条款：</p>
    <div style="margin: 0 50px; position: relative">
      <quillEditor style="height: 600px" v-model="value" :options="quillOption"></quillEditor>
      <el-button class="button" type="primary" @click="submit" size="small" v-if="opt == 'save' ? true : false">提交</el-button>
      <el-button class="button" type="primary" @click="updateInfo" size="small" v-if="opt == 'update' ? true : false">更新</el-button>
      <el-button class="backPage" @click="backPage" size="small">返回</el-button>
    </div>
  </div>
</template>

<script>
  import quillConfig from '@/components/quill-config.js'
  import {getRulesInfo, saveRule, updateRule} from  '@/api/goodsAsServer'
  import  { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    name: "index",
    components: {
      quillEditor
    },
    data() {
      return {
        form: {
          tit: ''
        },
        value: '',
        quillOption: quillConfig,
        rules: {
          tit: [{require: true, message: '标题不能为空', trigger: 'blur'}]
        },
        opt: ''
      }
    },
    created() {
      if (this.$route.query.id !== undefined) {
        this.getInfo();
      }
      this.opt = this.$route.query.optType;
      console.log(this.opt);
    },
    methods: {
      submit() {
        this.$confirm('确定要提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveRule({title: this.form.tit, desc: this.value, optType: 'save'}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 800
              })
              this.$router.go(-1);
            }
          })
        })
      },
      getInfo() {
        getRulesInfo({id: this.$route.query.id}).then(res => {
          console.log(res);
          this.form.tit = res.result.result.title;
          this.value = res.result.result.desc;
        })
      },
      backPage() {
        this.$router.go(-1);
      },
      updateInfo() {
        this.$confirm('确定要更新吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateRule({id: this.$route.query.id, title: this.form.tit, desc: this.value, optType: 'update'}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 800
              })
              this.$router.go(-1);
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  .button{
    position: absolute;
    top: 5px;
    right: 100px;
  }
  .backPage{
    position: absolute;
    top: 5px;
    right: 30px;
  }
</style>
