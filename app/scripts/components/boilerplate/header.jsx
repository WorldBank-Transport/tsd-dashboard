import React from 'react';
import OpenDataNav from './open-data-nav';
import LanguageSelector from './language-selector';
import Logo from './logo';
import Login from './login';

require('stylesheets/boilerplate/header');

const Header = React.createClass({
  render() {
    return (
      <div className="header">
        <Logo/>
        <div className="header-nav">
          <OpenDataNav />
          <LanguageSelector />
          <Login />
        </div>
      </div>
    );
  },
});

export default Header;
