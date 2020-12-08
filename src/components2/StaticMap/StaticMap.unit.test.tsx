import React from 'react';
import mapboxgl from 'mapbox-gl';
import { screen } from '@testing-library/dom';
import { render } from '~/utils/test-utils';
import StaticMap from '.';

const TEST_STYLE_URL = 'mapbox://styles/hejco/ck85ospzd0cre1ioa8d6gfuv9';
const TEST_LOCATION = [13.415669, 52.513219];

describe('<StaticMap />', () => {
  it('renders', () => {
    const { container } = render(
      <StaticMap
        className="testClassName"
        mapboxStyle={TEST_STYLE_URL}
        location={TEST_LOCATION as mapboxgl.LngLatLike}
      />
    );
    expect(mapboxgl.Map).toBeCalled();
    expect(screen.getByLabelText('Interactive WebGL map')).toBeInTheDocument();
    expect(container.getElementsByClassName('testClassName').length).toBe(1);
  });
});