import React from 'react';
import './App.css';
import Menu from './components/menu';
import Mainbox from './components/mainbox'
//import Header from './components/header';
import { Layout, notification, Button } from 'antd';
const { Header, Content, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      hotmap: false,
      drawerVisible: false,
      basemap: 'dark-gray',
      reset: false
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

  componentDidUpdate() {
    if (this.state.reset) {
      this.setState({reset: false});
    }
  }

  handleMenuClick(e) {
    let prevState = this.state;
    let state = {};
    switch (e.key) {
      case 'hotmap':
        state.hotmap = !this.state.hotmap;
        let msg = state.hotmap ? '密度图已打开' : '密度图已关闭';
        this.notice(msg);
        break;
      case 'static':
        state.drawerVisible = !this.state.drawerVisible;
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
    }
    this.setState(state);
  }

  onCloseDrawer() {
    this.setState({ drawerVisible: false });
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <div className="App">
        <Layout style={{ height: '100%' }}>
          <Header><div className="header_text">高尔夫信息综合</div></Header>
          <Layout>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              className="sider"
              style={{ textAlign: 'left', overflow: 'hidden scroll', background: '#fff' }}
            >
              <Menu handleMenuClick={this.handleMenuClick.bind(this)} />
            </Sider>
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
                  reset={this.state.reset}
                  basemap={this.state.basemap}
                  hotmap={this.state.hotmap}
                  drawerVisible={this.state.drawerVisible}
                  onCloseDrawer={this.onCloseDrawer.bind(this)}
                />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
