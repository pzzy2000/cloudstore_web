<template>
  <div>
    <div style="margin: 20px">
      <span>请选择上传首页轮播图的图片(最多五张):</span>
      <el-button type="primary" size="small" @click="submit" style="float: right;margin-right: 50px">提交</el-button>
    </div>
    <div style="margin: 20px">
      <MultiUpload v-model="picture"></MultiUpload>
    </div>
  </div>
</template>

<script>
  import MultiUpload from '@/components/Upload/multiUpload';
  import {submitPics, getIndexpic} from '@/api/indexSlid'
  export default {
    name: "slideshow",
    components: {
      MultiUpload
    },
    data() {
      return {
        picture: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        getIndexpic().then(res => {
          console.log(res);
        })
      },
      submit() {
        if (this.picture.length !== 0) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let pics = []
            for (let i=0; i<this.picture.length; i++) {
              pics.push(this.picture[i].uid);
            }
            console.log(pics)
            submitPics({pice: pics, optType: 'save'}).then(res => {
              console.log(res);
              if (res.result.code == 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 800
                })
              }
            })
          })
        } else {
          this.$message({
            message: '请选择图片',
            type: 'warning',
            duration: 800
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
