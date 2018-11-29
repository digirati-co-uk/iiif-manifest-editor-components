import React from 'react';
import CollectionExplorer from './CollectionExplorer';

describe('CollectionExplorer', () => {
  it('renders the collection explorer unchanged', () => {
    const collectionExplorer = shallow(<CollectionExplorer url={null} />);
    expect(collectionExplorer).toMatchSnapshot();
  });
});
