import React from 'react';

import './style.css';

const ErrorMessage = ({ error }) => (
  <div className="ErrorMessage">
    <small>{error.message}</small>
  </div>
);

export default ErrorMessage;
