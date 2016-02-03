import isUndefined from 'lodash/lang/isUndefined';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';
import React from 'react';
import warn from '../../utils/warn';
import { connect } from 'reflux';
import langStore from '../../stores/lang';


const allTranslations = {
  'en': {
    'site-name': 'Tanzania Sectoral Performance Dashboards',
    'site.flag': 'Flag of Tanzania',

    'home.header': 'Big Results Now',
    'home.title': 'Open Data Dashboards',
    'home.text.p1': 'These dashboards visualize key performance indicators using data pulled directly from Tanzania\'s Open Portal.',
    'home.text.p2': 'The code for these tools is release under an open source license to encourage others to repurpose it using different data and visialization.',
    'home.text.p3': 'The dashboards are designed for citizens, journalist, and decisionmakers to track the country\'s Big Results Now progress in the education, health, and water sectors.',
    'home.select': 'Choose a Sector:',
    'home.other': 'OR:',
    'home.health': 'Health',
    'home.education': 'Education',
    'home.water': 'Water',
    'home.button.open-data': 'Visit the Open Data Portal',
    'home.button.brn': 'Learn more about BRN',
    'home.button.admin': 'Admin',
    'home.target': 'Target',

    'nav.home': 'Home',
    'nav.data': 'Data',
    'nav.speak-out': 'Speak Out',

    'static.data-title': 'Explore the data behind the dashboard.',
    'static.data-content': 'This Water Dashboard was built on open data release by the government of Tanzania. The raw data is published on the Government\'s open data portal in machine-readable format with a license that encourages re-use. The data behind this education dashboard comes from Ministry of Water and the National Bureau of Statistics of Tanzania.',
    'static.speakout-title': 'Your voice matters!',
    'static.speakout-content': 'Complete this form to share feedback about the data.',

    'lang.en': 'English',
    'lang.sw-tz': 'Kiswahili',

    'dashboard.url': 'Click for the full dashboard',
    'education.title': 'Education',
    'education.metric.title': 'Primary School Pass Rate',
    'health.title': 'Health',
    'health.metric.title': 'Rated Health Care Facilities',
    'water.title': 'Water',
    'waterdash.metric.title': 'Percent Population Coverage',

    'login.login': 'Login',
    'login.logout': 'Logout',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.welcome': 'Welcome',


    'view-mode.points.waterpoints': 'All Waterpoints',
    'view-mode.points.dams': 'All Dams',
    'view-mode.points.boreholes': 'All Boreholes',
    'view-mode.points': i => `All ${i[0]}`,
    'view-mode.region': 'Region',
    'view-mode.district': 'District',
    'view-mode.ward': 'Ward',
    'view-mode.disabled': 'Data not available',

    'overview-bar': 'Overview stuff',

    'footer.copy': 'The source code of this website is published under a under a GPL 3.0 license. Visitors are encouraged to examine and re-use the code as long as they publish it under a similar license.',

    'loading': 'Loading',
    'loading.waterpoints': i => `${i[0]} waterpoints loaded...`,
    'loading.boreholes': i => `${i[0]} boreholes loaded...`,
    'loading.dams': i => `${i[0]} dams loaded...`,
    'loading.regions': 'Loading regions...',
    'loading.districts': 'Loading districts...',
    'loading.wards': 'Loading wards...',
    'loading.points': 'If you see this message, there is likely an error in the application.',

    'admin.title': 'Admin Section',
    'admin.section.general': 'General Properties',
    'ckan.url': 'CKAN Data URL',
    'ckan.base-url': 'Base CKAN Data URL',
    'admin.section.education': 'Education Properties',
    'edudash.homepage.year': 'Education Home target year',
    'edudash.homepage.target': 'Education Home target',
    'edudash.homepage.query': 'Education Home query to data',
    'admin.section.health': 'Health Properties',
    'healthdash.homepage.year': 'Health Home target year',
    'healthdash.homepage.target': 'Health Home target',
    'healthdash.homepage.query': 'Health Home query to data',
    'admin.section.water': 'Water Properties',
    'waterdash.homepage.year': 'Water Home target year',
    'waterdash.homepage.target': 'Water Home target',
    'waterdash.homepage.query': 'Water Home query to data',
    'admin.button': 'Submit',
    'saved.properties.successs': 'All properties saved',

    'error': 'We\'re sorry',
    'error.retry': 'Retry',
    'error.api.pre-request': 'An error occurred when the application was preparing to fetch data',
    'error.api.http': 'A network error occurred while trying to fetch data',
    'error.api.http.not-ok': 'A server error occurred while trying to fetch data',
    'error.api.ckan': 'The CKAN data server encountered an error while trying to fetch data',
    'error.api.ckan.unknown-field-type': i => `The CKAN data server returned data of an unknown type '${i[0]}' for field '${i[1]}'`,
    'error.api.ckan.record-missing-field': i => `A record from the CKAN data server was missing the field '${i[0]}'`,
    'error.api.postprocess': 'An error occurred while the application was processing data',
    'error.api.static.postprocess': 'An error occurred while the application was procesing boundary data',
    'error.not-found.user-not-found': 'User Not Valid',
    'error.ise.database-error': 'Server Error, contact support',
    'error.bad-request.invalid-user-password': 'User or Password invalid',
    'error.bad-request.invalid-parameters': 'Invalid User or Password',
  },
  'sw-tz': {
    'site-name': 'Water Dashboard',
    'site.flag': 'Flag of Tanzania',
    'home.waterpoints': 'Vituo vya maji safi na salama',
    'home.boreholes': 'Visima',
    'home.dams': 'Mabwawa',

    'home.header': 'Big Results Now',
    'home.title': 'Open Data Dashboards',
    'home.text.p1': 'Dashibodi hizi zinaonyesha viashiria muhimu vya utendaji kwa kutumia Takwimu Huria zilizoainishwa na Serikali ya Tanzania; na kutantangazwa kwa tovuti kuu ya Serikali',
    'home.text.p2': 'Programu ya dashibodi hii imechapichwa kwa njia inayosomeka na kompyuta ikitumia leseni inayohamasisha matumizi ili kuionyesha data na mitazamo tofauti.',
    'home.text.p3': 'The dashboards are designed for citizens, journalist, and decisionmakers to track the country\'s Big Results Now progress in the education, health, and water sectors.',
    'home.select': 'Choose a Sector:',
    'home.other': 'OR:',
    'home.health': 'Health',
    'home.education': 'Education',
    'home.water': 'Water',
    'home.button.open-data': 'Visit the Open Data Portal',
    'home.button.brn': 'Learn more about BRN',
    'home.target': 'Target',

    'nav.home': 'Mwanzo',
    'nav.data': 'Data',
    'nav.speak-out': 'Maoni',

    'login.login': 'Ingia',
    'login.logout': 'Ondoka',
    'login.username': 'Jina la mtumiaji',
    'login.password': 'Nywila',
    'login.welcome': 'Karibu',

    'static.data-title': 'Chunguza data ya dashibodi.',
    'static.data-content': 'Dashibodi ya elimu imejengwa juu ya Takwimu Huria zilizoainishwa na Serikali ya Tanzania. Takwimu ghafi zimetangazwa kwa tovuti kuu ya Serikali kwa njia inayosomeka na kompyuta ikitumia leseni inayohamasisha matumizi kwa jumla. Takwimu zimetangazwa na Wizara ya Maji, na Ofisi ya Taifa ya Takwimu.',
    'static.speakout-title': 'Sauti yako ni ya maana!',
    'static.speakout-content': 'Jaza fomu hii utupe maoni yako kuhusu takwimu zilizopo.',

    'lang.en': 'English',
    'lang.sw-tz': 'Kiswahili',

    'dash.waterpoints': 'Vituo vya maji safi na salama',
    'dash.waterpoint': 'Kituo cha maji safi na salama',
    'dash.region': 'Mikoa',
    'dash.district': 'Wilaya',
    'dash.ward': 'Kata',

    'view-mode.points.waterpoints': 'Vituo vyote vya maji',
    'view-mode.points.dams': 'Mabwawa yote',
    'view-mode.points.boreholes': 'Visima vyote',
    'view-mode.points': i => `All ${i[0]}`,
    'view-mode.region': 'Mkoa',
    'view-mode.district': 'Wilaya',
    'view-mode.ward': 'Kata',
    'view-mode.disabled': 'Data haipo',

    'overview-bar': 'Maelezo ya joomla',

    'footer.copy': 'Tovuti hii imechapishwa kwa leseni ya GPL 3.0. Wageni wa tovuti wanahamasishwa kuangalia programu kwa makini na kuitumia kama watachapisha programu zao kwa leseni inayolingana.',

    'loading': 'Loading',
    'loading.waterpoints': i => `${i[0]} waterpoints loaded...`,
    'loading.boreholes': i => `${i[0]} boreholes loaded...`,
    'loading.dams': i => `${i[0]} dams loaded...`,
    'loading.regions': 'Loading regions...',
    'loading.districts': 'Loading districts...',
    'loading.wards': 'Loading wards...',
    'loading.points': 'Ukiona ujumbe huu, kuna kosa limetokea katika tovuti.',

    'error': 'We\'re sorry',
    'error.retry': 'Retry',
    'error.api.pre-request': 'An error occurred when the application was preparing to fetch data',
    'error.api.http': 'A network error occurred while trying to fetch data',
    'error.api.http.not-ok': 'A server error occurred while trying to fetch data',
    'error.api.ckan': 'The CKAN data server encountered an error while trying to fetch data',
    'error.api.ckan.unknown-field-type': i => `The CKAN data server returned data of an unknown type '${i[0]}' for field '${i[1]}'`,
    'error.api.ckan.record-missing-field': i => `A record from the CKAN data server was missing the field '${i[0]}'`,
    'error.api.postprocess': 'An error occurred while the application was processing data',
    'error.api.static.postprocess': 'An error occurred while the application was processing boundary data',
  },
};


/**
 * @param {string} lang The language to translate to like 'en'
 * @param {string} k The key for the translation, like 'site.name'
 * @param {array<any>} i Any values to interpolate into the string
 * @returns {string} the translated string, or the key if it's missing
 */
function translate(lang, k, i) {
  const langTranslations = allTranslations[lang];
  if (isUndefined(langTranslations)) {
    // if the language key is bad, quit early
    warn(`missing language ${lang} to translate ${k}`);
    return k;
  }
  let translated = langTranslations[k];
  if (isUndefined(translated)) {
    warn(`missing translation for key: ${k}`);
    translated = k;
  } else if (isFunction(translated)) {
    if (!isArray(i)) {
      warn(`missing expected array for interpolating ${k}, got: ${i}`);
      translated = translated([]);
    } else {
      translated = translated(i);
    }
  }
  return translated;
}


const T = React.createClass({
  propTypes: {
    i: React.PropTypes.array,
    k: React.PropTypes.string.isRequired,
  },
  mixins: [
    connect(langStore, 'lang'),
  ],
  render() {
    const translated = translate(this.state.lang, this.props.k, this.props.i);
    return (
      <span className="t">{translated}</span>
    );
  },
});

export { translate };
export default T;
