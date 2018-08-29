import React, { PureComponent } from 'react';
import withRouter from 'react-router-dom/withRouter';
import Route from 'react-router-dom/Route';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Loadable from 'react-loadable';

import * as MapActions from '~/pages/Map/MapState';
import LocatorControl from '~/pages/Map/components/LocatorControl';
import MapPopup from '~/pages/Map/components/MapPopup';
import MapControl from '~/pages/Map/components/MapControl';
import MapContent from '~/pages/Map/components/MapContent';
import SearchBar from '~/components/SearchBar';
import FMBLogo from '~/components/FMBLogo';
import Store from '~/store';
import { matchMediaSize, breakpoints, media } from '~/general/style-utils';
import WebglMap from '~/pages/Map/components/WebglMap';
import MyHBI from '~/pages/MyHBI';

export const SectionDetail = Loadable({
  loader: () => import('~/pages/Map/components/DetailView/SectionDetail'),
  loading: () => null
});

export const PlanningDetail = Loadable({
  loader: () => import('~/pages/Map/components/DetailView/PlanningDetail'),
  loading: () => null
});

const MapView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const MapWrapper = styled.div`
  flex: 1 1 auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledFMBLogo = styled(FMBLogo)`
  display: none;

  ${media.m`
    display: block;
  `}
`;

class MapViewComponent extends PureComponent {
  state = {
    userLocation: null
  }

  componentDidMount() {
    Store.dispatch(MapActions.loadPlanningData());
  }

  updateView = (view) => {
    Store.dispatch(MapActions.setView(view));
  }

  handleLocationChange = (userLocation) => {
    this.updateView({ center: userLocation, zoom: config.map.zoomAfterGeocode, animate: true });
  }

  render() {
    const isDesktopView = matchMediaSize(breakpoints.m);
    const displayLegend = !this.props.activeSection || isDesktopView;
    const calculatePopupPosition = isDesktopView && this.props.displayPopup;

    return (
      <MapView>
        <MapWrapper>
          <SearchBar />
          <WebglMap
            key="MapComponent"
            zoom={this.props.zoom}
            center={this.props.center}
            bearing={this.props.bearing}
            pitch={this.props.pitch}
            show3dBuildings={this.props.show3dBuildings}
            dim={this.props.dim}
            activeLayer={this.props.activeLayer}
            activeSection={this.props.activeSection}
            activeView={this.props.activeLayer}
            updateView={this.updateView}
            hasMoved={this.props.hasMoved}
            hbi_values={this.props.hbi_values}
            filterHbi={this.props.filterHbi}
            filterPlannings={this.props.filterPlannings}
            calculatePopupPosition={calculatePopupPosition}
            displayPopup={this.props.displayPopup}
            animate={this.props.animate}
            planningData={this.props.planningData}
          >
            {!this.props.displayPopup && (
              <LocatorControl
                key="Map__LocatorControl"
                onChange={this.handleLocationChange}
                position="bottom-right"
              />
            )}
            <MapControl position="top-right">
              <StyledFMBLogo showBetaIcon width={67} />
            </MapControl>
          </WebglMap>

          {this.props.displayPopup && <MapPopup />}

          <MapContent
            filterHbi={this.props.filterHbi}
            displayLegend={displayLegend}
          />

          <Route
            exact
            path="/zustand/:id/:name?"
            render={() => (
              <SectionDetail
                apiEndpoint="planning-sections"
                onCloseRoute="/zustand"
                activeView={this.props.activeLayer}
              />
            )}
          />
          <Route
            exact
            path="/planungen/:id/:name?"
            render={() => (
              <PlanningDetail
                apiEndpoint="planning-sections"
                onCloseRoute="/planungen"
                activeView={this.props.activeLayer}
              />
            )}
          />
        </MapWrapper>
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
    activeLayer: state.AppState.activeView,
    activeSection: parseInt(state.AppState.activeSection, 0),
    activeLocation: state.MapState.activeLocation,
    filterHbi: state.MapState.filterHbi,
    filterPlannings: state.MapState.filterPlannings,
    hasMoved: state.MapState.hasMoved,
    hbi_speed: state.MapState.hbi_speed,
    hbi_safety: state.MapState.hbi_safety,
    zoom: state.MapState.zoom,
    bearing: state.MapState.bearing,
    pitch: state.MapState.pitch,
    center: state.MapState.center,
    show3dBuildings: state.MapState.show3dBuildings,
    dim: state.MapState.dim,
    animate: state.MapState.animate,
    displayPopup: state.MapState.displayPopup,
    planningData: state.MapState.planningData,
    ...state.UserState
  }))(MapViewComponent)
);