import React, { Component } from 'react';
import { Menu, Icon, Button } from 'antd';
import './menu.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class LeftMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Menu
                onClick={this.handleClick}
                defaultSelectedKeys={['1']}
                //defaultOpenKeys={['sub1', 'sub2']}
                mode="inline"
            >
                <SubMenu
                    key="zhiyin"
                    title={
                        <span>
                            <Icon type="fund" theme="filled" />
                            <span>球场指引</span>
                        </span>
                    }
                >

                    <SubMenu
                        key="route"
                        title={
                            <span>
                                <span>路径查询</span>
                            </span>
                        }>
                        <Menu.Item key="createorigin" onClick={this.props.handleMenuClick}>
                            起点设置
                        </Menu.Item>
                        <Menu.Item key="createdestination" onClick={this.props.handleMenuClick}>
                            终点设置
                        </Menu.Item>
                        <Menu.Item key="queryroute" onClick={this.props.handleMenuClick}>
                            查询
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="g11" title="球场查询">

                        <SubMenu key="g1" title="范围查询">
                            <Menu.Item style={{
                                marginBottom: '0px',
                                height: '26px',
                                fontSize: '12px',
                                lineHeight: '26px'
                            }}
                                onClick={this.props.handleMenuClick}
                                key="createpolygon" >多边形
                            </Menu.Item>
                            <Menu.Item style={{
                                marginBottom: '0px',
                                height: '26px',
                                fontSize: '12px',
                                lineHeight: '26px'
                            }}
                                onClick={this.props.handleMenuClick}
                                key="reset" >重置范围
                            </Menu.Item>
                        </SubMenu>
                    </SubMenu>
                </SubMenu>
                <SubMenu
                    key="info"
                    title={
                        <span>
                            <Icon type="fund" theme="filled" />
                            <span>球场信息可视化</span>
                        </span>
                    }
                >

                    <SubMenu
                        key="hot"
                        title={
                            <span>
                                <span>热力图分析</span>
                            </span>
                        }>
                        <Menu.Item key="hotmap" onClick={this.props.handleMenuClick}>总体评分热力图</Menu.Item>
                        <Menu.Item key="hotmap1" onClick={this.props.handleMenuClick}>服务评价热力图</Menu.Item>
                        <Menu.Item key="hotmap2" onClick={this.props.handleMenuClick}>教练评价热力图</Menu.Item>
                        <Menu.Item key="hotmap3" onClick={this.props.handleMenuClick}>价格热力图</Menu.Item>
                        <Menu.Item key="closehotmap" onClick={this.props.handleMenuClick}>关闭</Menu.Item>

                    </SubMenu>
                </SubMenu>
                <SubMenu
                    key="com"
                    title={
                        <span>
                            <Icon type="fund" theme="filled" />
                            <span>球场对比分析</span>
                        </span>
                    }
                >

                    <SubMenu
                        key="class"
                        title={
                            <span>
                                <span>分类渲染</span>
                            </span>
                        }>
                        <Menu.Item key="classbyservice" onClick={this.props.handleMenuClick}>服务分类</Menu.Item>
                        <Menu.Item key="classbycomment" onClick={this.props.handleMenuClick}>评价分类</Menu.Item>
                        <Menu.Item key="classbydefault" onClick={this.props.handleMenuClick}>默认</Menu.Item>

                    </SubMenu>
                    <Menu.Item key="compare" onClick={this.props.handleMenuClick}>统计图表</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="other"
                    title={
                        <span>
                            <Icon type="fund" theme="filled" />
                            <span>其它工具</span>
                        </span>
                    }
                >

                    <SubMenu
                        key="class"
                        title={
                            <span>
                                <span>底图</span>
                            </span>
                        }>
                        <Menu.Item key="dark-gray" onClick={this.props.handleMenuClick}>dark-gray</Menu.Item>
                        <Menu.Item key="topo" onClick={this.props.handleMenuClick}>topo</Menu.Item>
                        <Menu.Item key="streets" onClick={this.props.handleMenuClick}>streets</Menu.Item>
                        <Menu.Item key="hybrid" onClick={this.props.handleMenuClick}>hybrid</Menu.Item>
                    </SubMenu>
                </SubMenu>
                <SubMenu
                    key="help"
                    title={
                        <span>
                            <Icon type="fund" theme="filled" />
                            <span>使用帮助</span>
                        </span>
                    }
                >
                    <Menu.Item key="help" onClick={this.props.handleMenuClick}>使用帮助</Menu.Item>
                </SubMenu>
                {/* <SubMenu
                    key="sub12"
                    title={
                        <span>
                            <Icon type="plus-square" theme="filled" />
                            <span>球场分析</span>
                        </span>
                    }
                >
                    <SubMenu key="class" title="分类渲染"
                        key="sub6"
                        title={
                            <span>
                                <span>分类渲染</span>
                            </span>
                        }>
                        <Menu.Item key="classbyservice" onClick={this.props.handleMenuClick}>服务分类</Menu.Item>
                        <Menu.Item key="classbycomment" onClick={this.props.handleMenuClick}>评价分类</Menu.Item>
                        <Menu.Item key="classbydefault" onClick={this.props.handleMenuClick}>默认</Menu.Item>

                    </SubMenu> */}
                {/* <SubMenu
                        key="sub12"
                        title={
                            <span>
                                <Icon type="right-square" theme="filled" />
                                <span>球场对比</span>
                            </span>
                        }>
                        <Menu.Item key="compare" onClick={this.props.handleMenuClick}>统计图表</Menu.Item>

                    </SubMenu> 
                </SubMenu>*/}
                {/* <SubMenu key="g11" title="球场查询">

                        <SubMenu key="g1" title="范围查询">
                            <Menu.Item style={{
                                marginBottom: '0px',
                                height: '26px',
                                fontSize: '12px',
                                lineHeight: '26px'
                            }}
                                onClick={this.props.handleMenuClick}
                                key="createpolygon" >多边形
                            </Menu.Item>
                            <Menu.Item style={{
                                marginBottom: '0px',
                                height: '26px',
                                fontSize: '12px',
                                lineHeight: '26px'
                            }}
                                onClick={this.props.handleMenuClick}
                                key="reset" >重置范围
                            </Menu.Item>
                        </SubMenu>
                    </SubMenu>

                </SubMenu>
                <SubMenu
                    key="sub7"
                    title={
                        <span>
                            <Icon type="plus-square" theme="filled" />
                            <span>路径计算</span>
                        </span>
                    }>
                    <Menu.Item key="createorigin" onClick={this.props.handleMenuClick}>
                        起点设置
                        </Menu.Item>
                    <Menu.Item key="createdestination" onClick={this.props.handleMenuClick}>
                        终点设置
                        </Menu.Item>
                    <Menu.Item key="queryroute" onClick={this.props.handleMenuClick}>
                        查询
                        </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={
                        <span>
                            <Icon type="fund" theme="filled" />
                            <span>查询结果</span>
                        </span>
                    }
                >

                    <SubMenu key="hot" title="密度图">
                        <Menu.Item key="hotmap" onClick={this.props.handleMenuClick}>评分热度</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="static" onClick={this.props.handleMenuClick}>统计表格</Menu.Item>
                    {/* <SubMenu key="sub3" title="Submenu">
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu> */}
                {/*
                </SubMenu>
                <SubMenu
                    key="sub4"
                    title={
                        <span>
                            <Icon type="right-square" theme="filled" />
                            <span>底图</span>
                        </span>
                    }
                >
                    <Menu.Item key="dark-gray" onClick={this.props.handleMenuClick}>dark-gray</Menu.Item>
                    <Menu.Item key="topo" onClick={this.props.handleMenuClick}>topo</Menu.Item>
                    <Menu.Item key="streets" onClick={this.props.handleMenuClick}>streets</Menu.Item>
                    <Menu.Item key="hybrid" onClick={this.props.handleMenuClick}>hybrid</Menu.Item>
                </SubMenu>
                <SubMenu key="class" title="分类渲染"
                    key="sub6"
                    title={
                        <span>
                            <Icon type="right-square" theme="filled" />
                            <span>分类渲染</span>
                        </span>
                    }>
                    <Menu.Item key="classbyservice" onClick={this.props.handleMenuClick}>服务分类</Menu.Item>
                    <Menu.Item key="classbycomment" onClick={this.props.handleMenuClick}>评价分类</Menu.Item>
                    <Menu.Item key="classbydefault" onClick={this.props.handleMenuClick}>默认</Menu.Item>

                </SubMenu>
                <SubMenu
                    key="sub5"
                    title={
                        <span>
                            <Icon type="question-circle" theme="filled" />
                            <span>帮助</span>
                        </span>
                    }
                >
                    <Menu.Item key="13">使用帮助</Menu.Item>
                </SubMenu> */}
            </Menu>
        )
    }
}
