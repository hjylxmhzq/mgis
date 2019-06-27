import React from 'react';
import './toolpage.css';
import Menu from '../menu';
import Mainbox from '../mainbox'
import CascaderCity from '../../data/cityselect';
import Loading from '../loading';
import { Layout, notification, Button, Dropdown, Icon, Radio, Cascader, Select, Popover } from 'antd';
const { Content, Sider } = Layout;
const { Option } = Select;

export default class ToolPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            hotmap: false,
            hotmapIndex: 1,
            drawerVisible: false,
            basemap: 'streets',
            reset: false,
            createPolygon: false,
            createOrigin: false,
            createDestination: false,
            queryRoute: false,
            showLoading: true,
            weight: null
        };
    }

    notice(msg) {
        notification.open({
          message: '消息',
          description:
            msg,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      }

    closeLoading() {
        this.setState({ showLoading: false });
    }

    notice(msg) {
        notification.open({
            message: '消息',
            description:
                msg,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }

    componentDidUpdate() {
        if (this.state.reset) {
            this.setState({ reset: false });
        }
        if (this.state.createPolygon) {
            this.setState({ createPolygon: false });
        }
        if (this.state.createOrigin) {
            this.setState({ createOrigin: false });
        }
        if (this.state.createDestination) {
            this.setState({ createDestination: false });
        }
        if (this.state.queryRoute) {
            this.setState({ queryRoute: false });
        }
        if (this.state.weight) {
            this.setState({ weight: null })
        }
    }

    handleMenuClick(e) {
        let prevState = this.state;
        let msg = '';
        let state = {};
        switch (e.key) {
            case 'classbyservice':
                state.classMethod = 'service';
                break;
            case 'classbycomment':
                state.classMethod = 'comment';
                break;
            case 'classbydefault':
                state.classMethod = 'default';
                break;
            case 'hotmap':
                state.hotmap = true;
                state.hotmapIndex = 1;
                msg = state.hotmap ? '密度图已打开' : '密度图已关闭';
                this.notice(msg);
                break;
            case 'hotmap1':
                state.hotmap = true;
                state.hotmapIndex = 2;
                msg = state.hotmap ? '密度图已打开' : '密度图已关闭';
                this.notice(msg);
                break;
            case 'hotmap2':
                state.hotmap = true;
                state.hotmapIndex = 3;
                msg = state.hotmap ? '密度图已打开' : '密度图已关闭';
                this.notice(msg);
                break;
            case 'hotmap3':
                state.hotmap = true;
                state.hotmapIndex = 4;
                msg = state.hotmap ? '密度图已打开' : '密度图已关闭';
                this.notice(msg);
                break;
            case 'closehotmap':
                state.hotmap = false;
                state.hotmapIndex = 1;
                msg = '密度图已关闭';
                this.notice(msg);
                break;
            case 'static':
                state.drawerVisible = !this.state.drawerVisible;
                state.tabsIndex = '1';
                break;
            case 'topo':
                state.basemap = 'topo';
                break;
            case 'dark-gray':
                state.basemap = 'dark-gray';
                break;
            case 'streets':
                state.basemap = 'streets';
                break;
            case 'hybrid':
                state.basemap = 'hybrid';
                break;
            case 'reset':
                state.reset = true;
                break;
            case 'createpolygon':
                state.tabsIndex = '1';
                state.createPolygon = true;
                break;
            case 'odpoint':
                state.drawerVisible = !this.state.drawerVisible;
                state.tabsIndex = '2';
                state.createPoint = true;
                break;
            case 'createorigin':
                state.drawerVisible = true;
                state.tabsIndex = '2';
                state.createOrigin = true;
                break;
            case 'createdestination':
                state.drawerVisible = true;
                state.tabsIndex = '2';
                state.createDestination = true;
                break;
            case 'queryroute':
                state.drawerVisible = true;
                state.tabsIndex = '2';
                state.queryRoute = true;
                break;
            case 'compare':
                state.drawerVisible = true;
                state.tabsIndex = '3';
                break;
        }
        this.setState(state);
    }

    onCloseDrawer() {
        this.setState({ drawerVisible: false });
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    handleSearch(res) {
        if (!res['city']) {
            this.notice('请选择城市！');
            return;
        }
        this.setState({ weight: res });
    }

    render() {
        //console.log(this.props)
        return (
            <Layout>
                {/* <Sider
                    collapsed={false}
                    onCollapse={this.onCollapse}
                    className="sider"
                    style={{ width: 400, textAlign: 'left', overflow: 'hidden scroll', background: '#fff' }}
                >
                    <Prefer search={this.props.match} />
                </Sider> */}
                <Popover trigger="click" placement="bottom" content={<Prefer handleSearch={this.handleSearch.bind(this)} search={this.props.match} />} title="我的偏好">
                    <Button type="primary" style={{ position: 'absolute', width: '120px', left: '170px', top: '80px', zIndex: 1000 }}>球场智能推荐</Button>
                </Popover>
                <Popover trigger="click" placement="bottomRight" content={<Menu handleMenuClick={this.handleMenuClick.bind(this)} />} title="功能选择">
                    <Button type="primary" style={{ position: 'absolute', width: '100px', left: '60px', top: '80px', zIndex: 1000 }}>功能选择</Button>
                </Popover>
                <Layout style={{ padding: '0' }}>
                    <Content
                        style={{
                            background: '#fff',
                            padding: 0,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <Mainbox
                            tabsIndex={this.state.tabsIndex}
                            reset={this.state.reset}
                            createPolygon={this.state.createPolygon}
                            createOrigin={this.state.createOrigin}
                            createDestination={this.state.createDestination}
                            queryRoute={this.state.queryRoute}
                            basemap={this.state.basemap}
                            hotmap={this.state.hotmap}
                            hotmapIndex={this.state.hotmapIndex}
                            drawerVisible={this.state.drawerVisible}
                            onCloseDrawer={this.onCloseDrawer.bind(this)}
                            search={this.props.match}
                            closeLoading={this.closeLoading.bind(this)}
                            classMethod={this.state.classMethod}
                            weight={this.state.weight}
                        />
                    </Content>
                </Layout>
                {/* <Sider
                    collapsed={true}
                    className="sider"
                    style={{ textAlign: 'left', overflow: 'hidden scroll', background: '#fff', backgroundColor: '#ffffff9c' }}
                >
                    <Menu handleMenuClick={this.handleMenuClick.bind(this)} />
                </Sider> */}
                <Loading show={this.state.showLoading} />
            </Layout>
        );
    }
}


const plainOptions = ['1', '2', '3'];
const options = [
    { label: '1', value: 'Apple' },
    { label: '3', value: 'Pear' },
    { label: '5', value: 'Orange' },
];
const optionsWithDisabled = [
    { label: '1', value: 'Apple' },
    { label: '2', value: 'Pear' },
    { label: '3', value: 'Orange', disabled: false },
];

class Prefer extends React.Component {
    state = {
        value1: 'Apple',
        value2: 'Apple',
        value3: 'Apple',
        weight: {
            'age': 3,
            'comment': 3,
            'pricetype': 3,
            'poptype': 3,
            'service': 3,
            'coach': 3,
            'facility': 3,
            'price': 3,
            'year': 3
        }
    };

    handleSearch() {
        let that = this;
        let weightUrl = 'http://172.20.32.139:8000/getweight?weight=';
        let { weight } = this.state;
        let weightList = [];
        for (let key in weight) {
            switch (weight[key]) {
                case 1: weight[key] = 1; break;
                case 2: weight[key] = 3; break;
                case 3: weight[key] = 5; break;
                case 4: weight[key] = 7; break;
                case 5: weight[key] = 9; break;
                default:
                    break;
            }
            weightList = [weight['price'], weight['age'], weight['pricetype'], weight['poptype'], weight['service'], weight['coach'], weight['facility'], weight['year']];
        }
        console.log(weightList.join(','))
        fetch(weightUrl + weightList.join(',')).then(
            function (res) {
                return res.json()
            }
        ).then(
            function (res) {
                let weight = {};
                weight.pricetype = res[0];
                weight.poptype = res[1];
                weight.service = res[2];
                weight.coach = res[3];
                weight.facility = res[4];
                weight.city = that.state.city;
                that.props.handleSearch(weight);
            }
        )
    }

    handleChange(value) {
        let { weight } = this.state;
        let key = value.split('|')[0];
        let weightValue = value.split('|')[1];
        weight[key] = parseInt(weightValue);
        this.setState({ weight });
    }

    onChange1 = e => {
        console.log('radio1 checked', e.target.value);
        this.setState({
            value1: e.target.value,
        });
    };

    onChange2 = e => {
        console.log('radio2 checked', e.target.value);
        this.setState({
            value2: e.target.value,
        });
    };

    onChange3 = e => {
        console.log('radio3 checked', e.target.value);
        this.setState({
            value3: e.target.value,
        });
    };

    handleCityChange(value) {
        this.setState({ city: value });
    }

    render() {
        let searchCity = this.props.search && this.props.search.params.search.split('&')[1];
        let keyword = this.props.search && this.props.search.params.search.split('&')[0];
        let course = this.props.search && this.props.search.params.search.split('&')[3];
        let age = this.props.search && this.props.search.params.search.split('&')[2];
        age = age ? decodeURIComponent(age) : undefined;
        course = course ? decodeURIComponent(course) : undefined;
        searchCity = searchCity ? searchCity+'(未选择)' : '未选择';
        switch (age) {
            case 'year|1': age = '1年以下'; break;
            case "year|2": age = '1-3年'; break;
            case "year|3": age = '3-5年'; break;
            case "year|4": age = '5-8年'; break;
            case "year|5": age = '8年以上'; break;
            default: break;
        }
        switch (course) {
            case 'course|1': course = '比赛场'; break;
            case "course|2": course = '练习场'; break;
            default: break;
        }
        return (
            <div style={{ overflowY: 'scroll', overflowX: 'hidden', height: '70vh' }}>
                <div className="prefer_title">我的偏好</div>

                <div className="radio_box">
                    <div className="select_city">
                        所在城市
                        <CascaderCity style={{ display: 'block' }} defaultCity={searchCity} onChange={this.handleCityChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelectCourse defaultValue={course} />
                    </div>
                    <div className="select_city">
                        <SelectPrice handleChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelecAge handleChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelectYear defaultValue={age} />
                    </div>
                    <div className="select_city">
                        <SelecPriceType handleChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelecPop handleChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelecService handleChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelecCoach handleChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="select_city">
                        <SelecFacility handleChange={this.handleChange.bind(this)} />
                    </div>
                    {/* <Radio.Group options={plainOptions} onChange={this.onChange1} value={this.state.value1} />
                    <Radio.Group options={options} onChange={this.onChange2} value={this.state.value2} />
                    <Radio.Group
                        options={optionsWithDisabled}
                        onChange={this.onChange3}
                        value={this.state.value3}
                    /> */}
                </div>
                <Button style={{ width: '90%', margin: '5%' }} onClick={this.handleSearch.bind(this)}>搜索</Button>
            </div>
        );
    }
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

function SelectYear(props = {}) {
    return (<div className="selectWrap">
        <div>球龄</div>
        <Select defaultValue="选择您的球龄" defaultValue={props.defaultValue ? props.defaultValue : '请选择'} onChange={handleChange}>
            <Option value="year|5">1年以下</Option>
            <Option value="year|4">1-3年</Option>
            <Option value="year|3">3-5年</Option>
            <Option value="year|2">5-8年</Option>
            <Option value="year|1">8年以上</Option>
        </Select>
    </div>)
}

function SelectCourse(props = {}) {
    return (<div className="selectWrap">
        <div>球场类型</div>
        <Select defaultValue="选择球场类型" defaultValue={props.defaultValue ? props.defaultValue : '请选择'} onChange={handleChange}>
            <Option value="course|1">比赛场</Option>
            <Option value="course|2">练习场</Option>
        </Select>
    </div>)
}

function SelectPrice(props = {}) {
    return (<div className="selectWrap">
        <div>价格区间</div>
        <Select defaultValue="选择价格区间" onChange={props.handleChange}>
            <Option value="price|5">200元以下</Option>
            <Option value="price|4">200-500元</Option>
            <Option value="price|3">500-1000元</Option>
            <Option value="price|2">1000-2000元</Option>
            <Option value="price|1">2000元以上</Option>
        </Select>
    </div>)
}

function SelecAge(props = {}) {
    return (<div className="selectWrap">
        <div>年龄</div>
        <Select defaultValue="选择您的年龄" onChange={props.handleChange}>
            <Option value="age|5">25岁以下</Option>
            <Option value="age|4">25-35岁</Option>
            <Option value="age|3">35-45岁</Option>
            <Option value="age|2">45-55岁</Option>
            <Option value="age|1">55岁以上</Option>
        </Select>
    </div>)
}

function SelecComment(props = {}) {
    return (<div className="selectWrap">
        <div>球友评价</div>
        <Select defaultValue="选择球友评价的区间" onChange={props.handleChange}>
            <Option value="comment|5">非常好</Option>
            <Option value="comment|4">令人愉悦</Option>
            <Option value="comment|3">较好</Option>
            <Option value="comment|2">一般</Option>
            <Option value="comment|1">不在意</Option>
        </Select>
    </div>)
}

function SelecPriceType(props = {}) {
    return (<div className="selectWrap">
        <div>价格类型</div>
        <Select defaultValue="选择期望的价格类型" onChange={props.handleChange}>
            <Option value="pricetype|5">尊贵型</Option>
            <Option value="pricetype|4">轻奢型</Option>
            <Option value="pricetype|3">豪华型</Option>
            <Option value="pricetype|2">舒适型</Option>
            <Option value="pricetype|1">经济型</Option>
        </Select>
    </div>)
}

function SelecPop(props = {}) {
    return (<div className="selectWrap">
        <div>人气氛围</div>
        <Select defaultValue="选择您期望的人气氛围" onChange={props.handleChange}>
            <Option value="poptype|5">欢腾</Option>
            <Option value="poptype|4">热闹</Option>
            <Option value="poptype|3">一般</Option>
            <Option value="poptype|2">清净</Option>
            <Option value="poptype|1">不在意</Option>
        </Select>
    </div>)
}

function SelecService(props = {}) {
    return (<div className="selectWrap">
        <div>服务质量</div>
        <Select defaultValue="您对服务质量的看重程度" onChange={props.handleChange}>
            <Option value="service|5">很看重</Option>
            <Option value="service|4">比较看重</Option>
            <Option value="service|3">一般</Option>
            <Option value="service|2">不太看重</Option>
            <Option value="service|1">不在意</Option>
        </Select>
    </div>)
}

function SelecCoach(props = {}) {
    return (<div className="selectWrap">
        <div>教练水平</div>
        <Select defaultValue="您对教练水平的看重程度" onChange={props.handleChange}>
            <Option value="coach|5">高超</Option>
            <Option value="coach|4">精湛</Option>
            <Option value="coach|3">娴熟</Option>
            <Option value="coach|2">引导</Option>
            <Option value="coach|1">不在意</Option>
        </Select>
    </div>)
}

function SelecFacility(props = {}) {
    return (<div className="selectWrap">
        <div>场地设施水平</div>
        <Select defaultValue="您对场地设施水平的看重程度" onChange={props.handleChange}>
            <Option value="facility|5">很看重</Option>
            <Option value="facility|4">比较看重</Option>
            <Option value="facility|3">一般</Option>
            <Option value="facility|2">不太看重</Option>
            <Option value="facility|1">不在意</Option>
        </Select>
    </div>)
}
