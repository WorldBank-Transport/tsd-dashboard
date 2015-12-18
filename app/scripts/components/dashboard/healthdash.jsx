import React from 'react';

require('stylesheets/dashboard/healthdash');

const HealthDash = React.createClass({
  render() {
    return (
      <div className="healthdash">
        Health stats
      </div>
    );
  },
});

export default HealthDash;
