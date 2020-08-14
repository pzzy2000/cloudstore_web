<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    popper-class="selectstyle"
    ref="select"
    @change="resetOpt">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import {fetchList} from '@/api/remote'
  export default {
    name: 'index',
    props: ['url'],
    data() {
      return {
        options: [],
        value: [],
        list: [],
        loading: false
      }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            fetchList(this.url, {key: query}).then(res => {
              let data = res.result.result;
              this.options = data.map(item => {
                return { value: `${item.id}`, label: this.labelList(item) };
              });
            })
          }, 200);
        } else {
          this.options = [];
        }
      },
      resetOpt() {
        this.$refs.select.$refs.input.blur = () => {
          if (this.value.length == 0) {
            this.options = [];
          }
          this.$emit('input', this.value);
        };
      },
      labelList(item) {
        let a;
        this.$emit('tochild', item, val => {
          a = val;
        });
        return a;
      },
      clearInput() {
        this.value = [];
        this.options = [];
      }
    }
  }
</script>
<style scoped>
  .el-select >>> .el-input__inner{
    width: 420px;
    height: 32px;
  }
</style>
