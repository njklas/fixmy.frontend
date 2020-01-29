import debug from 'debug';
import config from '~/config';

// Setup namespaces to log when in development environment
if (process.env.CONFIG_ENV !== 'production') localStorage.debug = config.logger;

const logger = debug('fmc');

export default logger;