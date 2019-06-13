import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import './details.css';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            nowWeather: {
                cloud: "93",
                cond_code: "101",
                cond_txt: "多云",
                fl: "36",
                hum: "54",
                pcpn: "0.0",
                pres: "1000",
                tmp: "34",
                vis: "16",
                wind_deg: "171",
                wind_dir: "南风",
                wind_sc: "2",
                wind_spd: "11",
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible: nextProps.visible });
    }

    componentDidUpdate() {
        let that = this;
        if (this.props.location.x) {
            fetch(`https://free-api.heweather.net/s6/weather/now?location=${this.props.location.x},${this.props.location.y}&key=135db07780af42f49317c6f124085cb5`)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    console.log(data)
                    if (data['HeWeather6'][0]['now']['cond_code'] !== that.state.nowWeather['cond_code']) {
                        that.setState({ nowWeather: data['HeWeather6'][0]['now'] });
                    }
                })
        }
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.closeModalAndGo();
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.closeModal();
    };

    render() {
        return (
            <div>
                <Modal
                    title={this.props.title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    centered
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            关闭
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            去这里
                        </Button>,
                    ]}
                    width="90%"
                >
                    <div className="weather">
                        <div>当地天气状况</div>
                        <div>
                            <div>{this.state.nowWeather['cond_txt']}</div>
                            <img className="weather_icon" src={"http://tony-space.top/static/icons/weather_icons/" + this.state.nowWeather['cond_code'] + ".png"}></img>
                        </div>
                        <div>
                            <div>温度</div>
                            <div>{this.state.nowWeather['tmp']}°C</div>
                        </div>
                        <div>
                            <div>湿度</div>
                            <div>{this.state.nowWeather['hum']}%</div>
                        </div>
                        <div>
                            <div>能见度</div>
                            <div>{this.state.nowWeather['vis']}</div>
                        </div>
                        <div>
                            <div>气压</div>
                            <div>{this.state.nowWeather['pres']}</div>
                        </div>
                        <div>
                            <div>风向</div>
                            <div>{this.state.nowWeather['wind_dir']}</div>
                        </div>
                        <div>
                            <div>风速</div>
                            <div>{this.state.nowWeather['wind_spd']}</div>
                        </div>
                    </div>
                    {this.props.content}
                </Modal>
            </div>
        );
    }
}