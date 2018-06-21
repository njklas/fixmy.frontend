import React from 'react';
import styled from 'styled-components';
import Store from '~/redux/store';
import * as MapActions from '~/modules/MapView/MapState';

const ResetMapButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${config.colors.white};
  border-radius: 50%;
  border: 1px solid ${config.colors.darkgrey};
  cursor: pointer;
  font-size: 24px;
  color: ${config.colors.darkgrey};
`;

function handleClick() {
  Store.dispatch(MapActions.setSectionActive(null));
}

export default props => (
  <ResetMapButton {...props} onClick={handleClick}>
    ×
  </ResetMapButton>
);
