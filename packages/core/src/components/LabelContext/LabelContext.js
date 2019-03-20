import * as React from 'react';
import * as PropTypes from 'prop-types';

//TODO: translation
const LabelContext = React.createContext({});
export const LabelProvider = LabelContext.Provider;
export const LabelConsumer = LabelContext.Consumer;
export const Label = ({ children, name, names }) => (
  <LabelConsumer>
    {labels => {
      if (names && Array.isArray(names)) {
        for (let _name of names) {
          if (labels[_name]) {
            return labels[_name];
          }
        }
        return children;
      }
      return name && typeof name === 'string'
        ? labels[name] || children
        : children;
    }}
  </LabelConsumer>
);
