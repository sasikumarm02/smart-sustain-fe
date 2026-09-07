import Filtration from '../../../assets/Svg/Dashboard/Filtration';
import Neutralization from '../../../assets/Svg/Dashboard/Neutralization';
import Disinfection from '../../../assets/Svg/Dashboard/Disinfection';
import Coagulation from '../../../assets/Svg/Dashboard/Coagulation';
import TricklingFilters from '../../../assets/Svg/TreatmentIcons/TricklingFilters';
import Sedimentation from '../../../assets/Svg/TreatmentIcons/Sedimentation';
import Screening from '../../../assets/Svg/TreatmentIcons/Screening';
import SandFiltration from '../../../assets/Svg/TreatmentIcons/SandFiltration';
import ReverseOsmosis from '../../../assets/Svg/TreatmentIcons/ReverseOsmosis';
import RemovalofCOD from '../../../assets/Svg/TreatmentIcons/RemovalofCOD';
import RemovalofBOD from '../../../assets/Svg/TreatmentIcons/RemovalofBOD';
import MembraneFiltration from '../../../assets/Svg/TreatmentIcons/MembraneFiltration';
import Floatation from '../../../assets/Svg/TreatmentIcons/Floatation';
import ConstructedWetlands from '../../../assets/Svg/TreatmentIcons/ConstructedWetlands';
import CoagulationandFlocculation from '../../../assets/Svg/TreatmentIcons/CoagulationandFlocculation';
import Chlorination from '../../../assets/Svg/TreatmentIcons/Chlorination';
import AnaerobicDigestion from '../../../assets/Svg/TreatmentIcons/AnaerobicDigestion';
import ActivatedSludgeProcess from '../../../assets/Svg/TreatmentIcons/ActivatedSludgeProcess';
import ActivatedCarbonAdsorption from '../../../assets/Svg/TreatmentIcons/ActivatedCarbonAdsorption';

export const excludedDataIndices = [
  'status',
  'material',
  'kg_CO2e_per_unit',
  'emissions_kg_co2e',
  'emissions_t_co2e',
  'emission_factor_database',
  'naics_code_title',
  'total_waste_produced',
  'emission_factor_name',
];

export const excludedDataIndicesCatthirteen = [
  'kg_CO2e_per_unit',
  'emissions_kg_co2e',
  'emissions_t_co2e',
  'emission_factor_database',
  'emission_factor_name',
  'total_emission',
  'total_emission_kgco2e',
  'total_emission_tco2e',
];

export const excludedDataIndicesCatthirteenForm = [
  'status',
  'kg_CO2e_per_unit',
  'emissions_kg_co2e',
  'emissions_t_co2e',
  'emission_factor_database',
  'emission_factor_name',
  'total_emission',
  'total_downstream_lessed_asset_tco2e',
  'total_downstream_lessed_asset_kgco2e',
  'total_emission_kgco2e',
  'total_emission_tco2e',
];

