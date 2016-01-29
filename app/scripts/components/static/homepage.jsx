import React from 'react';
import { connect } from 'reflux';
import Button from '../boilerplate/button';
import T from '../misc/t';
import MiniDash from './minidash';
import EduDash from '../dashboard/edudash';
import HealthDash from '../dashboard/healthdash';
import WaterDash from '../dashboard/waterdash';
import { loadUrl } from '../../actions/data';
import LoginStore from '../../stores/login';

require('stylesheets/boilerplate/static-content');

const Homepage = React.createClass({

  mixins: [
    connect(LoginStore, 'login'),
  ],

  componentDidMount() {
    loadUrl();
  },

  render() {
    return (
      <div className="home-page">
        <div className="home-header">
          <h3><T k="home.header" /></h3>
          <h2><T k="home.title" /></h2>
          <div className="text-section centered">
          <p><T k="home.text.p1" /></p>
          <p><T k="home.text.p2" /></p>
          <p><T k="home.text.p3" /></p>
          </div>

        </div>
        <div className="homecontent">
          <h5><T k="home.select" /></h5>
          <div className="all-dashboard">
            <div className="minidash-wrapper">
              <MiniDash image="edu-img.png" type="education" url="http://elimu.takwimu.org/"><EduDash /></MiniDash>
              <MiniDash image="health-img.png" type="health" url="http://afya.takwimu.org"><HealthDash /></MiniDash>
              <MiniDash image="water-img.png" type="water" url="http://maji.takwimu.org"><WaterDash /></MiniDash>
            </div>
          </div>
          <div className="buttons">
            <h5><T k="home.other" /></h5>
            <div className="button-col left">
              <Button linkTo="">
                <T k="home.button.open-data" />
              </Button>
            </div>
            <div className="button-col right">
              <Button linkTo="">
                <T k="home.button.brn" />
              </Button>
            </div>
            {this.state.login.logged ?
              (<div className="button-col left">
                <Button linkTo="/admin"><T k="home.button.admin" /></Button>
              </div>) : ''
            }
          </div>
        </div>
      </div>
    );
  },
});

export default Homepage;
