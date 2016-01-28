/* eslint camelcase: 0 */  // snake_case query params are not set by us

import ckan from './utils/api/ckan';
import securityApi from './utils/api/security-api';

const SECURITY_API_ROOT = '//localhost:8080/';

export const getHealthFacilities = (url, healthFacilitiesQ, onProgress) =>
  ckan.get(url, healthFacilitiesQ, onProgress);

export const getEducation = (url, educationQ, onProgress) =>
  ckan.get(url, educationQ, onProgress);

export const getWaterStats = (url, waterQ, onProgress) =>
  ckan.get(url, waterQ, onProgress);

export const login = (username, password) =>
  securityApi.post(SECURITY_API_ROOT, 'security', {u: username, p: password});

export const getProperty = (propertyName) =>
  securityApi.get(SECURITY_API_ROOT, 'property', {p: propertyName});

export const postProperties = (user, properties) =>
  securityApi.post(SECURITY_API_ROOT, 'properties', {userId: user._id, properties: properties});
