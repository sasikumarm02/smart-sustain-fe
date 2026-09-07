import React, { useState, useEffect } from 'react';
import { get } from '../../Services/api.service';
import { Select } from 'antd';

export default function SelectCompany() {
  const [data, setData] = useState<any>([]);
  const fetchData = (apiUrl: any) => {
    if (apiUrl !== undefined) {
      get(apiUrl)
        .then((res: any) => setData(res.response.data))
        .catch((err) => console.log(err));
    } else {
      setData([]);
    }
  };
  // useEffect(() => {
  //   fetchData("/entity/getEntitiesListByUserId/");
  // }, []);
  return (
    <>
      <Select
        size="large"
        // defaultValue="lucy"
        className="company_select"
        placeholder="Select Company"
        onChange={(e) => console.log(e)}
        options={data.map((res: any, index: number) => ({
          value: res.entity_Id,
          label: res.entity_name,
        }))}
      />
    </>
  );
}
