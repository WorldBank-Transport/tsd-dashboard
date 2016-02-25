import React from 'react';

require('stylesheets/boilerplate/button');

const ButtonExLink = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    linkTo: React.PropTypes.string.isRequired,
  },
  render() {
    return (
      <div className="button">
        <a href= {this.props.linkTo} target="_blank">
           {this.props.children}
        </a>
      </div>
    );
  },
});
export default ButtonExLink;
