/*富文本编辑图片上传配置*/

import {
    getToken
  } from '@/utils/auth'

  import {
    msg
  } from '@/api/iunits'

  var token = getToken(); // 要保证取到
  // alert(token);
const uploadConfig = {
    // action:  './platform/sys/upload/entity/oss/ali/update?targetType=spjs',  // 必填参数 图片上传地址 http://106.52.184.24:18888
    action:  './platform/sys/upload/entity/oss/ali/update?targetType=spjs',  // 必填参数 图片上传地址
    methods: 'POST',  // 必填参数 图片上传方式
    token: token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'file',  // 必填参数 文件的参数名
    size: 10240,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['link', 'image', 'video']
];
const handlers = {
    image: function image() {
        var self = this;

        var fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name);
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept);
            fileInput.classList.add('ql-image');
            // 监听选择文件
            fileInput.addEventListener('change', function () {
                // 创建formData
                var formData = new FormData();
                formData.append(uploadConfig.name, fileInput.files[0]);
                // formData.append('object','product');
                // 如果需要token且存在token
                if (uploadConfig.token) {
                    formData.append('auth', uploadConfig.token)
                }
                // 图片上传
                var xhr = new XMLHttpRequest();
                xhr.open(uploadConfig.methods, uploadConfig.action, true);
                // 上传数据成功，会触发
                xhr.onload = function (e) {
                    if (xhr.status === 200) {
                        msg("图片上传成功");
                        let res = JSON.parse(xhr.responseText);
                        let  result  =res.result;
                        if(result.code == 0){
                        let length = self.quill.getSelection(true).index;
                        //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                        self.quill.insertEmbed(length, 'image', result.result.url);
                        self.quill.setSelection(length + 1)
                        }else{
                           msg('上传失败，图片不能超过1M');
                        }
                    }else{
                          msg('上传失败，图片不能超过1M');// 7/29  17：08  走的这个
                    }
                    fileInput.value = ''
                };
                // 开始上传数据
                xhr.upload.onloadstart = function (e) {
                  msg("图片开始上传");
                    fileInput.value = ''
                };
                // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
                xhr.upload.onerror = function (e) {
                  msg("上传失败，图片不能超过1M");
                };
                // 上传数据完成（成功或者失败）时会触发
                xhr.upload.onloadend = function (e) {
                  // a+b;
                    // console.log(e)
                };
                xhr.send(formData)
            });
            this.container.appendChild(fileInput);
        }
        fileInput.click();
    }
};

export default {
    placeholder: '',
    theme: 'snow',  // 主题
    modules: {

    	 clipboard: {
             // 粘贴版，处理粘贴时候带图片
             matchers: [[Node.ELEMENT_NODE, function(node, Delta){
             	      let ops = []
             	      Delta.ops.forEach(op => {
             	    	  let re=false;

             	        if (op.insert &&  ((typeof op.insert === 'string') ||  (typeof op.insert =='object' &&  typeof op.insert['image'] !='undefined')   )  ) {// 如果粘贴了图片，这里会是一个对象，所以可以这样处理
             	          ops.push({
             	            insert: op.insert,
             	          })
             	        }
             	      })
             	      Delta.ops = ops
             	      return Delta

             }]],
           },
        toolbar: {
            container: toolOptions,  // 工具栏选项
            handlers: handlers  // 事件重写
        }
    }
};
