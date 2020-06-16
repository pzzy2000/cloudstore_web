import { Message, MessageBox } from 'element-ui'

export function msg(msg) {
       Message({
             message: msg,
             type: 'info',
             duration: 3 * 1000
           })
  }

export function switchForm(data) {
let formData = new FormData();
      for (let key in data) {
        let key_=key;
        if(key_ == 'pageNum' || key_==='pageSize'){
          key_='commSearchBean.'+key_;
        }else if(key_ == 'optType'){
          key_=key_;
        }else{
          key_='bean.'+key_;
        }
        if(data[key]!=null){
         formData.append(key_, data[key]);
        }
      }
      return formData;
}
export function saveSupplier(data,info) {
let formData = new FormData();
      for (let key in data) {
        let key_=key;
        if(key_ == 'pageNum' || key_==='pageSize'){
          key_='commSearchBean.'+key_;
        }else if(key_ == 'optType'){
          key_=key_;
        }else{
          key_='baseinfo.'+key_;
        }
        if(data[key]!=null){
         formData.append(key_, data[key]);
        }
      }
      for (let key in info) {
        let key_=key;
        if(key_ == 'pageNum' || key_==='pageSize'){
          key_='commSearchBean.'+key_;
        }else if(key_ == 'optType'){
          key_=key_;
        }else{
          key_='blicense.'+key_;
        }
        if(info[key]!=null){
         formData.append(key_, info[key]);
        }
      }
      return formData;
}
