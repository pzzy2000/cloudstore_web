<template> 
  <div>
    <el-upload :action="minioUploadUrl" :data="null" list-type="picture-card" :file-list="fileList" :before-upload="beforeUpload"
      :on-remove="handleRemove" :on-success="handleUploadSuccess" :on-preview="handlePreview" :limit="maxCount"
      :on-exceed="handleExceed" :headers="myHeaders">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {
    policy
  } from '@/api/oss'
  import {
    getToken
  } from '@/utils/auth'

  import {
    msg
  } from '@/api/iunits'

  var token = getToken(); // 要保证取到
  // alert(token);

  export default {
    name: 'localmultiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        myHeaders: {
          auth: token
        },
        dialogVisible: false,
        dialogImageUrl: null,
        useOss: false,
        minioUploadUrl: './platform/sys/upload/entity/image/update'
      };
    },

    computed: {
      fileList() {
        let fileList = [];
        if (typeof(this.value) == 'undefined') {
          return fileList;
        } else {
          // for (let i = 0; i < this.value.length; i++) {
          //   let  xx =  this.value[i];
          //   xx.url =xx.url+"&auth="+token;
          //   fileList.push(xx);
          //   // fileList.push({
          //   //   url: this.value[i].url+"&auth="+token
          //   // });
          // }
          return this.value;
        }

      }
    },
    methods: {
      emitInput(fileList) {
        // let value = [];
        // for (let i = 0; i < fileList.length; i++) {
        //   value.push(fileList[i]);
        // }

        // this.$emit('input', value)
        this.$emit('input', fileList);

      },
      handleRemove(file, fileList) {
        // this.$emit (fileList);
        this.$emit('input', fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url;
      },
      beforeUpload(file) {
        let _self = this;
        if (!this.useOss) {
          //不使用oss不需要获取策略
          return true;
        }
        return new Promise((resolve, reject) => {
          policy().then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + '/${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      },
      handleUploadSuccess(res, file) {

        let re = res.result;
        if (re.code == 0) {
          this.fileList.push({
            // name: file.name,
            id: re.result.id,
            url: re.result.url + "&auth=" + token,
            uid: re.result.id
          });
          this.emitInput(this.fileList);
        } else {
          msg("图片上传失败");
        }

      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传' + this.maxCount + '张图片',
          type: 'warning',
          duration: 1000
        });
      },
    }
  }
</script>
<style>
.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 58px;
    height: 58px;
    line-height: 66px;
    vertical-align: top;
    }
</style>
