import { useEffect, useState } from 'react';

import { get } from '../../Services';
// import { monthsForCurrentYear } from "../../Utils/Strings";
import { useNotification } from '../../Hooks/useNotification';

import {
  setEnergyConsumptionOptions,
  setFugitiveOptions,
  setMobileOptions,
  setProcessOptions,
  setStationaryOptions,
} from '../../Redux/Actions';
import { useDispatch } from 'react-redux';
import StationaryForm from './StationaryForm';
import MobileForm from './MobileForm';
import ProcessForm from './ProcessForm';
import FugitiveForm from './FugitiveForm';
import EnergyForm from './EnergyForm';
import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';

type MonthlyData = {
  [key: string]: { quantity: number; disclosure: null };
};

export interface InputData {
  UOM: string;
  fuel: string;
  disclosure: any;
  monthlyData: MonthlyData;
}

export interface InputDataEnv {
  UOM: string;
  fuel: string;
  disclosure: any;
  monthlyData: MonthlyData;
}

export interface TransformedMonthlyData {
  month: string;
  quantity: number;
}

interface TransformedData {
  UOM: string;
  fuel: string;
  disclosure: [];
  monthlyData: TransformedMonthlyData[];
}

interface cat_one_tab_oneData {
  UOM: string;
  fuel: string;
}

interface TransformedMonthlyDataEnv {
  month: string;
  consumed_water: number;
}

interface TransformedDataEnvironment {
  uom: string;
  water_source: string;
  disclosure: any;
  monthlyData: TransformedMonthlyDataEnv[];
}

export function transformData(input: InputData[]): {
  stationary_data: TransformedData[];
} {
  let transformedStationary: TransformedData[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedData = {
      UOM: item.UOM,
      fuel: item.fuel,
      disclosure: item.disclosure,
      monthlyData: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (data.quantity > 0) {
        transformedItem.monthlyData.push({
          month: month,
          quantity: data.quantity,
        });
      }
    }
    transformedStationary.push(transformedItem);
  });

  return { stationary_data: transformedStationary };
}

export function transEnviromentData(input: InputDataEnv[]): {
  water_data: TransformedDataEnvironment[];
} {
  let TransformedEnvironment: TransformedDataEnvironment[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedDataEnvironment = {
      uom: item.UOM,
      water_source: item.fuel,
      disclosure: item.disclosure,
      monthlyData: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (data.quantity > 0) {
        transformedItem.monthlyData.push({
          month: month,
          consumed_water: +data.quantity,
        });
      }
    }
    TransformedEnvironment.push(transformedItem);
  });

  return { water_data: TransformedEnvironment };
}

type FugitiveMonthlyData = {
  [key: string]: { quantity: string };
};

interface FugitiveInputData {
  equipmentType: string;
  gas_or_refrigerant: string;
  UOM: string;
  disclosure: any;
  monthlyData: FugitiveMonthlyData;
}

interface TransformedFugitiveMonthlyData {
  month: string;
  quantity: string;
}

interface TransformedFugitiveData {
  equipmentType: string;
  gas_or_refrigerant: string;
  UOM: string;
  disclosure: any;
  monthlyData: TransformedFugitiveMonthlyData[];
}

export function transformFugitiveData(input: FugitiveInputData[]): {
  fugitive_data: TransformedFugitiveData[];
} {
  let transformedFugitive: TransformedFugitiveData[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedFugitiveData = {
      equipmentType: item.equipmentType,
      gas_or_refrigerant: item.gas_or_refrigerant,
      UOM: item.UOM,
      disclosure: item.disclosure,
      monthlyData: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (Number(data.quantity) > 0) {
        transformedItem.monthlyData.push({
          month: month,
          quantity: data.quantity,
        });
      }
    }
    transformedFugitive.push(transformedItem);
  });

  return { fugitive_data: transformedFugitive };
}

type EnergyMonthlyData = {
  [key: string]: { quantity: any };
};

interface EnergyInputData {
  source_of_energy: string;
  energy_source?: string | '';
  vehicle_type: string;
  disclosure: [];
  UOM: string;
  monthlyData: EnergyMonthlyData;
}

interface TransformedEnergyMonthlyData {
  month: string;
  quantity: any;
}

interface TransformedEnergyData {
  source_of_energy?: string | '';
  vehicle_type?: string | '';
  UOM: string;
  disclosure: [];
  monthlyData: TransformedEnergyMonthlyData[];
}

export function transformEnergyData(input: EnergyInputData[]): {
  energy_data: TransformedEnergyData[];
} {
  let transformedEnergy: TransformedEnergyData[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedEnergyData = {
      source_of_energy: item?.energy_source
        ? item.energy_source
        : item.source_of_energy,
      vehicle_type: item.vehicle_type ? item.vehicle_type : '',
      UOM: item.UOM,
      disclosure: item.disclosure,
      monthlyData: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (data.quantity > 0) {
        transformedItem.monthlyData.push({
          month: month,
          quantity: data.quantity,
        });
      }
    }
    transformedEnergy.push(transformedItem);
  });

  return { energy_data: transformedEnergy };
}

type MobileMonthlyData = {
  [key: string]: { quantity: string; disclosure: any };
};

type EffluentsMonthlyData = {
  [key: string]: { quantity: string; disclosure: any };
};

