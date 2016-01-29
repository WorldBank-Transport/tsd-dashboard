import React from 'react';
import { connect } from 'reflux';
import WaterStore from '../../stores/water';

import T from '../misc/t';


require('stylesheets/dashboard/waterdash');

const WaterDash = React.createClass({

  mixins: [
    connect(WaterStore, 'data'),
  ],

  render() {
    if (this.state.data.hasOwnProperty('ckan')) {
      return (
        <div className="waterdash">
          <h4><T k="waterdash.metric.title" /></h4>
          <h2>{(this.state.data.ckan.served / this.state.data.ckan.population * 100).toFixed(1)} %</h2>
          <p>{this.state.data['waterdash.homepage.year']} <T k="home.target" /></p>
          <div className="target-stat">{this.state.data['waterdash.homepage.target']}</div>
        </div>
      );
    } else {
      return false;
    }
  },
});

export default WaterDash;
