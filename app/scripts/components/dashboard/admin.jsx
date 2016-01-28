import React from 'react';
import { connect } from 'reflux';
import LoginStore from '../../stores/login';

import T from '../misc/t';

require('stylesheets/dashboard/edudash');

const Admin = React.createClass({

  mixins: [
    connect(LoginStore, 'login'),
  ],

  render() {
    if (this.state.login.logged) {
      return (
        <div className="edudash">
          <h4><T k="education.metric.title" /></h4>
          <h2>{(this.state.data.ckan.avg).toFixed(1)} %</h2>
          <p>{this.state.data['edudash.homepage.year']} <T k="home.target" /></p>
          <div className="target-stat">{this.state.data['edudash.homepage.target']}</div>
        </div>
      );
    } else {
      return false;
    }
  },
});

export default Admin;