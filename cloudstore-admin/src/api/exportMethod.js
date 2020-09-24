import axios from 'axios'
import {getToken} from "../utils/auth";
import {switchForm} from "@/api/iunits";

// 导出Excel公用方法
export function exportMethod(data) {
  return new Promise(function (resolve, reject) {
    axios({
      headers: {
        'auth': getToken()
      },
      method: data.method,
      url: data.url,
      data: switchForm(data.data),
      responseType: 'arraybuffer'
    }).then((res) => {
      // res.setHeader("Content-Disposition", "attachment;filename*=utf-8'zh_cn'");
      const link = document.createElement('a')
      let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.download = res.headers['content-disposition'].split(';')[1].split('=')[1] //下载后文件名
      // link.download = data.fileName //下载的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      resolve(0);
    }).catch(error => {
      // this.$message({
      //   message: '错误',
      //   type: 'error',
      //   duration: 800
      // })
      console.log(error)
      reject(error)
    })
  })
}
