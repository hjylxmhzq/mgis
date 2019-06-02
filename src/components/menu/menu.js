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
        const dynasty = {
            '圆形': {},
            '多边形': {},
        }
        const dynastyName = [];
        for (let name in dynasty) {
            dynastyName.push(name);
        }
        return (
            <Menu
                onClick={this.handleClick}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
            >
                <SubMenu
                    key="sub1"
                    title={
                        <span>
                            <Icon type="mail" />
                            <span>功能选择</span>
                        </span>
                    }
                >
                    <SubMenu key="g1" title="范围查询">
                        {dynastyName.map((name, index) => {
                            return <Menu.Item style={{
                                marginBottom: '0px',
                                height: '26px',
                                fontSize: '12px',
                                lineHeight: '26px'
                            }}
                                key={index.toString()}>{name}</Menu.Item>
                        })}
                    </SubMenu>
                    <SubMenu key="g2" title="路径计算">
                        <Menu.Item>
                            起点
                        </Menu.Item>
                        <Menu.Item>
                            终点
                        </Menu.Item>
                    </SubMenu>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={
                        <span>
                            <Icon type="appstore" />
                            <span>数据统计</span>
                        </span>
                    }
                >
                    <Menu.Item key="hotmap" onClick={this.props.handleMenuClick}>热力图</Menu.Item>
                    <Menu.Item key="static" onClick={this.props.handleMenuClick}>统计表格</Menu.Item>
                    <SubMenu key="sub3" title="Submenu">
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu>
                </SubMenu>
                <SubMenu
                    key="sub4"
                    title={
                        <span>
                            <Icon type="setting" />
                            <span>底图</span>
                        </span>
                    }
                >
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>                
                <SubMenu
                    key="sub5"
                    title={
                        <span>
                            <Icon type="setting" />
                            <span>帮助</span>
                        </span>
                    }
                >
                    <Menu.Item key="13">Option 9</Menu.Item>
                    <Menu.Item key="14">Option 10</Menu.Item>
                    <Menu.Item key="15">Option 11</Menu.Item>
                    <Menu.Item key="16">Option 12</Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}