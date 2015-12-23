import React from 'react';
import { connect } from 'reflux';
import { loadW } from '../../actions/data';
import WaterStore from '../../stores/water';

import T from '../misc/t';


require('stylesheets/dashboard/waterdash');

const WaterDash = React.createClass({

  mixins: [
    connect(WaterStore, 'data'),
  ],

  componentDidMount() {
    loadW();
  },

  render() {
    if (this.state.data.length > 0) {
      return (
        <div className="waterdash">
          <h4><T k="waterdash.metric.title" /></h4>
          <h2>{(this.state.data[0].served / this.state.data[0].population * 100).toFixed(1)} %</h2>
          <p>{this.state.data[0].YEAR_OF_RESULT} <T k="home.target" /></p>
          <div className="target-stat">61%</div>
        </div>
      );
    } else {
      return false;
    }
  },
});

export default WaterDash;