const excludeFilters = [
  'quantity',
  'disclosure',
  'kg_CO2e_per_unit',
  'emissions_kg_co2e',
  'emissions_t_co2e',
  'file_name',
  'amount',
  'energy_purchased',
  't_and_d_loss_rate',
  'electricity_purchased',
  'fuel_consumed',
  'waste_produced',
  'invoice_no',
];
export function capitalizeWords(sentence: any) {
  if (typeof sentence !== 'string') {
    return '';
  }

  let words = sentence.split(' ');

  for (let i = 0; i < words.length; i++) {
    if (words[i].trim() !== '') {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  }

  let capitalizedSentence = words.join(' ');

  return capitalizedSentence;
}

export function generateFiltersAndOnFilter(
  column: any,
  tableData: any,
  filteredInfo: any
) {
  if (excludeFilters.includes(column.dataIndex)) {
    return { filters: null, onFilter: null };
  }

  const uniqueValues = tableData
    ?.map((entry: any) => entry[column.dataIndex])
    .filter((value: any) => value)
    ?.filter(
      (value: any, index: any, self: any) => self.indexOf(value) === index
    );

  const filters = uniqueValues?.map((filterValue: any) => ({
    text: filterValue,
    value: filterValue,
  }));
  const filteredValue = filteredInfo[column.dataIndex] || null;
  const onFilter = (value: any, record: any) =>
    record[column.dataIndex] === value;
  return { filters, onFilter, filteredValue };
}

export const customFormattColumns = [
  'kg_CO2_emission_per_unit',
  'total_emission_emmited_by_fuel',
  'total_emission_emmited_by_fuel_in_tonnes',
  'amount',
  'quantity',
  'kg_CO2e_per_unit',
  'emissions_kg_co2e',
  'emissions_t_co2e',
  'fuel_consumed',
  'allocated_scope1_emission',
  'allocated_scope2_emission',
  'waste_produced',
  'no_of_independent_directors',
  'board_committees',
  'no_of_management_team_male',
  'no_of_management_team_female',
  'no_of_board_of_director_male',
  'no_of_board_of_director_female',
  'no_of_incidents',
  'no_of_emp_fatalities',
  'no_of_contractor_fatalities',
  'no_of_high_consequence_injuries',
  'no_of_recordable_injuries',
  'no_of_lost_time_injuries',
  'no_of_lost_workdays',
  'tenure',
  'total_waste',
  'asset_area',
  'no_of_assets',
  'male',
  'female',
  'age_lt_30',
  'age_30_to_50',
  'age_gt_50',
  'total_emission',
  'qty',
];

export const toNumberFormatColumns = [
  'quantity',
  'proportion',
  'amount',
  'allocated_scope2_emission',
  'allocated_scope1_emission',
  'no_of_rooms',
  'no_of_nights',
];

export function insertColumn(
  columns: any,
  columnToInsert: any,
  beforeKeys: any
) {
  let inserted = false;
  for (let i = 0; i < beforeKeys.length; i++) {
    const beforeKey = beforeKeys[i];
    const index = columns.findIndex((column: any) => column.key === beforeKey);
    if (index !== -1) {
      columns.splice(index, 0, columnToInsert);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    columns.push(columnToInsert);
  }

  return columns;
}

export function insertColumnBeforeColumn(
  columns: any,
  columnToInsert: any,
  beforeKey: any
) {
  const index = columns.findIndex((column: any) => column.key === beforeKey);
  if (index !== -1) {
    columns.splice(index, 0, columnToInsert);
  } else {
    columns.push(columnToInsert);
  }
  return columns;
}

export const specialCharacters = ['', ',', '/', '-', '_', '@'];

export function blockSpecialChar(e: any) {
  var input = e.target;
  var cursorPosition = input.selectionStart;
  if (cursorPosition === 0 && specialCharacters.includes(e.key)) {
    e.preventDefault();
  }
}

export function getIcon(text: any) {
  switch (text) {
    case 'Filtration':
      return <Filtration />;
    case 'Disinfection':
      return <Disinfection />;
    case 'Coagulation and Flocculation':
      return <Coagulation />;
    case 'Trickling Filters':
      return <TricklingFilters />;
    case 'Sedimentation':
      return <Sedimentation />;
    case 'Screening':
      return <Screening />;
    case 'Sand Filtration':
      return <SandFiltration />;
    case 'Reverse Osmosis':
      return <ReverseOsmosis />;
    case 'Removal of COD':
      return <RemovalofCOD />;
    case 'Removal of BOD':
      return <RemovalofBOD />;
    case 'Neutralization':
      return <Neutralization />;
    case 'Membrane Filtration':
      return <MembraneFiltration />;
    case 'Floatation':
      return <Floatation />;
    case 'Filtration':
      return <Filtration />;
    case 'Disinfection':
      return <Disinfection />;
    case 'Constructed Wetlands':
      return <ConstructedWetlands />;
    case 'Coagulation and Flocculation':
      return <CoagulationandFlocculation />;
    case 'Chlorination':
      return <Chlorination />;
    case 'Anaerobic Digestion':
      return <AnaerobicDigestion />;
    case 'Activated Sludge Process':
      return <ActivatedSludgeProcess />;
    case 'Activated Carbon Adsorption':
      return <ActivatedCarbonAdsorption />;
    default:
      return <Filtration />;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'For DP Revision':
    case 'Not Approved':
      return 'failure';
    case 'For Review':
    case 'For Approval':
      return 'warning';
    default:
      return 'warning';
  }
}

export const formatPDFData = (data: any[]) => {
  if (data.length === 0) return [];
  const headers = Object.keys(data[0]);

  return data.map((item: any, index: number) => [
    index + 1,
    ...headers.map((key: string) => item[key]),
  ]);
};

export const removeDuplicates = (data: any) => {
  return data.reduce((acc: any, item: any) => {
    acc[item.id] = acc[item.id] && item.comment ? item : acc[item.id] || item;
    return acc;
  }, {});
};

export function getValuesByKey(key: any, data: any) {
  if (data.hasOwnProperty(key)) {
    return data[key];
  } else {
    return [];
  }
}
export const formatDateToDDMMYYY = (dateString: any) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getYearFromDate = (year: any) => {
  const date = new Date(year);
  return date.getFullYear();
};

export const reviewrsLevels = [
  'L1_DATA_REVIEWER',
  'L2_DATA_REVIEWER',
  'L3_DATA_REVIEWER',
];
export const approversLevels = [
  'L1_DATA_APPROVER',
  'L2_DATA_APPROVER',
  'L3_DATA_APPROVER',
];
export const roleLevels: any = {
  reviewer: ['L1_DATA_REVIEWER', 'L2_DATA_REVIEWER', 'L3_DATA_REVIEWER'],
  approver: ['L1_DATA_APPROVER', 'L2_DATA_APPROVER', 'L3_DATA_APPROVER'],
};

export const roleStatusMapping: any = {
  DATA_PROVIDER: new Set(['For DP Revision']),
  L1_DATA_REVIEWER: new Set([
    'For L1 Review',
    'For L1 DR Revision',
    'For DR Revision',
    'For Review',
  ]),
  L2_DATA_REVIEWER: new Set(['For L2 Review', 'For L2 DR Revision']),
  L3_DATA_REVIEWER: new Set(['For L3 Review', 'For L3 DR Revision']),
  L1_DATA_APPROVER: new Set([
    'For L1 Approval',
    'For L1 Re-approval',
    'For Approval',
  ]),
  L2_DATA_APPROVER: new Set(['For L2 Approval']),
};

export const statusMapForForward: any = {
  L1_DATA_REVIEWER: 'For L1 Review',
  L2_DATA_REVIEWER: 'For L2 Review',
  L3_DATA_REVIEWER: 'For L3 Review',
  L1_DATA_APPROVER: 'For L1 Approval',
  L2_DATA_APPROVER: 'For L2 Approval',
  L3_DATA_APPROVER: 'For L3 Approval',
  Approved: 'Approved',
};
export const statusMapForRevert: any = {
  DATA_PROVIDER: 'For DP Revision',
  L1_DATA_REVIEWER: 'For L1 DR Revision',
  L2_DATA_REVIEWER: 'For L2 DR Revision',
  L3_DATA_REVIEWER: 'For L3 DR Revision',
  L1_DATA_APPROVER: 'For L1 Re-approval',
  L2_DATA_APPROVER: 'For L2 Re-approval',
  L3_DATA_APPROVER: 'For L3 Re-approval',
};

export const deleteSatausMappingFunc = (
  maxDA: any,
  maxDR: any,
  user: any,
  status: any
) => {
  switch (status) {
    case 'For L2 Review':
      return ['L1_DATA_REVIEWER'];
    case 'For L3 Review':
      return ['L2_DATA_REVIEWER'];
    case 'For L1 Approval':
      return [maxDR];
    case 'For L2 Approval':
      return ['L1_DATA_APPROVER'];
    case 'For Approval':
      return [maxDR];
    case 'For L1 Review':
      return ['DATA_PROVIDER'];
    case 'For Review':
      return ['DATA_PROVIDER'];
    case 'Approved':
      if (
        typeof maxDA !== 'string' ||
        maxDA.length < 2 ||
        !maxDA.startsWith('L')
      ) {
        return [];
      }
      return maxDA === 'L1_DATA_APPROVER'
        ? [maxDR]
        : [`L${+maxDA[1] - 1}_DATA_APPROVER`];
    default:
      return [];
  }
};

export const deleteSatausMapping: any = {
  'For L2 Review': ['L1_DATA_REVIEWER', 'L2_DATA_REVIEWER'],
  'For L3 Review': ['L2_DATA_REVIEWER', 'L3_DATA_REVIEWER'],
  'For L1 Approval': ['L3_DATA_REVIEWER', 'L1_DATA_APPROVER'],
  'For L2 Approval': ['L1_DATA_APPROVER', 'L2_DATA_APPROVER'],
  'For Approval': ['L1_DATA_REVIEWER', 'L1_DATA_APPROVER'],
  'For L1 Review': ['DATA_PROVIDER', 'L1_DATA_REVIEWER'],
  'For Review': ['DATA_PROVIDER', 'L1_DATA_REVIEWER'],
};

export const requestedDeleteStatusMapping: any = {
  'For L1 DR Deletion': ['L1_DATA_REVIEWER'],
  'For L2 DR Deletion': ['L2_DATA_REVIEWER'],
  'For L3 DR Deletion': ['L3_DATA_REVIEWER'],
  'For L1 DA Deletion': ['L1_DATA_APPROVER'],
  'For L2 DA Deletion': ['L2_DATA_APPROVER'],
  'For DA Deletion': ['L1_DATA_APPROVER'],
  'For DR Deletion': ['L1_DATA_REVIEWER'],

  //'For DA Deletion': ['L1_DATA_APPROVER'],
  'For Approval Deletion': ['L1_DATA_APPROVER'],

  'For Review': ['For DR Deletion'],
  'For Approval': ['For DA Deletion'],
};

export const capitalizeFirstWord = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeEachWord = (text: string): string => {
  if (!text) return text;
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function getFirstLetters(role: string): string {
  role = role.trim();
  if (role.length === 0) {
    return '';
  }
  return role.charAt(0);
}
export const getRowIdFromUniqueId = (unique: number, data: any) => {
  const row = data?.find((record: any) => record.uniqueId === unique);
  return row ? row.id : null;
};
export function removeElementByValue(array: any, value: any) {
  const index = array.indexOf(value);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

export const getCurrentDate = () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = today.getMonth();
  const year = today.getFullYear();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get the name of the month
  const monthName = monthNames[month];

  return `${day} ${monthName} ${year}`;
};

export function formatYearRange(dateString: any) {
  const years = dateString.match(/\d{4}/g);
  const startYear = years[0];
  const endYear = years[1];

  // If the last two digits of the start year and end year are the same, return only the start year
  if (startYear.slice(-2) === endYear.slice(-2)) {
    return startYear;
  }

  // Otherwise, return the full range in the format YYYY-YY
  const endYearShort = endYear.slice(-2);
  return `${startYear}-${endYearShort}`;
}

export function removeLastWord(str: String) {
  let words = str.split(' ');
  words.pop();
  return words.join(' ');
}

export const totalColumnsList = [
  'total_emission_emmited_by_fuel',
  'total_emission_emmited_by_fuel_in_tonnes',
  'emissions_kg_co2e',
  'emissions_t_co2e',
  'total_emission_kgco2e',
  'total_emission_tco2e',
  // 'total_quantity_of_fuel',
  // 'quantity',
  // 'total_water_consumed_in_cubic_meters',
  // 'total_effluents_in_cubic_meters',
  // 'total_waste',
  // 'kg_CO2_emission_per_unit',
  // 'kg_CO2e_per_unit',
  // 'fuel_consumed',
  // 'energy_purchased',
];

export function getUniqueQuestions(data: any) {
  const uniqueQuestionsMap = new Map();

  // Iterate over the data and add each question's object to the map based on the question
  data.forEach((item: any) => {
    if (!uniqueQuestionsMap.has(item.question)) {
      uniqueQuestionsMap.set(item.question, item);
    }
  });

  // Convert the map values back into an array
  return Array.from(uniqueQuestionsMap.values());
}

export function formatDateMMM(inputDate: any) {
  const dateParts = inputDate.split('-');

  // Create a Date object using the provided date parts
  const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

  // Define the options for the desired format (DD-MMM-YYYY)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  // Format the date and remove the comma
  return formattedDate.toLocaleDateString('en-GB', options).replace(',', '');
}
export const convertTargetActualData = (data: any) => {
  return data?.map((item: any) => {
    if (!item) return {}; // Skip undefined/null items
    // Dynamically rename 'module' to 'name'
    const newItem: any = { name: item?.module };

    // Dynamically map the other keys: 'actual_tCO2e', 'target_kgCO2e', 'target_tCO2e'
    Object.keys(item).forEach((key: any) => {
      if (key !== 'module') {
        newItem[key] = item[key];
      }
    });

    return newItem;
  });
};

export const formatAnswers = (input: any) => {
  return input.reduce((acc: any, item: any) => {
    acc[item.question_reference] = item;
    return acc;
  }, {});
};

export function handleStatus(status: any): string {
  switch (status) {
    case 'DP Submission':
      return 'DP Submission';

    case 'Submitted from provider':
      return 'For Review';

    case 'Submitted from reviewer':
      return 'For Approval';

    case 'reverted from approver':
      return 'For DR Revision';

    case 'reverted from reviewer':
      return 'For DP Revision';

    case 'Submitted from approver':
      return 'Approved';

    default:
      return '';
  }
}

export const statusColorMapping: any = {
  'DP Submission': [
    {
      DATA_PROVIDER: '#f68d2e',
      L1_DATA_REVIEWER: '#f68d2e',
      L1_DATA_APPROVER: '#f68d2e',
    },
  ],
  'Submitted from provider': [
    {
      DATA_PROVIDER: '#f68d2e', // Orange
      L1_DATA_REVIEWER: '#f68d2e', // Orange
      L1_DATA_APPROVER: '#f68d2e', // Orange
    },
  ],
  'Submitted from reviewer': [
    {
      DATA_PROVIDER: '#f68d2e', // Orange
      L1_DATA_REVIEWER: '#f68d2e', // Orange
      L1_DATA_APPROVER: '#f68d2e', // Orange
    },
  ],
  'Submitted from approver': [
    {
      DATA_PROVIDER: '#036323', // Green
      L1_DATA_REVIEWER: '#036323', // Green
      L1_DATA_APPROVER: '#036323', // Green
    },
  ],
  'reverted from reviewer': [
    {
      DATA_PROVIDER: '#7a0202', // Maroon
      L1_DATA_REVIEWER: '#7a0202', // Maroon
      L1_DATA_APPROVER: '#7a0202', // Maroon
    },
  ],
  'reverted from approver': [
    {
      DATA_PROVIDER: '#7a0202', // Maroon
      L1_DATA_REVIEWER: '#7a0202', // Maroon
      L1_DATA_APPROVER: '#7a0202', // Maroon
    },
  ],
};

export const getStatusStyle = (status: string, role: string) => {
  if (status) {
    return {
      color: statusColorMapping[status][0][role],
      fontWeight: 'bold',
      padding: '0px 0px',
      borderRadius: '5px',
      backgroundColor: 'transparent',
      // border: `2px solid ${statusColorMapping[status][0][role]}`,
      // width: '180px',
    };
  } else {
    return {
      color: 'red',
      fontWeight: 'bold',
      padding: '0px 0px',
      borderRadius: '5px',
      backgroundColor: 'transparent',
      // border: `2px solid "red`,
      // width: '180px',
    };
  }
};

export const getDotStyle = (status: string, role: string) => {
  if (status) {
    return {
      backgroundColor: statusColorMapping[status][0][role] || 'red',
      height: ' 5px',
      width: ' 5px',
      padding: '3px',
      border: '1px solid',
      borderRadius: '50%',
      margin: '0 5px',
    };
  }
};

export const shouldHideButton = (userRole: string, answerStatus: any) => {
  const hideConditions: any = {
    DATA_PROVIDER: [
      'Submitted from provider',
      'Submitted from reviewer',
      'Submitted from approver',
      'reverted from approver',
    ],
    L1_DATA_REVIEWER: [
      'DP Submission',
      'Submitted from reviewer',
      'Submitted from approver',
      'reverted from reviewer',
    ],
    L1_DATA_APPROVER: [
      'DP Submission',
      'Submitted from approver',
      'reverted from approver',
      'Submitted from provider',
      'reverted from reviewer',
    ],
  };

  return hideConditions[userRole]?.includes(answerStatus);
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};
