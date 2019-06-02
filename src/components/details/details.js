import React, { Component } from 'react';
import { Modal, Button } from 'antd';

export default class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible: nextProps.visible });
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.closeModal();
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
                    onCancel={this.handleCancel}
                    width="90%"
                >
                    {this.props.content}
                </Modal>
            </div>
        );
    }
}