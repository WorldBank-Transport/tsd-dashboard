/* eslint camelcase: 0 */  // snake_case query params are not set by us

import ckan from './utils/api/ckan';
import * as staticData from './utils/api/static-data';

const API_ROOT = '//data.takwimu.org/api/action/datastore_search_sql?sql=';


/**
 * @param {object} record The waterpoint database record
 * @returns {object} The record with a `position` prop with lat/lng array
 */
function pullLatLng(record) {
  /*
  The following slow implementation burns >400ms CPU time for me

    const pulled = omit(record, 'LATITUDE', 'LONGITUDE');
    pulled.position = [record.LATITUDE, record.LONGITUDE];
    return pulled;

  So here's a faster version (48ms):
  */
  const pulled = {};
  for (const k in record) {
    if (record.hasOwnProperty(k) && k !== 'LATITUDE' && k !== 'LONGITUDE') {
      pulled[k] = record[k];
    }
  }
  pulled.position = [record.LATITUDE, record.LONGITUDE];
  return pulled;
}
/**
 * add a POINT_ID and parse the geolocation for a health Facilities
 * @param {object} record The facility database record
 * @returns {object} The record with a `position` prop with lat/lng array
 */
function healthFacProcess(record) {
  const pulled = pullLatLng(record);
  pulled.POINT_ID = pulled.FACILITY_ID_NUMBER;
  return pulled;
}
/**
 * add a POINT_ID and parse the geolocation for a dams
 * @param {object} record The dam database record
 * @returns {object} The record with a `position` prop with lat/lng array
 */
function damProcess(record) {
  const pulled = pullLatLng(record);
  pulled.POINT_ID = pulled.DAM_NAME;
  return pulled;
}

/**
 * @param {object} record The population database record
 * @returns {object} The record with a `position` prop with lat/lng array
 */
function toUppercase(record) {
  const pulled = {};
  for (const k in record) {
    if (record.hasOwnProperty(k)) {
      pulled[k] = (typeof record[k] === 'string') ? record[k].toUpperCase() : record[k];
    }
  }
  return pulled;
}


const eachRecord = fn => data => data.map(fn);


const healthFacilitiesQ = 'SELECT COUNT(*) from "b3ef3486-34fd-4389-bc61-af4520df1858"';

export const getHealthFacilities = (onProgress) =>
  ckan.get(API_ROOT, healthFacilitiesQ, onProgress);


const educationQ = 'SELECT AVG("PASS_RATE"), "YEAR_OF_RESULT" FROM "aba0d668-5693-4979-83fc-f58df99f7873" GROUP BY "YEAR_OF_RESULT" ORDER BY "YEAR_OF_RESULT" DESC LIMIT 1';

export const getEducation = (onProgress) =>
  ckan.get(API_ROOT, educationQ, onProgress);

const waterQ = 'SELECT SUM("POPULATION_NUMBER_PER_URBAN_WATER_UTILTY") as POPULATION, SUM("POPULATION_SERVED_WITH_WATER") AS SERVED from "e99544de-ee22-4820-92d7-1aa214682bde"';

export const getWaterStats = (onProgress) =>
  ckan.get(API_ROOT, waterQ, onProgress);
