import React from 'react';
import { connect } from 'reflux';
// actions
import { loadUsers, saveUser } from '../../actions/users';
import { logMessage } from '../../actions/message';
// stores
import LoginStore from '../../stores/login';
import MessageStore from '../../stores/message';
import UsersStore from '../../stores/users';

// components
import T from '../misc/t';

require('stylesheets/dashboard/users');

const properties = [
  'u',
  'p',
  'n',
];

const Users = React.createClass({

  mixins: [
    connect(LoginStore, 'login'),
    connect(MessageStore, 'message'),
    connect(UsersStore, 'users'),
  ],

  getInitialState() {
    return {user: null};
  },

  componentDidMount() {
    loadUsers(this.state.login.user);
  },

  handleChange(field) {
    return (e) => {
      if (e.target.value) {
        logMessage(`user.invalid.${field}`);
      }
      this.replaceState({
        ...this.state,
        user: {
          ...this.state.user,
          [field]: e.target.value,
        },
      });
    };
  },

  handleEdit(id) {
    return () => {
      const user = this.state.users.find(u => u._id === id);
      this.replaceState({
        ...this.state,
        user: user,
      });
    };
  },

  handleNew() {
    this.replaceState({
      ...this.state,
      user: {},
    });
  },

  submit() {
    if (this.state.user.u) {
      logMessage('user.invalid.u');
    } else if (this.state.user.p) {
      logMessage('user.invalid.p');
    } else if (this.state.user.n) {
      logMessage('user.invalid.n');
    } else {
      saveUser(this.state.login.user, this.state.user);
    }
  },

  renderList() {
    return (
      <div className="user-list">
        <h3><T k="user.list.title" /></h3>
        <table className="user-table">
          <tr>
            {properties.map(prop => (<th><T k={`user.${prop}`} /></th>))}
            <th><T k="user.actions" /></th>
          </tr>
          {this.state.users.map(user => (
            <tr>
              {properties.map(prop => (<td>{user[prop]}</td>))}
              <td><a onClick={this.handleEdit(user._id)}><T k="user.edit" /></a></td>
            </tr>
          ))}
        </table>
      </div>);
  },

  renderForm() {
    if (this.state.user !== null) {
      const renderProps = (prop) => (
        <div>
          <div className="row">
            <T k={`user.${prop}`} /><input onChange={this.handleChange(prop)} value={this.state.user[prop]}/>
          </div>
        </div>
      );
      return (
        <div className="user-form">
          <h3><T k="user.title" /></h3>
          {properties.map(renderProps)}
          <div><button onClick={this.submit}><T k="user.button" /></button></div>
          {this.state.message.hasOwnProperty('message') ? (<T k={this.state.message.message} />) : ''}
        </div>
      );
    }
    return false;
  },

  render() {
    if (this.state.login.logged) {
      return (
        <div className="users">
          {this.renderList()}
          <div><button onClick={this.handleNew}><T k="user.new" /></button></div>
          {this.renderForm()}
        </div>
      );
    } else {
      return (<h1>You are not logged in</h1>);
    }
  },
});

export default Users;
