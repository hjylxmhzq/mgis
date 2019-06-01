import React from 'react';
import './App.css';
import Menu from './components/menu';
import Mainbox from './components/mainbox'
//import Header from './components/header';
import { Layout } from 'antd';
const { Header, Content, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
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
              <Menu />
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
                <Mainbox />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
