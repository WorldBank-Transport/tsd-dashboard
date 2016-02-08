import React, { PropTypes } from 'react';
import T from '../misc/t';

require('stylesheets/boilerplate/static-content');

const MiniDash = React.createClass({

  propTypes: {
    children: PropTypes.node.isRequired,
    image: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  },

  render() {
    return (
      <div className="minidash">
        <div className="homebanner">
          <h2><T k={`${this.props.type}.title`} /></h2>
          <a className="img-link" href={this.props.url}>
            <img src={`images/${this.props.image}`}/>
          </a>
        </div>
        <div className="content">
          <div className="stats">
            {this.props.children}
          </div>
          <p>
            <a className="url-link" href={this.props.url}>
              <T k="dashboard.url" />
            </a>
            {this.props.url}
          </p>
        </div>
      </div>
    );
  },
});

export default MiniDash;
