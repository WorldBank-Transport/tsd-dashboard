import React from 'react';
import { connect } from 'reflux';
// actions
import { loadUrl, loadG, saveProperties } from '../../actions/data';
// stores
import LoginStore from '../../stores/login';
import EducationStore from '../../stores/education';
import GeneralStore from '../../stores/general';
import HealthStore from '../../stores/health';
import MessageStore from '../../stores/message';
import WaterStore from '../../stores/water';

// components
import T from '../misc/t';

require('stylesheets/dashboard/admin');

const properties = {
  general: [
    'ckan.url',
    'ckan.base-url',
  ],
  education: [
    'edudash.homepage.year',
    'edudash.homepage.target',
    'edudash.homepage.query',
  ],
  health: [
    'healthdash.homepage.year',
    'healthdash.homepage.target',
    'healthdash.homepage.query',
  ],
  water: [
    'waterdash.homepage.year',
    'waterdash.homepage.target',
    'waterdash.homepage.query',
  ],
};

const Admin = React.createClass({

  mixins: [
    connect(EducationStore, 'education'),
    connect(GeneralStore, 'general'),
    connect(HealthStore, 'health'),
    connect(LoginStore, 'login'),
    connect(MessageStore, 'message'),
    connect(WaterStore, 'water'),
  ],

  componentDidMount() {
    loadUrl();
    loadG();
  },

  handleChange(section, field) {
    return (e) => {
      this.replaceState({
        ...this.state,
        [section]: {
          ...this.state[section],
          [field]: e.target.value,
        },
      });
    };
  },

  submit() {
    const allProperties = [];
    Object.keys(properties).forEach(section => {
      properties[section].forEach(property => {
        allProperties.push({p: property, v: this.state[section][property]});
      });
    });
    saveProperties(this.state.login.user, allProperties);
  },

  render() {
    const renderProps = (prop) => (
      <div>
        <h3><T k={`admin.section.${prop}`} /></h3>
        {
          properties[prop].map(property => (
            <div className="row">
              <T k={property} /><input onChange={this.handleChange(prop, property)} value={this.state[prop][property]}/>
            </div>
          ))
        }
      </div>
    );

    if (this.state.login.logged) {
      return (
        <div className="admin">
          <h2><T k="admin.title" /></h2>
          {Object.keys(properties).map(renderProps)}
          <div><button onClick={this.submit}><T k="admin.button" /></button></div>
          {this.state.message.hasOwnProperty('message') ? (<T k={this.state.message.message} />) : ''}
        </div>
      );
    } else {
      return (<h1>You are not logged in</h1>);
    }
  },
});

export default Admin;
