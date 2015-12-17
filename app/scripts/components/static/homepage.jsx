import React from 'react';
import Button from '../boilerplate/button';
import T from '../misc/t';

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
          
          <h5><T k="home.other" /></h5>
          <Button linkTo="/dash/points/health/">
            <T k="home.button.open-data" />
          </Button>
          <Button linkTo="/dash/points/health/">
            <T k="home.button.brn" />
          </Button>
        </div>
      </div>
    );
  },
});

export default Homepage;
