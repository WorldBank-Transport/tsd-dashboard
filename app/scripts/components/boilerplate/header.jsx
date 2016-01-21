import React from 'react';
import LanguageSelector from './language-selector';
import Logo from './logo';

require('stylesheets/boilerplate/header');

const Header = React.createClass({
  render() {
    return (
      <div className="header">
        <Logo/>
        <div className="header-nav">
          <LanguageSelector />
        </div>
      </div>
    );
  },
});

export default Header;
