import React, { useEffect } from 'react';

export default function Input(props) {
  const { input, label, errors, type, value = '' } = props;

  function labelTransitionOnBlur() {
    const labelTag = document.querySelector(`label[for=${input.name}]`);
    if (document.getElementById(input.name).value !== '') {
      labelTag.classList.add('translate');
    } else {
      labelTag.classList.remove('translate');
    }
  }

  useEffect(() => {
    if (type === 'date' || type === 'file') {
      const labelTag = document.querySelector(`label[for=${input.name}]`);
      labelTag.classList.add('translate');
    } else {
      document
        .getElementById(input.name)
        .addEventListener('blur', labelTransitionOnBlur);
    }
  }, []);

  return (
    <>
      <input
        type={type}
        id={input.name}
        {...input}
        accept={type === 'file' ? 'image/*' : '*'}
        defaultValue={value}
      />
      <div className="inputFocusLines">
        <div className="inactiveLine"></div>
        <div className="activeLine"></div>
      </div>
      <label htmlFor={input.name} className={value !== '' ? 'translate' : ''}>
        {label}
      </label>
      <span className="inputErrorField" id={`${input.name}ErrorField`}>
        &nbsp;
        {errors[input.name]?.message}
      </span>
    </>
  );
}
