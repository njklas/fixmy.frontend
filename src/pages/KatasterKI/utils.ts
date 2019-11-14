import uuidv4 from 'uuid/v4';

import {
  Perspective,
  TransportMode,
  TransportRating,
  UserGroup
} from './types';

const userGroups: Array<
  UserGroupAssociation
> = require('./config/userGroups.json');

interface TransportRatings {
  [mode: string]: TransportRating;
}

type UserGroupAssociation = TransportRating & {
  userGroup: UserGroup;
};

/**
 * Determine a usergroup given ratings given for different transport modes by
 * the user
 *
 * @param transportRatings rating values for each TransportMode
 */
export const getUserGroup = (transportRatings: TransportRatings): UserGroup => {
  const match = userGroups.find((ug: UserGroupAssociation) =>
    Object.keys(transportRatings).every(
      (mode) => ug[mode] === transportRatings[mode]
    )
  );
  if (match == null) {
    if (config.debug)
      console.warn('No usergroup match for transportRatings', transportRatings);
    return UserGroup.bicycle;
  } else {
    return match.userGroup;
  }
};

const userGroupToPerspective = {
  [UserGroup.bicycle]: Perspective.bicycle,
  [UserGroup.potentialBicycle]: Perspective.bicycle,
  [UserGroup.car]: Perspective.car,
  [UserGroup.pedestrian]: Perspective.pedestrian
};

/**
 * Determine the initial perspetive for users in a given usergroup
 *
 * @param userGroup userGroup as determined by getUserGroup
 */
export const getInitialPerspective = (userGroup: UserGroup): Perspective =>
  userGroupToPerspective[userGroup];

/**
 * Build an endpoint URL given an endpoint configured in the global config
 *
 * @param endpoint name of the endpoint from config.katasterKI.api
 */
export const getEndpointURL = (endpoint: string): string =>
  `${config.apiUrl}/${config.katasterKI.api[endpoint]}`;

/**
 * Return a unique user uid that allows identifying a user when interfacing
 * with the server
 */
export const makeSessionID = () => uuidv4();

/**
 * Toggle a warning that is displayed when users try and navigate away
 *
 * @param isEnabled set to true to enable showing a warning
 */
export const toggleNavigationWarning = (isEnabled: boolean) => {
  if (isEnabled) {
    window.onbeforeunload = () =>
      'Die Umfrage wird abgebrochen, wenn Sie die Seite verlassen.';
  } else {
    window.onbeforeunload = null;
  }
};
