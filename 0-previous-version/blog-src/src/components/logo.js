import PropTypes from 'prop-types';
import React from 'react';

import './logo.css';

export const Logo = props => <div className="logo">{props.title}</div>;

Logo.propTypes = {
  title: PropTypes.string
};
