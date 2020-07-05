import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { waitFor } from '@testing-library/dom';
import AutocompleteGeocoder from '~/components/AutocompleteGeocoder';
import * as apiService from '~/components/AutocompleteGeocoder/apiService';
import mockedSuggestions from '~/../jest/mocks/mockLocationSuggestions.json';
import { parseSuggestion } from '~/components/AutocompleteGeocoder/apiService';

describe('<AutoCompleteGeocoder />', () => {
  // use setup method described as best practice in
  // https://medium.com/@noahpeden/react-testing-library-rtl-set-up-and-best-practices-96dcf3be54
  const setup = () => {
    const props = {
      onLocationPick: jest.fn(),
      onError: jest.fn(),
      onInputFocus: jest.fn(),
      onSearchStart: jest.fn(),
      onInputBlur: jest.fn(),
      searchStringMinLength: 4,
      debounceTime: 500
    };
    const { container, baseElement, debug } = render(
      <AutocompleteGeocoder {...props} />
    );

    const inputElement = container.querySelector('input');

    return {
      initProps: props,
      debug,
      container,
      baseElement,
      inputElement
    };
  };

  describe('basic event listeners', () => {
    it('invokes callbacks when being focused / blurred', () => {
      const { initProps, inputElement } = setup();
      expect(initProps.onInputFocus).toHaveBeenCalledTimes(0);
      expect(initProps.onInputBlur).toHaveBeenCalledTimes(0);
      // focus input

      act(() => inputElement.focus()); // await DOM processing, see https://github.com/testing-library/react-testing-library/issues/276#issuecomment-473392827
      expect(initProps.onInputFocus).toHaveBeenCalledTimes(1);

      // loose focus on input
      fireEvent.blur(inputElement);

      expect(initProps.onInputBlur).toHaveBeenCalledTimes(1);
    });
    it('invokes the onSearchStart handler once the first search string has been entered', async () => {
      const { initProps, inputElement } = setup();
      // simulate that user is typing fast
      await userEvent.type(inputElement, '1');
      await userEvent.type(inputElement, '2');

      expect(initProps.onSearchStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetching and picking suggestions', () => {
    const SEARCH_STRING = 'Hauptstraße'; // also used in the api response mock
    const waitForElementOptions = { timeout: 15000 };
    const selectorMatchOptions = { exact: false };
    const findAllBySearchString = async () =>
      screen.findAllByText(
        SEARCH_STRING,
        selectorMatchOptions,
        waitForElementOptions
      );

    it('renders the list of suggestions', async () => {
      const { inputElement } = setup();
      // simulate that the user initially types a search string
      userEvent.type(inputElement, SEARCH_STRING);
      const suggestionList = await screen.findByTestId(
        'autocomplete-geocoder-suggestion-list',
        {},
        { timeout: 15000 } // FIXME: find out why the timeout is needed → msw should resolve immediately
      );
      expect(suggestionList).toBeDefined();
    });
    it('suggests three addresses for a given search string', async () => {
      const { inputElement } = setup();
      userEvent.type(inputElement, SEARCH_STRING);

      const suggestionItems = await findAllBySearchString();

      expect(suggestionItems).toHaveLength(3);
    });
    it('invokes the onLocationPick handler with coords and address when the user clicks/taps on a suggestion', async () => {
      const [mockedFirstSuggestion] = mockedSuggestions.features;
      // eslint-disable-next-line camelcase
      const { place_name_de, center } = mockedFirstSuggestion;
      const { address, coords } = parseSuggestion({ place_name_de, center });

      const { inputElement, initProps } = setup();
      userEvent.type(inputElement, SEARCH_STRING);
      const [firstSuggestion] = await findAllBySearchString();
      fireEvent.click(firstSuggestion);

      expect(initProps.onLocationPick).toHaveBeenCalledWith({
        coords,
        address
      });
    });
    it('buffers api calls (waits for the user to type, then fetches suggestions)', async () => {
      const fetchSuggestionsSpy = jest.spyOn(apiService, 'fetchSuggestions');
      const { inputElement, initProps } = setup();

      /* simulate fast user input with not delay in between strokes */
      await userEvent.type(inputElement, 'abcd');
      // wait for async logic to kick in,
      // only a single a request should be fired once the user is done typing
      await waitFor(() => expect(fetchSuggestionsSpy)
        .toHaveBeenCalledTimes(1));

      fetchSuggestionsSpy.mockClear();

      /* simulate slow user input */

      const slowInput = 'defg';
      await userEvent.type(inputElement, slowInput, {
        delay: initProps.debounceTime + 10
      });

      // each stroke should have triggered a request
      await waitFor(() => expect(fetchSuggestionsSpy)
        .toHaveBeenCalledTimes(slowInput.length));

      fetchSuggestionsSpy.mockClear();
    });
    it('invokes the onLocationPick handler with the first search result' +
        ' when the user presses enter', () => {
      const { inputElement, initProps } = setup();
      userEvent.type(inputElement, SEARCH_STRING);

      expect(initProps.onLocationPick).toHaveBeenCalledWith();
    });
  });
});
