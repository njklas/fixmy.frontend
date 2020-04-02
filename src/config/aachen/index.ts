import map from './map';
import menu from './menu';
import routes from './routes';
import staticpages from './staticpages';

import defaultColors from '~/config/default/colors';

const apiEndpoints = {
  local: 'http://localhost:8000/api',
  staging: 'https://fixmyaachen-staging.netlify.com/api/aachen/next',
  production: 'https://fixmyaachen.netlify.com/api/aachen/v1'
};

export default {
  map,
  menu,
  routes,
  staticpages,
  siteTitle: 'Radbügel für Aachen',
  feedbackMail: 'radbuegel@aachen.de',
  apiUrl:
    process.env.API_URL ||
    apiEndpoints[process.env.BACKEND] ||
    apiEndpoints.staging,
  colors: {
    ...defaultColors,
    likebg: 'initial',
    interaction: '#6E9BD2'
  },
  titleFont: 'The Mix',
  baseFont: 'Arial',
  flatButtons: true
};