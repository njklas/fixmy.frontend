import React, { PureComponent } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import SearchBar from '~/components/SearchBar';
// import LocatorControl from '~/components/LocatorControl';
import MapSwitch from '~/components/MapSwitch';
import MapModal from '~/components/MapModal';

import MyHBI from '~/modules/MyHBI';

import Store from '~/redux/store';

import Map from './Map';

import * as MapActions from './MapState';

const MapView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden
`;

const MapWrapper = styled.div`
  flex: 1 1 auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;

class MapViewComponent extends PureComponent {
  state = {
    userLocation: null
  }

  componentDidMount() {
    const view = config.map.views[this.props.location.pathname];
    if (view) {
      Store.dispatch(MapActions.setView(Object.assign(view, { animate: false })));
    }
  }

  componentDidUpdate(prevProps) {
    const prevPath = prevProps.location.pathname;
    const thisPath = this.props.location.pathname;
    const nextView = config.map.views[thisPath];

    if (prevPath !== thisPath && nextView) {
      const view = this.props.hasMoved ? { activeLayer: nextView.activeLayer } : nextView;
      Store.dispatch(MapActions.setView(view));
    }
  }

  updateView = (view) => {
    Store.dispatch(MapActions.setView(view));
  }

  handleLocationChange = (userLocation) => {
    this.updateView({ center: userLocation });
  }

  render() {
    return (
      <MapView>
        <MapWrapper>
          <Route
            path="(/zustand|/planungen|/my-hbi)"
            component={SearchBar}
          />
          {/* <Route
            path="(/zustand|/planungen)"
            render={() => (
              <LocatorControl
                onChange={this.handleLocationChange}
                position="bottom-right"
              />
            )}
          /> */}
          <Route
            path="(/|/zustand|/planungen|/my-hbi)"
            render={() => (
              <Map
                key="MapComponent"
                accessToken={config.map.accessToken}
                zoom={this.props.zoom}
                center={this.props.center}
                bearing={this.props.bearing}
                pitch={this.props.pitch}
                show3dBuildings={this.props.show3dBuildings}
                activeLayer={this.props.activeLayer}
                activeSection={this.props.activeSection}
                animate={this.props.animate}
                updateView={this.updateView}
                hasMoved={this.props.hasMoved}
                hbi_values={this.props.hbi_values}
              />
            )}
          />
          <Route
            path="(/zustand|/planungen)"
            component={MapModal}
          />
        </MapWrapper>
        <Route
          path="(/zustand|/planungen)"
          component={MapSwitch}
        />
        <Route
          path="/my-hbi"
          component={MyHBI}
        />
      </MapView>
    );
  }
}

export default withRouter(
  connect(state => ({
    ...state.MapState,
    ...state.UserState
  }))(MapViewComponent)
);
