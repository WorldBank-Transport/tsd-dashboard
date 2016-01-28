import React from 'react';
import { connect } from 'reflux';
import { loadE } from '../../actions/data';
import EducationStore from '../../stores/education';

import T from '../misc/t';

require('stylesheets/dashboard/edudash');

const EduDash = React.createClass({

  mixins: [
    connect(EducationStore, 'data'),
  ],

  componentDidMount() {
    loadE();
  },

  render() {
    if (this.state.data.hasOwnProperty('ckan')) {
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

export default EduDash;
