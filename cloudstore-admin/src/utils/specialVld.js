//特殊字符验证
export function checkSpecialKey(str) {
  console.log(str.length);
  let specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) != -1) {
      return false;
    }
  }
  return true;
};
// export  function validateInput(rule, value, callback) {
//   if (!checkSpecialKey(value)) {
//     callback(new Error("不能含有特殊字符！！"));
//   } else {
//     callback();
//   }
// };
