import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import './menu.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class LeftMenu extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        console.log(e);
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
                    <MenuItemGroup key="g1" title="范围查询">
                        {dynastyName.map((name, index) => {
                            return <Menu.Item style={{
                                marginBottom: '0px',
                                height: '26px',
                                fontSize: '12px',
                                lineHeight: '26px'
                            }}
                                key={index.toString()}>{name}</Menu.Item>
                        })}
                    </MenuItemGroup>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={
                        <span>
                            <Icon type="appstore" />
                            <span>Navigation Two</span>
                        </span>
                    }
                >
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
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
                            <span>Navigation Three</span>
                        </span>
                    }
                >
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}