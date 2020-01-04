import React from 'react';
import PropTypes from 'prop-types';

import Input from '~/components/Input';

export default function InputMask({ customValue, onChange, ...rest }) {
  function handleChangeText(text) {
    if (/^\d+$/.test(text) || text === '') {
      onChange(text);
    }
  }

  return (
    <Input
      keyboardType="numeric"
      value={customValue}
      onChangeText={handleChangeText}
      {...rest}
    />
  );
}

InputMask.propTypes = {
  customValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
