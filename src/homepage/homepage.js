import React, { Component } from 'react';
import { Carousel, Input, Select, Card, Button } from 'antd';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { actions } from '../redux/app';
import CascaderCity from '../data/cityselect';
import './homepage.css';
import slider1 from '../static/pics/slider1.jpg';
import slider2 from '../static/pics/slider2.jpg';
import slider3 from '../static/pics/slider3.jpg';
import beijingImg from '../static/pics/beijing.jpg';
import shanghaiImg from '../static/pics/shanghai.jpg';
import shenzhenImg from '../static/pics/shenzhen.jpg';
import guangzhouImg from '../static/pics/guangzhou.jpg';
import foshanImg from '../static/pics/foshan.jpg';
import { link } from 'fs';


const { Option } = Select;
const { Meta } = Card;

class TempHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: '填写您感兴趣的地点',
            keyword: '',
            citySelected: '',
            courseSelected: '',
            yearSelected: ''
        }
    }

    clickSearch() {
        this.props.handleMenuChange('toolpage');
    }

    changeKeyword(e) {
        this.setState({ keyword: e.target.value });
    }

    changeSelect(selected) {
        let placeholder = '';
        switch (selected) {
            case 'keyword':
                placeholder = '填写您感兴趣的关键词';
                break;
            case 'place':
                placeholder = '填写您感兴趣的地点';
                break;
        }
        this.setState({ placeholder });
    }

    changeCity(value) {
        this.setState({ citySelected: value });
    }

    changeCourse(value) {
        this.setState({ courseSelected: value });
    }

    changeYear(value) {
        this.setState({ yearSelected: value });
    }

    render() {
        const Search = Input.Search;

        return (
            <div>
                <Carousel autoplay>
                    <div>
                        <img className="slider_img" src={slider1} />
                        <div className="slider_text">高尔夫球场推荐</div>

                    </div>
                    <div>
                        <div className="slider_text">空间位置查询</div>
                        <img className="slider_img" src={slider2} />
                    </div>
                    <div>
                        <div className="slider_text">数据整合</div>
                        <img className="slider_img" src={slider3} />
                    </div>
                </Carousel>
                <div className="home_search">
                    <div className="search_text"><span>选择您感兴趣的地点</span><br /><span>或者列出检索条件</span></div>
                    {/* <Input
                        placeholder="填写您感兴趣的关键词"
                        size="large"
                        style={{ height: '70px' }}
                        value={this.state.keyword}
                        onChange={this.changeKeyword.bind(this)}
                    /> */}
                    <CascaderCity placeholder="请选择城市" onChange={this.changeCity.bind(this)} />
                    <Select defaultValue="场地" style={{ width: '25%' }} onChange={this.changeCourse.bind(this)}>
                        <Option value="course|1">比赛场</Option>
                        <Option value="course|2">练习场</Option>
                    </Select>
                    <Select defaultValue="球龄" style={{ width: '25%' }} onChange={this.changeYear.bind(this)}>
                        <Option value="year|1">1年以下</Option>
                        <Option value="year|2">1-3年</Option>
                        <Option value="year|3">3-5</Option>
                        <Option value="year|4">5-8</Option>
                        <Option value="year|5">8年以上</Option>
                    </Select>
                    <Link to={`/tool/${this.state.keyword}&${this.state.citySelected}&${this.state.yearSelected}&${this.state.courseSelected}`}>
                        <Button onClick={this.clickSearch.bind(this)}>
                            搜索
                        </Button>
                    </Link>

                </div>
                <div className="popular_text">热门地点</div>
                <div className="card_box">
                    <div className="card" style={{ width: '23%', boxSizing: 'border-box' }}>
                        <Link to="/tool/&北京市,北京市&&" >
                            <Card
                                hoverable
                                //style={{ width: 260 }}
                                cover={<img alt="example" src={beijingImg} />}
                                onClick={this.clickSearch.bind(this)}
                            >
                                <Meta title="北京" description="共139个球场" />
                            </Card>
                        </Link>

                    </div>
                    <div className="card" style={{ width: '33%', boxSizing: 'border-box' }}>
                        <Link to="/tool/&广东省,广州市&&">

                            <Card
                                hoverable
                                //style={{ width: 380 }}
                                cover={<img alt="example" src={guangzhouImg} />}
                                onClick={this.clickSearch.bind(this)}
                            >
                                <Meta title="广州" description="共50个球场" />
                            </Card>
                        </Link>
                    </div>
                    <div className="card" style={{ width: '30%', boxSizing: 'border-box' }}>
                        <Link to="/tool/&上海市,上海市&&">

                            <Card
                                hoverable
                                //style={{ width: 380 }}
                                cover={<img alt="example" src={shanghaiImg} />}
                                onClick={this.clickSearch.bind(this)}
                            >
                                <Meta title="上海" description="共150个球场" />
                            </Card>
                        </Link>
                    </div>
                    <div className="card" style={{ width: '40%', boxSizing: 'border-box' }}>
                        <Link to="/tool/&广东省,深圳市&&">

                            <Card
                                hoverable
                                //style={{ width: 540 }}
                                cover={<img alt="example" src={shenzhenImg} />}
                                onClick={this.clickSearch.bind(this)}
                            >
                                <Meta title="深圳" description="共95个球场" />
                            </Card>
                        </Link>
                    </div>
                    <div className="card" style={{ width: '40%', boxSizing: 'border-box' }}>
                        <Link to="/tool/&广东省,佛山市&&">
                            <Card
                                hoverable
                                //style={{ width: 480 }}
                                cover={<img alt="example" src={foshanImg} />}
                                onClick={this.clickSearch.bind(this)}
                            >
                                <Meta title="佛山" description="共19个球场" />
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStatetoProps(state) {
    return {
        selectedMenu: state.selectedMenu
    }
}

function mapDispatchtoProps(dispatch) {
    return {
        handleMenuChange(menuName) {
            dispatch(actions.changeMenu(menuName));
        }
    }
}

const HomePage = connect(mapStatetoProps, mapDispatchtoProps)(TempHomePage);
export default HomePage;