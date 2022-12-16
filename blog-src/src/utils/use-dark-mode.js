import { useEffect, useState, useMemo } from 'react';

import useEventListener from './use-event-listener';

// Rewritten MIT https://github.com/donavon/use-dark-mode

const preferDarkQuery = '(prefers-color-scheme: dark)';
const classNameDark = 'dark-mode';
const classNameLight = 'light-mode';
const storageKey = 'darkMode';

const initialize = () => {
  const mql = window.matchMedia ? window.matchMedia(preferDarkQuery) : {};

  const mediaQueryEventTarget = {
    addEventListener: (_, handler) =>
      mql.addListener && mql.addListener(handler),
    removeEventListener: (_, handler) =>
      mql.removeListener && mql.removeListener(handler)
  };

  const isColorSchemeQuerySupported = mql.media === preferDarkQuery;

  const getInitialValue = usersInitialState =>
    isColorSchemeQuerySupported ? mql.matches : usersInitialState;

  const getDefaultOnChange =
    (element, classNameDark, classNameLight) => val => {
      element.classList.add(val === 'true' ? classNameDark : classNameLight);
      element.classList.remove(val === 'true' ? classNameLight : classNameDark);
    };

  return {
    getDefaultOnChange,
    mediaQueryEventTarget,
    getInitialValue
  };
};

const useDarkMode = (initialValue = 'false') => {
  const { getDefaultOnChange, mediaQueryEventTarget } = useMemo(
    () => initialize(),
    []
  );
  const [mode, setMode] = useState(
    localStorage.getItem(storageKey) || initialValue
  );

  const element = window.document && window.document.body;

  const setState = value => {
    localStorage.setItem(storageKey, value);
    setMode(value);
  };

  const stateChangeCallback = useMemo(
    () => getDefaultOnChange(element, classNameDark, classNameLight),
    [element, getDefaultOnChange]
  );

  useEffect(() => {
    stateChangeCallback(mode);
  }, [stateChangeCallback, mode]);

  useEventListener(
    'change',
    ({ matches }) => setState(matches),
    mediaQueryEventTarget
  );

  return {
    value: mode,
    toggle: () => setState(mode === 'true' ? 'false' : 'true')
  };
};

export default useDarkMode;
