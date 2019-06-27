import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import './charts.css'

class Bar extends Component {
    constructor(props) {
        super(props);
        this.charts = React.createRef();
        this.barChartsInstance = null;
        this.barOption = null;
    }

    componentDidMount() {
        this.barChartsInstance = echarts.init(this.charts.current);
        let { barData } = this.props;

        this.barOption = {
            title: {
                text: '评分'
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : barData.map((item, index)=>(index).toString()),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'评分',
                    type:'bar',
                    barWidth: '60%',
                    data:barData.map((item)=>item['平均分'])
                }
            ]
        };
        this.barChartsInstance.setOption(this.barOption);
    }

    componentDidUpdate() {
        let { barData } = this.props;
        this.barOption.xAxis[0].data = barData.map((item, index)=>(index.toString()));
        this.barOption.series[0].data = barData.map((item)=>item['平均分']);
        this.barChartsInstance.setOption(this.barOption);
    }

    render() {
        return <div className="charts" ref={this.charts}></div>
    }
}

class Radar extends Component {
    constructor(props) {
        super(props);
        this.charts = React.createRef();
        this.barChartsInstance = null;
        this.barOption = null;
    }

    componentDidMount() {
        this.radarChartsInstance = echarts.init(this.charts.current);
        let { barData } = this.props;

        let data = barData.map((item) => {
            return {
                name: item['名称'],
                value: [item['价格分'], item['场地'], item['教练'], item['服务'], item['热度分']]
            }
        })
        this.radarOption = {
            title: {
                text: '评价雷达图'
            },
            tooltip: {},
            legend: {
                data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                   }
                },
                indicator: [
                   { name: '价格', max: 10},
                   { name: '场地', max: 10},
                   { name: '教练', max: 10},
                   { name: '服务', max: 10},
                   { name: '热度', max: 10},
                ]
            },
            series: [{
                name: '评分雷达图',
                type: 'radar',
                // areaStyle: {normal: {}},
                data
            }]
        };
        this.radarChartsInstance.setOption(this.radarOption);
    }

    componentDidUpdate() {
        let { barData } = this.props;
        let data = barData.map((item) => {
            return {
                name: item['名称'],
                value: [item['价格分'], item['场地'], item['教练'], item['服务'], item['热度分']]
            }
        })
        this.radarOption.series[0].data = data;
        this.radarChartsInstance.setOption(this.radarOption);
    }

    render() {
        return <div className="charts" ref={this.charts}></div>
    }
}

export { Bar, Radar };