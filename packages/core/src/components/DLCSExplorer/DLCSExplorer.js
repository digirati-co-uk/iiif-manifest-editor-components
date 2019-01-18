import React from 'react';
import { withStyles, Button, Select, OutlinedInput } from '@material-ui/core';
import { Search, AddBox, PermIdentity } from '@material-ui/icons';

import ButtonWihTooltip from '../ButtonWithTooltip/ButtonWithTooltip';
import DLCSLoginPanel from './DLCSLoginPanel';
import DLCSImageThumbnail from './DLCSImageThumbnail';
import DLCSNewSpaceForm from './DLCSNewSpaceForm';
import DLCSSearchForm from './DLCSSearchForm';
import { getAuthHeader } from './DLCS.utils';
import DropzoneUpload from './DropzoneUpload';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 8;
const getItemStyle = (image, isDragging, draggableStyle) => {
  if (isDragging) {
    window.draggedData = JSON.parse(JSON.stringify(image));
  }
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    //padding: `${grid / 2}px ${grid}px`,
    //margin: `0 0 ${grid}px 0`,
    display: 'flex',
    boxSizing: 'border-box',
    width: '25%',
    // change background colour if dragging
    background: isDragging ? 'rgb(89, 191, 236)' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

console.log('DropzoneUpload', DropzoneUpload);

const styles = theme => {
  const pad = theme.spacing.unit;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${pad}px 0 ${pad}px ${pad}px`,
      borderBottom: '1px solid #eee',
      height: '48px',
    },
    user: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '64px',
    },
    toolbar: {
      display: 'flex',
      flexDirection: 'row',
      padding: `${pad}px 0`,
      height: 64,
    },
    spaceSelect: {
      width: '100%',
    },
    resultsGrid: {
      flex: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    results: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  };
};

/**
 * @class DLCSImageSelector
 * @extends React.Component
 *
 * This react component allows the user to list images after selecting DLCS space.
 */
class DLCSImageSelector extends React.Component {
  state = {
    session: null,
    spaces: [],
    selectedSpace: null,
    images: [],
    addNewSpaceActive: false,
    searchActive: false,
  };

  sessionAcquiredCallback = session => {
    fetch(session.dlcs_url + '/spaces', {
      method: 'GET',
      headers: getAuthHeader(session),
    })
      .then(response => response.json())
      .then(response =>
        this.setState({
          session: session,
          spaces: response.member,
        })
      )
      .catch(err => alert(err));
  };

  onLogout = () => {
    if (localStorage) {
      localStorage.removeItem('dlcsSession');
    }
    this.setState({
      session: null,
      spaces: [],
      selectedSpace: null,
      images: [],
    });
  };

  loadImages = (targetSpace, qs) => {
    fetch(targetSpace + '/images' + (qs ? `?${qs}` : ''), {
      method: 'GET',
      headers: getAuthHeader(this.state.session),
    })
      .then(response => response.json())
      .then(response =>
        this.setState({
          images: response.member,
          selectedSpace: targetSpace,
        })
      )
      .catch(err => alert(err));
  };

  onSelectedSpace = ev => {
    this.loadImages(ev.target.value);
  };

  toggleAddNewSpace = () => {
    this.setState({
      addNewSpaceActive: !this.state.addNewSpaceActive,
      searchActive: false,
    });
  };

  toggleSearchPanel = () => {
    this.setState({
      searchActive: !this.state.searchActive,
      addNewSpaceActive: false,
    });
  };

  addNewSpaceCallback = newSpace => {
    let newSpaces = JSON.parse(JSON.stringify(this.state.spaces));
    newSpaces.push(newSpace);
    this.setState({
      spaces: newSpaces,
      selectedSpace: newSpace['@id'],
      addNewSpaceActive: false,
    });
    this.loadImages(newSpace['@id']);
  };

  onSearchCallback = queryString => {
    this.loadImages(
      this.state.selectedSpace,
      queryString ? queryString : undefined
    );
  };

  render() {
    let self = this;
    let { endpoint, customer, classes } = this.props;
    if (!this.state.session && localStorage) {
      const session = localStorage.getItem('dlcsSession');
      if (session) {
        this.sessionAcquiredCallback(JSON.parse(session));
      }
    }
    if (this.state.session && this.state.selectedSpace) {
      console.log(this.state.selectedSpace);
      console.log(this.state.session);
    }

    return (
      <div className={classes.root}>
        {this.state.session ? (
          <React.Fragment>
            <div className={classes.header}>
              <span className={classes.user}>
                <PermIdentity />
                {this.state.session.userName}
              </span>
              <Button onClick={this.onLogout}>Logout</Button>
            </div>
            <div className={classes.toolbar}>
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
                native
                onChange={this.onSelectedSpace}
                value={this.state.selectedSpace}
                className={classes.spaceSelect}
                labelWidth={0}
                input={<OutlinedInput />}
              >
                <option key={'empty_value'} value={''}>
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
            <div className={classes.resultsGrid}>
              <Droppable droppableId="dlcsimagelist" isDropDisabled={true}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div className={classes.results}>
                      {(this.state.images || []).map((image, index) => (
                        <Draggable
                          key={image['@id']}
                          draggableId={image['@id']}
                          index={index}
                        >
                          {(providedDraggable, snapshotDraggable) => (
                            <span
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              style={getItemStyle(
                                image,
                                snapshotDraggable.isDragging,
                                providedDraggable.draggableProps.style
                              )}
                            >
                              <DLCSImageThumbnail image={image} />
                            </span>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
            {/* <div className={classes.resultsGrid}>
              <div className={classes.results}>
                {(this.state.images || []).map((image, index) => {
                  return !this.props.children ? (
                    <DLCSImageThumbnail
                      key={image['@id']}
                      image={image}
                      imageOnClick={this.props.imageOnClick || (() => {})}
                    />
                  ) : (
                    this.props.children(image, index)
                  );
                })}
              </div>
            </div> */}
            {this.state.session && this.state.selectedSpace && (
              <DropzoneUpload
                url={this.state.selectedSpace}
                baseUrl={this.state.session.dlcs_url}
                session={this.state.session}
              />
            )}
          </React.Fragment>
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

export default withStyles(styles)(DLCSImageSelector);
