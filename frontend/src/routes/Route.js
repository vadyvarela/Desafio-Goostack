import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import DefaultLayout from '~/pages/_layouts/default';

export default function RouteWrapper({
  component: Component,
  navItem,
  isPrivate,
  ...rest
}) {
  const dispatch = useDispatch();
  const signed = useSelector(state => state.auth.signed);

  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  if (signed && !isPrivate) {
    return <Redirect to="/students" />;
  }

  const Layout = signed ? DefaultLayout : undefined;

  return (
    <Route
      {...rest}
      render={props => {
        if (Layout) {
          return (
            <Layout>
              <Component {...props} />
            </Layout>
          );
        }
        return <Component {...props} />;
      }}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  activeNavItem: PropTypes.string,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
  activeNavItem: null,
};
