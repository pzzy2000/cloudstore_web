<template>
  <div>
    <div id="myCharts" ref="myCharts" style="width: 1450px; height: 350px; margin-top: 20px"></div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import {leaderReport} from '@/api/charts'
  export default {
    name: "index",
    props: ['url', 'name', 'msg'],
    data() {
      return {
        series: [],
        leaderArr: [],
        dateArr: []
      }
    },
    created() {
      this.getLeaderlist(this.url, {type: 'action', day: 7})
    },
    mounted() {
      this.line();
    },
    watch: {
      dateArr(val){//监听数据发生改变 刷新图表数据
        this.line();
      },
      series(val){
        this.line();
      },
      leaderArr(val){
        this.line();
      }
    },
    methods: {
      line() {
        const myCharts = echarts.init(this.$refs.myCharts);
        let options = {
          // title: {
          //   text: '未来一周气温变化',   //图表顶部的标题
          //   subtext: '纯属虚构'    //副标题
          // },
          tooltip: {   //鼠标悬浮框的提示文字
            trigger: 'axis'
          },
          legend: {
            data: this.leaderArr //['销售总额','订单数量']
          },
          xAxis : {  //x轴坐标数据
            type : 'category',
            boundaryGap : false,
            data : this.dateArr
            // data: []
          },
          yAxis : [
            {   //y轴坐标数据
              name: this.name,
              type : 'value',
              axisLabel : {
                formatter: '{value}'
              }
            }
          ],
          dataZoom: [
            {   // 这个dataZoom组件，默认控制x轴。
              type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
              start: 0,      // 左边在 10% 的位置。
              end: 100         // 右边在 60% 的位置。
            }
          ],
          series: this.series
          //   [  //驱动图表生成的数据内容数组，几条折现，数组中就会有几个对应对象，来表示对应的折线
          //   {
          //     name:"销售总额",
          //     type: "line",  //pie->饼状图  line->折线图  bar->柱状图
          //     yAxisIndex: 0,
          //     data: this.lineOne,
          //     // data: []
          //   },
          //   {
          //     name:"订单数量",
          //     type: "line",  //pie->饼状图  line->折线图  bar->柱状图
          //     yAxisIndex: 1,
          //     data: this.lineTwo,
          //     // data: []
          //   }
          // ]
        }
        myCharts.setOption(options);
      },
      getLeaderlist(url, obj) {
        this.dateArr = [];
        this.leaderArr = [];
        leaderReport(url, obj).then(res => {
          console.log(res);
          if(res.result.code == 0) {
            this.series = [];
            let data = res.result.result;
            let arr = [];
            for (let i=0; i<data.length; i++) {
              arr.push(data[i][this.msg][0].agentBean.name);
            }
            this.leaderArr = arr;
            let array = [];
            let dateArr = [];
            for (let i=0; i<data[0][this.msg].length; i++) {
              dateArr.push(data[0][this.msg][i].dates)
            }
            this.dateArr = dateArr;
            for (let i=0; i<arr.length; i++) {
              array = [];
              let obj = {
                type: "line",  //pie->饼状图  line->折线图  bar->柱状图
                yAxisIndex: 0
              }
              obj.name = arr[i];
              for (let j=0; j<data[i][this.msg].length; j++) {
                array.push(data[i][this.msg][j].sums);
              }
              obj.data = array;
              this.series.push(obj);
            }
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
