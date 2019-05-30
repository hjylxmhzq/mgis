import React, { Component } from 'react';
import './header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        console.log(e);
    }
    render() {
        return (
            <div className="header">高尔夫信息数据综合</div>
        )
    }
}