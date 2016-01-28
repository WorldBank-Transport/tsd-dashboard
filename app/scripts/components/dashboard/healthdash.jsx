import React from 'react';
import { connect } from 'reflux';
import HealthStore from '../../stores/health';

import T from '../misc/t';

require('stylesheets/dashboard/healthdash');

const HealthDash = React.createClass({

  mixins: [
    connect(HealthStore, 'data'),
  ],

  render() {
    if (this.state.data.hasOwnProperty('ckan')) {
      return (
        <div className="healthdash">
          <h4><T k="health.metric.title" /></h4>
          <h2>{this.state.data.ckan.count}</h2>
          <p>{this.state.data['healthdash.homepage.year']} <T k="home.target" /></p>
          <div className="target-stat">{this.state.data['healthdash.homepage.target']}</div>
        </div>
      );
    } else {
      return false;
    }
  },
});

export default HealthDash;
