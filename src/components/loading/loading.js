import React, { Component } from 'react';
import { Icon } from 'antd';
import './loading.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        console.log(e);
    }
    render() {
        if (this.props.show){
            return (
                <div className="loading"><div className="loading_text">加载中</div><div className="loading_icon"><Icon type="loading" style={{ fontSize: '60px', color: '#08c' }} /></div></div>
            )
        } else {
            return null;
        }
    }
}