interface MobileInputData {
  vehicleType: string;
  fuel: string;
  UOM: string;
  disclosure: any;
  monthlyData: MobileMonthlyData;
}

interface TransformedMobileMonthlyData {
  month: string;
  quantity: string;
}

interface TransformedMobileData {
  vehicleType: string;
  fuel: string;
  UOM: string;
  disclosure: any;
  monthlyData: TransformedMobileMonthlyData[];
}

export function transformMobileData(input: MobileInputData[]): {
  mobile_data: TransformedMobileData[];
} {
  let transformedMobile: TransformedMobileData[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedMobileData = {
      vehicleType: item.vehicleType,
      fuel: item.fuel,
      UOM: item.UOM,
      disclosure: item.disclosure,
      monthlyData: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (Number(data.quantity) > 0) {
        transformedItem.monthlyData.push({
          month: month,
          quantity: data.quantity,
        });
      }
    }
    transformedMobile.push(transformedItem);
  });

  return { mobile_data: transformedMobile };
}

//effluents data

interface EffluentsInputData {
  primary: any;
  secondary: any;
  tertiary: any;
  disclosure: any;
  uom: string;
  monthlyData: EffluentsMonthlyData;
}

interface TransformedEffluentsMonthlyData {
  month: string;
  total_effluents_discharged: string;
}

interface TransformedEffluentsData {
  primary: any;
  secondary: any;
  tertiary: any;
  uom: string;
  disclosure: any;
  monthly_data: TransformedEffluentsMonthlyData[];
}

export function transformEffluentsData(input: EffluentsInputData[]): {
  effluents_data: TransformedEffluentsData[];
} {
  let transformedMobile: TransformedEffluentsData[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedEffluentsData = {
      primary: [item.primary],
      secondary: [item.secondary],
      tertiary: [item.tertiary],
      uom: item.uom,
      disclosure: item.disclosure,
      monthly_data: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (Number(data.quantity) > 0) {
        transformedItem.monthly_data.push({
          month: month,
          total_effluents_discharged: data.quantity,
        });
      }
    }
    transformedMobile.push(transformedItem);
  });

  return { effluents_data: transformedMobile };
}

// water data

type WaterMonthlyData = {
  [key: string]: { quantity: string; disclosure: any };
};

interface WaterInputData {
  water_source: string;
  UOM: string;
  disclosure: any;
  monthlyData: WaterMonthlyData;
}

interface TransformedWaterMonthlyData {
  month: string;
  consumed_water: string;
}

interface TransformedWaterData {
  water_source: string;
  uom: string;
  disclosure: any;
  monthlyData: TransformedWaterMonthlyData[];
}

export function TransformWaterData(input: WaterInputData[]): {
  water_data: TransformedWaterData[];
} {
  let transformedWater: TransformedWaterData[] = [];

  input?.forEach((item) => {
    let transformedItem: TransformedWaterData = {
      water_source: item.water_source,
      uom: item.UOM,
      disclosure: item.disclosure,
      monthlyData: [],
    };

    for (const [month, data] of Object.entries(item.monthlyData)) {
      if (Number(data.quantity) > 0) {
        transformedItem.monthlyData.push({
          month: month,
          consumed_water: data.quantity,
        });
      }
    }
    transformedWater.push(transformedItem);
  });

  return { water_data: transformedWater };
}

export default function CustomForm({ label, tabKey }: any) {
  const { openToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchFuelList = (value: string) => {
    get(`/Emissions/get_dropdown_optoins/?scope=${value}`)
      .then((res: any) => {
        if (res.response.status === true) {
          if (value !== 'Scope2') {
            dispatch(
              setStationaryOptions(
                res?.response?.data?.stationaryDropdownOptionsData
              )
            );
            dispatch(
              setMobileOptions(res?.response?.data?.mobileDropdownOptionsData)
            );
            dispatch(
              setProcessOptions(
                res?.response?.data?.processOrFugitiveDropdownOptionsData
              )
            );
            dispatch(
              setFugitiveOptions(
                res?.response?.data?.processOrFugitiveDropdownOptionsData
              )
            );

            //setMobileFuels(res?.response?.data?.mobileDropdownOptionsData);
            // setProcessFuels(
            //   res?.response?.data?.processOrFugitiveDropdownOptionsData
            // );
          } else {
            dispatch(
              setEnergyConsumptionOptions(
                res?.response?.data?.energyConsumptionDropdownOptionsData
              )
            );
          }
        } else {
          openToast({
            content: `${res?.response?.message}`,
            type: 'warning',
          });
        }
      })
      .catch((err) =>
        openToast({
          content: `${err.message}`,
          type: 'error',
        })
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (window.location.pathname !== '/emission/scope-two') {
      fetchFuelList('Scope1');
    } else {
      fetchFuelList('Scope2');
    }
  }, []);

  return (
    <div>
      {label === 'Stationary Combustion' && <StationaryForm tabKey={tabKey} />}

      {label === 'Mobile Combustion' && <MobileForm tabKey={tabKey} />}

      {label === 'Process Emissions' && <ProcessForm tabKey={tabKey} />}

      {label === 'Fugitive Emissions' && <FugitiveForm tabKey={tabKey} />}

      {label === 'Energy Consumption' && <EnergyForm tabKey={tabKey} />}
    </div>
  );
}
