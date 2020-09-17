<template>
  <div>
    <el-button type="primary" @click="oneWeek" style="margin: 20px 0 0 20px">最近七天</el-button>
    <el-button type="primary" style="margin-right: 10px" @click="oneMonth">最近三十天</el-button>
    <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      style="margin-top: 20px"
      @change="searchList"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd">
    </el-date-picker>
    <div class="statistics-layout">
      <div class="layout-title">用户统计</div>
      <el-row>
        <el-col :span="3">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">当前用户注册次数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{orderNumber}}</div>
              <!--              <div>-->
              <!--                <span class="color-success" style="font-size: 14px">+10%</span>-->
              <!--                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>-->
              <!--              </div>-->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">当前用户访问次数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{sale}}</div>
              <!--              <div>-->
              <!--                <span class="color-danger" style="font-size: 14px">-10%</span>-->
              <!--                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>-->
              <!--              </div>-->
            </div>
            <!--            <div style="margin-top: 20px;">-->
            <!--              <div style="color: #909399;font-size: 14px">本月销售总额</div>-->
            <!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>-->
            <!--              <div>-->
            <!--                <span class="color-success" style="font-size: 14px">+10%</span>-->
            <!--                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div style="margin-top: 20px;">-->
            <!--              <div style="color: #909399;font-size: 14px">本周销售总额</div>-->
            <!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>-->
            <!--              <div>-->
            <!--                <span class="color-danger" style="font-size: 14px">-10%</span>-->
            <!--                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </el-col>
        <el-col :span="21">
          <div style="border-left:1px solid #DCDFE6; text-align: right">
            <div>
              <div id="myCharts" ref="myCharts" style="width: 1450px; height: 350px; margin-top: 20px"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
