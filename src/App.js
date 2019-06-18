import React from 'react';
import './App.css';
import ToolPage from './components/toolpage';
import HomePage from './homepage';
import About from './about';
import { Layout, notification, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { actions, reducer, types } from './redux/app';
const { Header } = Layout;

const store = createStore(reducer);

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

class InnerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  changeMenu(menu) {
    this.props.handleMenuChange(menu.key);
  }

  render() {
    console.log(this.props)
    return (
      <div className="App">
        <Router>

          <Layout style={{ height: '100%' }}>
            <Header id="header" style={{ textAlign: 'left' }}>
              <div className="header_text">高尔夫信息综合</div>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[this.props.selectedMenu]}
                selectedKeys={[this.props.selectedMenu]}
                onClick={this.changeMenu.bind(this)}
                style={{ lineHeight: '64px', display: 'inline-block', verticalAlign: 'top', marginLeft: '50px' }}
              >
                <Menu.Item key="index"><Link to='/'>主页</Link></Menu.Item>
                <Menu.Item key="toolpage"><Link to='/tool/nosearch'>地图工具</Link></Menu.Item>
                <Menu.Item key="about"><Link to='/about'>关于我们</Link></Menu.Item>
              </Menu>
            </Header>
            <Route exact path='/' component={HomePage}></Route>
            <Route path='/tool/:search' component={ToolPage}></Route>
            <Route path='/about' component={About}></Route>
          </Layout>
        </Router>

      </div>
    );
  }
}

const MappedApp = connect(mapStatetoProps, mapDispatchtoProps)(InnerApp);

function App() {
  return (
    <Provider store={store}>
      <MappedApp />
    </Provider>
  )
}

export default App;
