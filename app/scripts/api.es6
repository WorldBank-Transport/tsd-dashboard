/* eslint camelcase: 0 */  // snake_case query params are not set by us

import ckan from './utils/api/ckan';
import securityApi from './utils/api/security-api';

const API_ROOT = '//data.takwimu.org/api/action/datastore_search_sql?sql=';
const SECURITY_API_ROOT = '//localhost:8080/';


export const getHealthFacilities = (url, healthFacilitiesQ, onProgress) =>
  ckan.get(url, healthFacilitiesQ, onProgress);

const educationQ = 'SELECT AVG("PASS_RATE"), "YEAR_OF_RESULT" FROM "aba0d668-5693-4979-83fc-f58df99f7873" GROUP BY "YEAR_OF_RESULT" ORDER BY "YEAR_OF_RESULT" DESC LIMIT 1';

export const getEducation = (url, educationQ, onProgress) =>
  ckan.get(url, educationQ, onProgress);

const waterQ = 'SELECT SUM("POPULATION_NUMBER_PER_URBAN_WATER_UTILTY") as POPULATION, SUM("POPULATION_SERVED_WITH_WATER") AS SERVED from "e99544de-ee22-4820-92d7-1aa214682bde"';

export const getWaterStats = (url, waterQ, onProgress) =>
  ckan.get(url, waterQ, onProgress);

export const login = (username, password) =>
  securityApi.post(SECURITY_API_ROOT, 'security', {u: username, p: password});

export const getProperty = (propertyName) =>
  securityApi.get(SECURITY_API_ROOT, 'property', {p: propertyName});
