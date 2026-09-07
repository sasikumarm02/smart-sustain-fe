import {
  SET_COMPANY,
  SET_ASSESSMENT_TYPE,
  SET_ASSESSMENT_COMPLETE,
  SET_NUMBER_OF_QUESTIONS,
  SET_CLICKED_CARDS,
  UPDATE_SELECTED_ROW_KEYS,
  SET_SELECTED_ROW_KEYS,
  SET_SELECTED_EMISSIONTAB,
  SET_STATIONARY_OPTIONS,
  SET_MOBILE_OPTIONS,
  SET_PROCESS_OPTIONS,
  SET_FUGITIVE_OPTIONS,
  SET_ENERGY_CONSUMPTION_OPTIONS,
  SET_STATIONARY_FILTERS,
  SET_STATIONARY_TAB_DATA,
  SCOPE_THREE_COLUMNS,
  SET_COUNTRIES_LIST,
  SET_FACILITY_SELECTED,
  SET_EXPANDED_ROW_KEYS,
  SET_PEER_EDIT_MODE,
  SET_PEER_DATA_EDIT,
  SET_MODAL_OPEN,
  SET__REPORT_MODAL_OPEN,
  SET_MAX_DR,
  SET_UNREAD_COUNT,
  SET_NOTIFICATIONS_LIST,
  SET_NOTIFICATION_TOGGLE,
  SET_ENTITY_INFO,
  SET_CURRENT_PAGE,
  SET_PREV_ACTIVE_TAB,
} from './ActionTypes';

export const setCompany = (companyList: any) => {
  return {
    type: SET_COMPANY,
    payload: companyList,
  };
};
export const setAssessmentType = (name: any) => {
  return {
    type: SET_ASSESSMENT_TYPE,
    payload: name,
  };
};
export const setPeerEditMode = (name: any) => {
  return {
    type: SET_PEER_EDIT_MODE,
    payload: name,
  };
};

export const setPeerDataEdit = (name: any) => {
  return {
    type: SET_PEER_DATA_EDIT,
    payload: name,
  };
};

export const setAssessmentComplete = (arr: any) => {
  return {
    type: SET_ASSESSMENT_COMPLETE,
    payload: arr,
  };
};
export const setNumberOfQuestions = (num: any) => {
  return {
    type: SET_NUMBER_OF_QUESTIONS,
    payload: num,
  };
};

export const updateSelectedRowKeys = (selectedRowKeys: any) => ({
  type: UPDATE_SELECTED_ROW_KEYS,
  payload: selectedRowKeys,
});

export const setSelectedRowKeys = (selectedRowKeys: any) => ({
  type: SET_SELECTED_ROW_KEYS,
  payload: selectedRowKeys,
});

export const setSelectedEmissionTab = (tab: any) => ({
  type: SET_SELECTED_EMISSIONTAB,
  payload: tab,
});

export const setStationaryOptions = (obj: any) => ({
  type: SET_STATIONARY_OPTIONS,
  payload: obj,
});
export const setMobileOptions = (obj: any) => ({
  type: SET_MOBILE_OPTIONS,
  payload: obj,
});
export const setProcessOptions = (obj: any) => ({
  type: SET_PROCESS_OPTIONS,
  payload: obj,
});
export const setFugitiveOptions = (obj: any) => ({
  type: SET_FUGITIVE_OPTIONS,
  payload: obj,
});
export const setEnergyConsumptionOptions = (obj: any) => ({
  type: SET_ENERGY_CONSUMPTION_OPTIONS,
  payload: obj,
});

export const setStationaryFilters = (arr: any) => ({
  type: SET_STATIONARY_FILTERS,
  payload: arr,
});

export const setStationaryTabData = (arr: any) => ({
  type: SET_STATIONARY_TAB_DATA,
  payload: arr,
});

export const setScopeThreeColumns = (arr: any) => ({
  type: SCOPE_THREE_COLUMNS,
  payload: arr,
});

export const setCountries = (arr: any) => ({
  type: SET_COUNTRIES_LIST,
  payload: arr,
});

export const setFacilitySelected = (str: any) => ({
  type: SET_FACILITY_SELECTED,
  payload: str,
});
export const setExpandedKeys = (arr: any) => ({
  type: SET_EXPANDED_ROW_KEYS,
  payload: arr,
});
export const setModal = (str: any) => ({
  type: SET_MODAL_OPEN,
  payload: str,
});

export const setReportModal = (str: any) => ({
  type: SET__REPORT_MODAL_OPEN,
  payload: str,
});

export const setMaxDR = (str: any) => ({
  type: SET_MAX_DR,
  payload: str,
});

export const setUnreadCount = (count: any) => ({
  type: SET_UNREAD_COUNT,
  payload: count,
});

export const setNotificationsList = (list: any) => ({
  type: SET_NOTIFICATIONS_LIST,
  payload: list,
});

export const setNotificationToggle = (bool: any) => ({
  type: SET_NOTIFICATION_TOGGLE,
  payload: bool,
});

export const setEntityInfo = (arr: any) => ({
  type: SET_ENTITY_INFO,
  payload: arr,
});

export const setCurrentPage = (num: any) => ({
  type: SET_CURRENT_PAGE,
  payload: num,
});

export const setPrevActiveTab = (str: any) => ({
  type: SET_PREV_ACTIVE_TAB,
  payload: str,
});
