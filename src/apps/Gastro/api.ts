import ky from 'ky-universal';
import { generatePath } from 'react-router-dom';
import debug from 'debug';

import { GastroSignup, GastroRegistration } from './types';
import config from './config';
import { DistrictConfig } from '~/types';

const URL_GET_SIGNUP = `/gastro/:campaign/:id/:accessKey?`;
const URL_POST_SIGNUP = `/gastro/:campaign`;
const URL_PUT_SIGNUP = `/gastro/:campaign/:id/:accessKey`;
const URL_PUT_CERTIFICATE = `/gastro/:campaign/certificate/:id/:accessKey`;
const URL_POST_CERTIFICATE = `/gastro/:campaign/certificate/direct/:fileName`;
const URL_RENEWAL = '/gastro/:campaign/renewal/:id/:accessKey';

const logger = debug('fmc:Gastro:api');

const getApiBase = (district: DistrictConfig) => {
  if (district?.backend == null) {
    return config.apiUrl;
  }

  return (
    process.env.API_URL ||
    district.backend[process.env.BACKEND] ||
    district.backend.production
  );
};

/**
 * Request previously submitted data
 *
 * @param id of the signup
 * @param accessKey that registrants received via email
 */
const get = async (
  id: number,
  accessKey: string,
  district: DistrictConfig
): Promise<GastroRegistration> => {
  const url = `${getApiBase(district)}${generatePath(URL_GET_SIGNUP, {
    id,
    accessKey,
    campaign: district.apps.gastro.currentCampaign,
  })}`;
  logger('api get', url);
  return ky.get(url).json();
};

/**
 * Submit Interessensbekundung
 */
const signup = async (
  signupData: GastroSignup,
  district: DistrictConfig
): Promise<GastroRegistration> => {
  const endpoint = `${getApiBase(district)}${generatePath(URL_POST_SIGNUP, {
    campaign: district.apps.gastro.currentCampaign,
  })}`;
  logger('api signup', endpoint);
  return ky.post(endpoint, { json: signupData }).json();
};

/**
 * Submit formaler Antrag
 */
const register = async (
  signupData: GastroRegistration,
  district: DistrictConfig
) => {
  const endpoint = `${getApiBase(district)}${generatePath(URL_PUT_SIGNUP, {
    id: signupData.id,
    accessKey: signupData.access_key,
    campaign: district.apps.gastro.currentCampaign,
  })}`;
  logger('api register', endpoint);
  return ky.put(endpoint, { json: signupData }).json();
};

/**
 * Submit formaler Antrag without two-step signup
 */
const registerDirect = async (
  signupData: GastroRegistration,
  district: DistrictConfig
) => {
  const endpoint = `${getApiBase(district)}${generatePath(URL_POST_SIGNUP, {
    campaign: district.apps.gastro.currentCampaign,
  })}`;
  logger('api register direct', endpoint);
  return ky.post(endpoint, { json: signupData }).json();
};

/**
 * Upload certificate file for registration
 */
const uploadCertificate = async (
  registrationData: GastroRegistration,
  district: DistrictConfig
) => {
  const formData = new FormData();
  const fileName = registrationData.certificate.name;

  formData.append('file', registrationData.certificate, fileName);

  let endpoint;
  let method;
  if (registrationData.id) {
    method = 'PUT';
    endpoint = `${getApiBase(district)}${generatePath(URL_PUT_CERTIFICATE, {
      id: registrationData.id,
      accessKey: registrationData.access_key,
      campaign: district.name,
    })}`;
  } else {
    method = 'POST';
    endpoint = `${getApiBase(district)}${generatePath(URL_POST_CERTIFICATE, {
      fileName,
      campaign: district.name,
    })}`;
  }

  logger('api uploadCertificate', endpoint);

  return ky(endpoint, {
    method,
    body: formData,
    headers: {
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
    timeout: 60000,
  }).json();
};

/**
 * Get information about previous application in order to make a renewal
 *
 * @param id of the previous application
 * @param accessKey renewal access key of the previous application
 * @param district current district configuration
 */
const getRenewal = async (
  id: string,
  accessKey: string,
  district: DistrictConfig
): Promise<GastroRegistration> => {
  const endpoint = `${getApiBase(district)}${generatePath(URL_RENEWAL, {
    id,
    accessKey,
    campaign: district.apps.gastro.currentCampaign,
  })}`;
  logger('api get renewal info', endpoint);
  return ky.get(endpoint).json();
};

/**
 * Submit renewal request
 *
 * @param id of the previous application
 * @param accessKey renewal access key of the previous application
 * @param district current district configuration
 */
const postRenewal = async (
  id: string,
  accessKey: string,
  district: DistrictConfig
): Promise<GastroRegistration> => {
  const endpoint = `${getApiBase(district)}${generatePath(URL_RENEWAL, {
    id,
    accessKey,
    campaign: district.apps.gastro.currentCampaign,
  })}`;
  logger('api post renewal request', endpoint);
  return ky.post(endpoint).json();
};

export default {
  get,
  signup,
  register,
  registerDirect,
  uploadCertificate,
  getRenewal,
  postRenewal,
};
