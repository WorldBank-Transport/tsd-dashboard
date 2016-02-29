import React from 'react';
import T from '../misc/t';

require('stylesheets/boilerplate/footer');


const Footer = React.createClass({
  render() {
    return (
      <div className="footer">
        <img className="footer-logo" src="images/coatofarms.png"/>
        <div className="footer-nav">
        </div>
        <p className="copy"><T k="footer.copy" /></p>
      </div>
    );
  },
});

export default Footer;
