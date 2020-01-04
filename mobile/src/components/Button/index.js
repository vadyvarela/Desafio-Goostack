import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { TButton, TButtonText } from './styles';

export default function Button({ children, loading, ...rest }) {
  return (
    <TButton {...rest}>
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <TButtonText>{children}</TButtonText>
      )}
    </TButton>
  );
}

Button.defaultProps = {
  loading: false,
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};
