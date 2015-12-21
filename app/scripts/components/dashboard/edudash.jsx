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
    if (this.state.data.length > 0) {
      return (
        <div className="edudash">
          <h4><T k="education.metric.title" /></h4>
          <h2>{(this.state.data[0].avg).toFixed(1)} %</h2>
          <h4>{this.state.data[0].YEAR_OF_RESULT} <T k="home.target" /></h4>
        </div>
      );
    } else {
      return false;
    }
  },
});

export default EduDash;
