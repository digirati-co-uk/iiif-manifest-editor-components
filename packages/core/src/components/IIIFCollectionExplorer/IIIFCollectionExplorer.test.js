import * as React from 'react';
import IIIFCollectionExplorer from './IIIFCollectionExplorer';

describe('IIIFCollectionExplorer', () => {
  it('renders the collection explorer unchanged', () => {
    const collectionExplorer = shallow(<IIIFCollectionExplorer url={null} />);
    expect(collectionExplorer).toMatchSnapshot();
  });
});
