interface RouteConfig {
  // optional routes
  projects?: string;
  status?: string;
  analysis?: string;
  reports?: {
    [page: string]: string;
  };
  katasterKI?: {
    [page: string]: string;
  };
  spielstrassen?: {
    [page: string]: string;
  };
  popupbikelanes?: string;
  research?: {
    [page: string]: string;
  };
  // mandatory routes
  signup: string;
  login: string;
  forgotPassword: string;
  resetPassword: string;
  emailVerification: string;
  profile: string;
  userVerify: string;
}

const routes: RouteConfig = {
  projects: '/planungen',
  status: '/zustand',
  analysis: '/analyse',
  reports: {
    temporarily_forward_from_this_to_index: '/meldungen',
    index: '/meldungen/radbuegel/friedrichshain-kreuzberg',
    landing: '/meldungen/radbuegel/friedrichshain-kreuzberg/landing',
    map: '/meldungen/radbuegel/friedrichshain-kreuzberg/karte',
    new: '/meldungen/radbuegel/friedrichshain-kreuzberg/neu',
  },
  katasterKI: {
    landing: '/strassencheck',
    landingNational: `/strassencheck/de`,
    profileBase: `/strassencheck/profil`,
    profile: `/strassencheck/profil/:page`,
    scenesBase: `/strassencheck/szenen`,
    scenes: `/strassencheck/szenen/:page`,
    share: `/strassencheck/teilen`,
    feedback: `/strassencheck/auswertung`,
    email: `/strassencheck/email`,
  },
  spielstrassen: {
    landing: '/friedrichshain-kreuzberg/spielstrassen',
    streets: '/friedrichshain-kreuzberg/spielstrassen/kieze',
    register: '/friedrichshain-kreuzberg/spielstrassen/:slug',
    thanks: '/friedrichshain-kreuzberg/spielstrassen/:slug/danke',
  },
  popupbikelanes: '/popupbikelanes',
  signup: '/registrieren',
  login: '/anmelden',
  forgotPassword: '/passwort-vergessen',
  resetPassword: '/reset',
  emailVerification: '/email-verification',
  profile: '/profil',
  userVerify: '/bestaetigen',
  research: {
    landing: '/research',
    survey: '/research/subjektive-sicherheit',
  },
};

export default routes;
