import React from 'react';
import styled from 'styled-components';
import PropagateLoader from 'react-spinners/PropagateLoader';
import logger from '~/utils/logger';
import config from '~/config';

const LoaderWrapper = styled.div`
  width: 100%;
  margin: 15px auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = ({ pastDelay, error, color }) => {
  if (error) {
    logger('Error loading page', error);
    return (
      <p>
        <span role="img" aria-label="sick face emoji">
          🤕
        </span>{' '}
        Ups, da ist etwas schiefgegangen: {error}
      </p>
    );
  }
  if (pastDelay)
    return (
      <LoaderWrapper>
        <PropagateLoader
          color={`${color == null ? config.colors.interaction : color}`}
        />
      </LoaderWrapper>
    );
  return null;
};

export default Loader;
