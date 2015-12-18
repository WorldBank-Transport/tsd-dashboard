import React from 'react';
import Button from '../boilerplate/button';
import T from '../misc/t';
import MiniDash from './minidash';
import EduDash from '../dashboard/edudash';
import HealthDash from '../dashboard/healthdash';
import WaterDash from '../dashboard/waterdash';

require('stylesheets/boilerplate/static-content');

const Homepage = React.createClass({
  render() {
    return (
      <div className="home-page">
        <div className="home-header">
          <h3><T k="home.header" /></h3>
          <h2><T k="home.title" /></h2>
          <p><T k="home.text.p1" /></p>
          <p><T k="home.text.p2" /></p>
          <p><T k="home.text.p2" /></p>
        </div>
        <div className="homecontent">
          <h5><T k="home.select" /></h5>
          <div className="all-dashboard">
            <MiniDash image="edu-img.png" type="education" url="www.elimu.takumu.org"><EduDash /></MiniDash>
            <MiniDash image="health-img.png" type="health" url="www.safya.takumu.org"><HealthDash /></MiniDash>
            <MiniDash image="water-img.png" type="water" url="www.maji.takumu.org"><WaterDash /></MiniDash>
          </div>
          <h5><T k="home.other" /></h5>
          <div className="buttons">
            <Button linkTo="/dash/points/health/">
              <T k="home.button.open-data" />
            </Button>
            <Button linkTo="/dash/points/health/">
              <T k="home.button.brn" />
            </Button>
          </div>
        </div>
      </div>
    );
  },
});

export default Homepage;
