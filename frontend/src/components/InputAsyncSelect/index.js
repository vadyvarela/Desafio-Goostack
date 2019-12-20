import React, { useRef, useEffect, useMemo, useState } from 'react';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';

import { useField } from '@rocketseat/unform';

export default function InputAsyncSelect({ name, loadOptions, ...rest }) {
  const ref = useRef();
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue);

  useMemo(() => setValue(defaultValue), [defaultValue]); //eslint-disable-line

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  function handleChange(selectedValue) {
    setValue(selectedValue);
  }

  return (
    <>
      <AsyncSelect
        name={fieldName}
        loadOptions={loadOptions}
        value={value}
        ref={ref}
        onChange={handleChange}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        className="react-asyncselect-container"
        classNamePrefix="react-asyncselect"
        {...rest}
      />

      {error && <span>{error}</span>}
    </>
  );
}

InputAsyncSelect.propTypes = {
  name: PropTypes.string.isRequired,
  loadOptions: PropTypes.func.isRequired,
};
