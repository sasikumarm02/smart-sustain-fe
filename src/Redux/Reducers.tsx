import { boolean } from 'yup';
import {
  SCOPE_THREE_COLUMNS,
  SET_ASSESSMENT_COMPLETE,
  SET_ASSESSMENT_TYPE,
  SET_COMPANY,
  SET_COUNTRIES_LIST,
  SET_ENERGY_CONSUMPTION_OPTIONS,
  SET_EXPANDED_ROW_KEYS,
  SET_FACILITY_SELECTED,
  SET_FUGITIVE_OPTIONS,
  SET_MAX_DR,
  SET_MOBILE_OPTIONS,
  SET_MODAL_OPEN,
  SET_NUMBER_OF_QUESTIONS,
  SET_PEER_DATA_EDIT,
  SET_PEER_EDIT_MODE,
  SET_PROCESS_OPTIONS,
  SET_SELECTED_EMISSIONTAB,
  SET_SELECTED_ROW_KEYS,
  SET_STATIONARY_FILTERS,
  SET_STATIONARY_OPTIONS,
  SET_STATIONARY_TAB_DATA,
  UPDATE_SELECTED_ROW_KEYS,
  SET__REPORT_MODAL_OPEN,
  SET_UNREAD_COUNT,
  SET_NOTIFICATIONS_LIST,
  SET_NOTIFICATION_TOGGLE,
  SET_ENTITY_INFO,
  SET_CURRENT_PAGE,
} from './ActionTypes';
import { setPeerEditMode, setProcessOptions } from './Actions';

export const companyReducer = (state = 'Company A', action: any) => {
  switch (action.type) {
    case SET_COMPANY:
      return action.payload;
    default:
      return state;
  }
};

export const assessmentReducer = (state = '', action: any) => {
  switch (action.type) {
    case SET_ASSESSMENT_TYPE:
      return action.payload;
    default:
      return state;
  }
};

export const assessmentLevelReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_ASSESSMENT_COMPLETE:
      return [...state, action.payload];
    default:
      return state;
  }
};

export const numberOfQstnsReducer = (state = '', action: any) => {
  switch (action.type) {
    case SET_NUMBER_OF_QUESTIONS:
      return action.payload;
    default:
      return state;
  }
};

const selectedRowKeysinitialState = {
  selectedRowKeys: [], // Initial state for selected row keys
};
export const selectionReducer = (
  state = selectedRowKeysinitialState,
  action: any
) => {
  switch (action.type) {
    case UPDATE_SELECTED_ROW_KEYS:
      return {
        ...state,
        selectedRowKeys: action.payload, // Update selected row keys with the payload
      };
    default:
      return state;
  }
};

export const selectedRowKeysReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_SELECTED_ROW_KEYS:
      return {
        ...state,
        selectedRowKeys: action.payload, // Update selected row keys with the payload
      };
    default:
      return state;
  }
};

export const emissionTabReducer = (
  state = 'Stationary Combustion',
  action: any
) => {
  switch (action.type) {
    case SET_SELECTED_EMISSIONTAB:
      return action.payload;
    default:
      return state;
  }
};

export const stationaryOptionsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_STATIONARY_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const mobileOptionsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_MOBILE_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const processOptionsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_PROCESS_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const fugitiveOptionsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_FUGITIVE_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const energyConsumptionReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_ENERGY_CONSUMPTION_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};

export const stationaryFiltersReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_STATIONARY_FILTERS:
      return action.payload;
    default:
      return state;
  }
};

export const emissionTabDataReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_STATIONARY_TAB_DATA:
      return action.payload;
    default:
      return state;
  }
};

export const scopeThreeColumnsReducer = (state = [], action: any) => {
  switch (action.type) {
    case SCOPE_THREE_COLUMNS:
      return action.payload;
    default:
      return state;
  }
};
export const countriesListReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_COUNTRIES_LIST:
      return action.payload;
    default:
      return state;
  }
};
export const facilitySelectedReducer = (state = '', action: any) => {
  switch (action.type) {
    case SET_FACILITY_SELECTED:
      return action.payload;
    default:
      return state;
  }
};
export const expandedRowkeysReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_EXPANDED_ROW_KEYS:
      return action.payload;
    default:
      return state;
  }
};

export const peerEditModeReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_PEER_EDIT_MODE:
      return action.payload;
    default:
      return state;
  }
};

export const peerEditDataReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_PEER_DATA_EDIT:
      return action.payload;
    default:
      return state;
  }
};

export const MaturityAssessmentReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_MODAL_OPEN:
      return action.payload;
    default:
      return state;
  }
};

export const ReportComplianceReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET__REPORT_MODAL_OPEN:
      return action.payload;
    default:
      return state;
  }
};

export const maxDrReducer = (state = '', action: any) => {
  switch (action.type) {
    case SET_MAX_DR:
      return action.payload;
    default:
      return state;
  }
};

export const unreadCountReducer = (state = 0, action: any) => {
  switch (action.type) {
    case SET_UNREAD_COUNT:
      return action.payload;
    default:
      return state;
  }
};

export const notificationListReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_NOTIFICATIONS_LIST:
      return action.payload;
    default:
      return state;
  }
};

export const notificationToggleReducer = (state = false, action: any) => {
  switch (action.type) {
    case SET_NOTIFICATION_TOGGLE:
      return action.payload;
    default:
      return state;
  }
};

export const entityInfoReducer = (state = [], action: any) => {
  switch (action.type) {
    case SET_ENTITY_INFO:
      return action.payload;
    default:
      return state;
  }
};

export const currentPageReducer = (state = 1, action: any) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return action.payload;
    default:
      return state;
  }
};
