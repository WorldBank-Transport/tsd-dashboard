import React from 'react';
import { connect } from 'reflux';
import { loadH } from '../../actions/data';
import HealthStore from '../../stores/health';

import T from '../misc/t';

require('stylesheets/dashboard/healthdash');

const HealthDash = React.createClass({

  mixins: [
    connect(HealthStore, 'data'),
  ],

  componentDidMount() {
    loadH();
  },

  render() {
    if (this.state.data.length > 0) {
      return (
        <div className="healthdash">
          <h4><T k="health.metric.title" /></h4>
          <h2>{this.state.data[0].count}</h2>
        </div>
      );
    } else {
      return false;
    }
  },
});

export default HealthDash;
