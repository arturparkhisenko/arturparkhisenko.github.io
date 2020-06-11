import PropTypes from 'prop-types';
import React from 'react';

import './toggler.css';

export const Toggler = ({ theme, toggleTheme }) => (
  <div
    className="toggler"
    title={`${theme === 'dark' ? 'Light' : 'Dark'} mode`}
  >
    <input
      aria-label={`${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      checked={theme === 'dark'}
      id="toggler"
      onChange={event =>
        toggleTheme(event.target.checked === true ? 'dark' : 'light')
      }
      type="checkbox"
    />
    <label htmlFor="toggler" tabIndex="-1">
      {theme === 'dark' ? '🌇' : '🌃'}
    </label>
  </div>
);

Toggler.propTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func.isRequired
};