<!--    <div style="margin: 20px">-->
<!--      <div style="float: left">-->
<!--        <div id="myChartss" ref="myChartss" style="width: 900px; height: 400px; margin-top: 20px"></div>-->
<!--      </div>-->
<!--      <div style="float: left">-->
<!--        <div id="myChartsTwo" ref="myChartsTwo" style="width: 700px; height: 400px; margin-top: 20px"></div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="statistics-layout">
      <div class="layout-title">用户注册次数</div>
      <el-row>
        <el-col :span="3">
          <div style="color: white">占位符</div>
        </el-col>
        <el-col :span="21">
          <div style="border-left: 1px solid rgb(220, 223, 230)">
            <stateMent :url="urlone" name="用户注册次数" msg="regUserSums" ref="childone"></stateMent>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">用户访问次数</div>
      <el-row>
        <el-col :span="3">
          <div style="color: white">占位符</div>
        </el-col>
        <el-col :span="21">
          <div style="border-left: 1px solid rgb(220, 223, 230)">
            <stateMent :url="urltwo" name="用户访问次数" msg="visitUserSums" ref="childtwo"></stateMent>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import {showUsercharts, showPiccharts} from '@/api/charts';
  import stateMent from '@/components/statement';
  export default {
    components: {
      stateMent
    },
    data () {
      return {
        lineOne: [],
        dateArr: [],
        lineTwo: [],
        value: '',
        urlone: '/report/statistics/getReportUserByAgentId',
        urltwo: '/report/statistics/getReportUserByAgentId',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pieoneArr: [],
        pietwoArr: [],
        orderNumber: 0,
        sale: 0
      }
    },
    created() {
      this.getList({type: 'action', day: 7});
      // this.getRatelist();
    },
    mounted(){
      this.line();
      // this.pieOne();
      // this.pieTwo();
    },
    watch:{
      dateArr(val){//监听数据发生改变 刷新图表数据
        this.line();
      },
      pieoneArr(val){//监听数据发生改变 刷新图表数据
        this.pieOne();
      },
      pietwoArr(val){//监听数据发生改变 刷新图表数据
        this.pieTwo();
      },
      // lineArr(val){//监听数据发生改变 刷新图表数据
      //   this.line();
      // }
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
            data:['用户注册次数','用户访问次数']
          },
          xAxis : {  //x轴坐标数据
            type : 'category',
            boundaryGap : false,
            data : this.dateArr
            // data: []
          },
          yAxis : [
            {   //y轴坐标数据
              name: '用户注册次数',
              type : 'value',
              axisLabel : {
                formatter: '{value}'
              }
            },
            {   //y轴坐标数据
              name: '用户访问次数',
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
          series: [  //驱动图表生成的数据内容数组，几条折现，数组中就会有几个对应对象，来表示对应的折线
            {
              name:"用户注册次数",
              type: "line",  //pie->饼状图  line->折线图  bar->柱状图
              yAxisIndex: 0,
              data: this.lineOne,
              // data: []
            },
            {
              name:"用户访问次数",
              type: "line",  //pie->饼状图  line->折线图  bar->柱状图
              yAxisIndex: 1,
              data: this.lineTwo,
              // data: []
            }
          ]
        }
        myCharts.setOption(options);
      },
      // pieOne() {
      //   const myCharts = echarts.init(this.$refs.myChartss);
      //   let options = {
      //     legend: {
      //       orient: 'horizontal',  //垂直显示
      //       y: 'bottom',    //延Y轴居中
      //       x: 'center' //居右显示
      //     },
      //     tooltip: {},
      //     title: {
      //       text: '销售总额',   //图表顶部的标题
      //       left: 'center'
      //       // subtext: '纯属虚构'    //副标题
      //     },
      //     series: [{
      //       type: 'pie',
      //       radius: '40%',
      //       center: ['50%', '50%'],
      //       // data: [
      //       //   {name: '销售总额', value: 1212},
      //       //   {name: '订单数量', value: 2323}
      //       // ],
      //       data: this.pieoneArr,
      //       itemStyle: {
      //         emphasis: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: 'rgba(255, 0, 0, 0.5)'
      //         },
      //         normal:{
      //           label:{
      //             show: true,
      //             formatter: '{b} : {c} ({d}%)'
      //           },
      //           labelLine :{show:true}
      //         }
      //       }
      //     }]
      //   }
      //   myCharts.setOption(options);
      // },
      // pieTwo() {
      //   const myCharts = echarts.init(this.$refs.myChartsTwo);
      //   let options = {
      //     legend: {
      //       orient: 'horizontal',  //垂直显示
      //       y: 'bottom',    //延Y轴居中
      //       x: 'center' //居右显示
      //     },
      //     tooltip: {},
      //     title: {
      //       text: '订单数量',   //图表顶部的标题
      //       left: 'center'
      //       // subtext: '纯属虚构'    //副标题
      //     },
      //     series: [{
      //       type: 'pie',
      //       radius: '40%',
      //       center: ['50%', '50%'],
      //       // data: [
      //       //   {name: '销售总额', value: 1212},
      //       //   {name: '订单数量', value: 2323}
      //       // ],
      //       data: this.pietwoArr,
      //       itemStyle: {
      //         emphasis: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: 'rgba(255, 0, 0, 0.5)'
      //         },
      //         normal:{
      //           label:{
      //             show: true,
      //             formatter: '{b} : {c} ({d}%)'
      //           },
      //           labelLine :{show:true}
      //         }
      //       }
      //     }]
      //   }
      //   myCharts.setOption(options);
      // },
      getList(obj) {
        this.dateArr = [];
        this.lineOne = [];
        this.lineTwo = [];
        showUsercharts(obj).then(res => {
          // console.log(res);
          // return;
          if (res.result.code == 0) {
            let data = res.result.result.regUserSums;
            let dataArr = res.result.result.visitUserSums;
            this.orderNumber = res.result.result.reg;
            this.sale = res.result.result.visit;
            for (let i=0; i<data.length; i++) {
              this.dateArr.push(data[i].dates);
              if (data[i].sums !== undefined) {
                this.lineOne.push(data[i].sums);
              } else {
                this.lineOne.push(0);
              }
            }
            for (let i=0; i<dataArr.length; i++) {
              if (dataArr[i].sums !== undefined) {
                this.lineTwo.push(dataArr[i].sums);
              } else {
                this.lineTwo.push(0);
              }
            }
          }
        })
      },
      getRatelist() {
        showPiccharts({type: 'action', day: 7}).then(res => {
          if (res.result.code == 0) {
            let obj = {};
            const data = res.result.result.saleMoneys;
            const orderData = res.result.result.saleOrders;
            const colorArr = ['#FF7878', '#68C1B8', '#FD7EB2', '#A4ADBD', '#fff', '#eee'];
            for (let i=0; i<data.length; i++) {
              if (data[i].agentId !== '-1') {
                obj = {name: data[i].agentBean.name, value: data[i].sums, itemStyle: { color: colorArr[i] }};
                this.pieoneArr.push(obj);
              } else {
                obj = {name: '其他', value: data[i].sums};
                this.pieoneArr.push(obj);
              }
            }
            for (let i=0; i<orderData.length; i++) {
              if (data[i].agentId !== '-1') {
                obj = {name: orderData[i].agentBean.name, value: orderData[i].sums, itemStyle: { color: colorArr[i] }};
                this.pietwoArr.push(obj);
              } else {
                obj = {name: '其他', value: orderData[i].sums};
                this.pietwoArr.push(obj);
              }
            }
          }
        })
      },
      oneWeek() {
        this.value = '';
        this.getList({type: 'action', day: 7})
        this.$refs.childone.getLeaderlist(this.urlone, {type: 'action', day: 7})
        this.$refs.childtwo.getLeaderlist(this.urltwo, {type: 'action', day: 7})
      },
      oneMonth() {
        this.value = '';
        this.getList({type: 'action', day: 30});
        this.$refs.childone.getLeaderlist(this.urlone, {type: 'action', day: 30})
        this.$refs.childtwo.getLeaderlist(this.urltwo, {type: 'action', day: 30})
      },
      searchList() {
        let obj = {
          startTime: this.value[0],
          endsTime: this.value[1],
          type: 'dates'
        }
        this.getList(obj);
        this.$refs.childone.getLeaderlist(this.urlone, obj)
        this.$refs.childtwo.getLeaderlist(this.urltwo, obj)
      }
    }
  }
</script>

<style scoped>
  .el-date-editor >>> .el-range-separator{
    width: 6%;
  }
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
