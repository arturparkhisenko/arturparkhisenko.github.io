import React from 'react';
import useDarkMode from 'use-dark-mode';

import './toggler.css';

export const Toggler = () => {
  const darkMode = useDarkMode(false);

  return (
    <div
      className="toggler"
      title={`${darkMode.value === true ? 'Light' : 'Dark'} mode`}
    >
      <input
        aria-label={`${darkMode.value === true ? 'Light' : 'Dark'} mode`}
        checked={darkMode.value === true}
        id="toggler"
        onChange={darkMode.toggle}
        type="checkbox"
      />
      <label htmlFor="toggler" tabIndex="-1">
        {darkMode.value === true ? '🌇' : '🌃'}
      </label>
    </div>
  );
};
