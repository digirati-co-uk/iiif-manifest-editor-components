import * as React from 'react';
import * as PropTypes from 'prop-types';

//TODO: translation
const LabelContext = React.createContext({});
export const LabelProvider = LabelContext.Provider;
export const LabelConsumer = LabelContext.Consumer;

const getLabelFromNames = (labels, names) => 
  names
    .map(_name => labels[_name])
    .filter(label=>typeof label === 'string')[0]

export const Label = ({ children, name, names }) => (
  <LabelConsumer>
    {labels => {
      let result = children;
      if (Array.isArray(names)) {
        const firstHit = getLabelFromNames(labels, names);
        if (firstHit) {
          result = firstHit
        }
      } else if (typeof name === 'string' && labels[name]) {
        result = labels[name]
      }
      return result;
    }}
  </LabelConsumer>
);
