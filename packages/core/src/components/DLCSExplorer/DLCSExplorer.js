import React from 'react';
import { withStyles, Button, Select, OutlinedInput } from '@material-ui/core';
import { Search, AddBox, PermIdentity } from '@material-ui/icons';

import ButtonWihTooltip from '../ButtonWithTooltip/ButtonWithTooltip';
import DLCSLoginPanel from './DLCSLoginPanel';
import { DLCSImageThumbnail } from './DLCSImageThumbnail';
import { DLCSNewSpaceForm } from './DLCSNewSpaceForm';
import { DLCSSearchForm } from './DLCSSearchForm';
import { getAuthHeader } from './DLCS.utils';

/**
 * @class DLCSImageSelector
 * @extends React.Component
 *
 * This react component allows the user to list images after selecting DLCS space.
 */
class DLCSImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      spaces: [],
      selectedSpace: null,
      images: [],
      addNewSpaceActive: false,
      searchActive: false,
    };
    this.sessionAcquiredCallback = this.sessionAcquiredCallback.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onSelectedSpace = this.onSelectedSpace.bind(this);
    this.loadImages = this.loadImages.bind(this);
    this.toggleAddNewSpace = this.toggleAddNewSpace.bind(this);
    this.toggleSearchPanel = this.toggleSearchPanel.bind(this);
    this.addNewSpaceCallback = this.addNewSpaceCallback.bind(this);
    this.onSearchCallback = this.onSearchCallback.bind(this);
  }

  sessionAcquiredCallback(session) {
    let self = this;
    fetch(session.dlcs_url + '/spaces', {
      method: 'GET',
      headers: getAuthHeader(session),
    })
      .then(response => response.json())
      .then(response => {
        self.setState({
          session: session,
          spaces: response.member,
        });
      })
      .catch(err => alert(err));
  }

  onLogout() {
    this.setState({
      session: null,
      spaces: [],
      selectedSpace: null,
      images: [],
    });
  }

  loadImages(targetSpace, qs) {
    let self = this;
    fetch(targetSpace + '/images' + (qs ? `?${qs}` : ''), {
      method: 'GET',
      headers: getAuthHeader(self.state.session),
    })
      .then(response => response.json())
      .then(response => {
        self.setState({
          images: response.member,
          selectedSpace: targetSpace,
        });
      })
      .catch(err => alert(err));
  }

  onSelectedSpace(ev) {
    this.loadImages(ev.target.value);
  }

  toggleAddNewSpace() {
    this.setState({
      addNewSpaceActive: !this.state.addNewSpaceActive,
      searchActive: false,
    });
  }

  toggleSearchPanel() {
    this.setState({
      searchActive: !this.state.searchActive,
      addNewSpaceActive: false,
    });
  }

  addNewSpaceCallback(newSpace) {
    let newSpaces = JSON.parse(JSON.stringify(this.state.spaces));
    newSpaces.push(newSpace);
    this.setState({
      spaces: newSpaces,
      selectedSpace: newSpace['@id'],
      addNewSpaceActive: false,
    });
    this.loadImages(newSpace['@id']);
  }

  onSearchCallback(queryString) {
    this.loadImages(
      this.state.selectedSpace,
      queryString ? queryString : undefined
    );
  }

  render() {
    let self = this;
    let { endpoint, customer } = this.props;
    return (
      <div className="dlcs-image-panel">
        {this.state.session ? (
          <div className="dlcs-image-panel__content">
            <div className="dlcs-image-panel__header">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 8,
                  borderBottom: '1px solid #eee',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <PermIdentity />
                  {this.state.session.userName}
                </span>
                <Button onClick={this.onLogout}>Logout</Button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: 8,
                }}
              >
                <ButtonWihTooltip
                  // className={
                  //   'dlcs-image-panel__add-new-space' +
                  //   (this.state.addNewSpaceActive ? ' active' : '')
                  // }
                  onClick={this.toggleAddNewSpace}
                  title="Add New Space"
                >
                  <AddBox />
                </ButtonWihTooltip>
                <Select
                  onChange={this.onSelectedSpace}
                  value={this.state.selectedSpace}
                  margin="dense"
                  variant="outlined"
                  style={{
                    width: '100%',
                  }}
                  input={<OutlinedInput labelWidth={0} />}
                >
                  <option key="" value="">
                    Select Space
                  </option>
                  {(this.state.spaces || []).map(space => (
                    <option key={space['@id']} value={space['@id']}>
                      {space.name} - {space.approximateNumberOfImages}
                    </option>
                  ))}
                </Select>
                <ButtonWihTooltip
                  // className={
                  //   'dlcs-image-panel__search-button' +
                  //   (this.state.searchActive ? ' active' : '')
                  // }
                  title="Search"
                  onClick={this.toggleSearchPanel}
                >
                  <Search />
                </ButtonWihTooltip>
              </div>
              <DLCSNewSpaceForm
                style={{
                  display: this.state.addNewSpaceActive ? 'block' : 'none',
                }}
                session={this.state.session}
                callback={this.addNewSpaceCallback}
              />
              <DLCSSearchForm
                style={{
                  display: this.state.searchActive ? 'block' : 'none',
                }}
                callback={this.onSearchCallback}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              {(self.state.images || []).map((image, index) => {
                return !self.props.children ? (
                  <DLCSImageThumbnail
                    key={image['@id']}
                    image={image}
                    imageOnClick={self.props.imageOnClick || (() => {})}
                  />
                ) : (
                  self.props.children(image, index)
                );
              })}
            </div>
          </div>
        ) : (
          <DLCSLoginPanel
            loginCallback={this.sessionAcquiredCallback}
            endpoint={endpoint}
            customer={customer}
          />
        )}
      </div>
    );
  }
}

export default DLCSImageSelector;
