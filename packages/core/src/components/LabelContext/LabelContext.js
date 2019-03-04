import * as React from 'react';
import * as PropTypes from 'prop-types';

//TODO: translation
const LabelContext = React.createContext({});
export const LabelProvider = LabelContext.Provider;
export const LabelConsumer = LabelContext.Consumer;
export const Label = ({ children, name }) => (
  <LabelConsumer>
    {labels => {
      return name && typeof name === 'string'
        ? labels[name] || children
        : children;
    }}
  </LabelConsumer>
);
