import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import './charts.css'

export default class Charts extends Component {
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
                    data : barData.map((item)=>item[0]),
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
                    data:barData.map((item)=>item[1])
                }
            ]
        };
        this.barChartsInstance.setOption(this.barOption);
    }

    componentDidUpdate() {
        let { barData } = this.props;
        this.barOption.xAxis[0].data = barData.map((item)=>item['name']);
        this.barOption.series[0].data = barData.map((item)=>item['avg_score']);
        this.barChartsInstance.setOption(this.barOption);
    }

    render() {
        return <div className="charts" ref={this.charts}></div>
    }
}