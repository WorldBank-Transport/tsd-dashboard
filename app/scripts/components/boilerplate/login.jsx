import React from 'react';
import { connect } from 'reflux';
import T from '../misc/t';
import { login, logout } from '../../actions/login';
import LoginStore from '../../stores/login';

require('stylesheets/boilerplate/login');

const Login = React.createClass({

  mixins: [
    connect(LoginStore, 'login'),
  ],

  getInitialState() {
    return {
      open: false,
      password: '',
      username: '',
    };
  },

  toogle() {
    this.replaceState({
      ...this.state,
      open: !this.state.open,
    });
  },

  login() {
    this.replaceState({
      ...this.state,
      open: false,
    });
    login(this.state.username, this.state.password);
  },

  logout() {
    this.replaceState({
      ...this.state,
      open: false,
      password: '',
      username: '',
    });
    logout();
  },

  handleChange(field) {
    return (e) => {
      this.replaceState({
        ...this.state,
        [field]: e.target.value,
      });
    };
  },

  render() {
    const linkDiv = (this.state.login.logged) ?
      (<div><T k="login.welcome" />: {this.state.login.user.n}<a onClick={this.logout}><T k="login.logout" /></a></div>) :
      (<a onClick={this.toogle}><T k="login.login" /></a>);
    const visible = this.state.open || this.state.login.err ? 'block' : 'none';
    return (
      <div className="login">
        {linkDiv}
        <div className="flyout" style={{display: visible}}>
          <div className="row">
            <span className="login-label"><T k="login.username" /></span><input onChange={this.handleChange('username')} value={this.state.username}/>
          </div>
          <div className="row">
            <span className="login-label"><T k="login.password" /></span><input onChange={this.handleChange('password')} type="password" value={this.state.password}/>
          </div>
          <div className="row">
            <button onClick={this.login}><T k="login.login" /></button>
          </div>
          {this.state.login.err ?
            (<div className="row error">
              <T k={this.state.login.err} />
            </div>) :
            ''
          }
        </div>
      </div>
    );
  },
});

export default Login;
