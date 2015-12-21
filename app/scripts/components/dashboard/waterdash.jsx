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
        </div>
      );
    } else {
      return false;
    }
  },
});

export default WaterDash;
