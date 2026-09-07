import React, { useReducer, useState } from 'react';
import { Row, Col } from 'antd';
import {
  PageCardComponent,
  InputComponent,
  ButtonComponent,
} from '../../DesignLibrary';
import Styles from './governance.module.scss';
import { isEmpty } from '../../Utils/isEmpty';
import { post } from '../../Services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';

const initialState = {
  no_of_directors: '',
  no_of_independent_directors: '',
  no_of_board_of_director_male: '',
  no_of_board_of_director_female: '',
  // tenure: '',
  // board_committees: '',
  no_of_executive: '',
  no_of_management_team_male: '',
  no_of_management_team_female: '',
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export default function BoardandComposition({}: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [touched, setTouched] = useState<any>({});
  const { user } = useAuth();
  const { openToast } = useNotification();
  const navigate = useNavigate();

  const handleInputChange = (field: any) => (value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
    if (!isEmpty(value)) {
      setTouched({ ...touched, [field]: false });
    }
  };

  const handleBlur = (e: any, id: any) => {
    if (isEmpty(e.target.value)) {
      setTouched({ ...touched, [id]: true });
    }
  };

  const inputField = (id: any, label: any, errMsg: any, index = null) => (
    <React.Fragment>
      <InputComponent
        style={{ height: '50px', background: '#FAF9FF' }}
        onChange={(e: any) => {
          const newValue = e.target.value;
          if (id === 'board_committees') {
            handleInputChange(id)(newValue);
          } else {
            if (
              !isNaN(newValue) &&
              (newValue === '' || parseFloat(newValue) >= 0)
            ) {
              handleInputChange(id)(newValue);
            }
          }
        }}
        onBlur={(e) => handleBlur(e, id)}
        labelClassName={Styles?.fatalitiesAndInjuriesTitle}
        id={id}
        type={id === 'board_committees' ? 'text' : 'number'}
        label={label}
        status={touched[id] ? 'error' : ''}
        value={state[id]}
        onKeyDown={(e: any) => {
          if (id === 'tenure') {
            if (
              e.key === '-' ||
              (e.key === '.' && e.currentTarget.value.includes('.'))
            ) {
              e.preventDefault();
            }
          } else {
            if (
              e.key === '-' ||
              e.key === '.' ||
              e.key === 'e' ||
              e.key === 'E'
            ) {
              e.preventDefault();
            }
          }
        }}
      />
      {touched[id] && <div className={Styles?.goveranceErr}>{errMsg}</div>}
    </React.Fragment>
  );

  const disableBtnFunc = () => {
    const dataObj = Object.values(state);
    return dataObj.some((e) => isEmpty(e));
  };

  const handleSubmit = async () => {
    const {
      no_of_executive,
      no_of_management_team_male,
      no_of_management_team_female,
      no_of_directors,
      no_of_independent_directors,
      no_of_board_of_director_male,
      no_of_board_of_director_female,
      // tenure,
    } = state;

    if (
      parseInt(no_of_executive) !==
      parseInt(no_of_management_team_male) +
        parseInt(no_of_management_team_female)
    ) {
      openToast({
        content:
          'The total number of executives must equal the sum of male and female executives.',
        type: 'error',
      });
      return;
    }

    if (
      parseInt(no_of_directors) !==
      parseInt(no_of_board_of_director_male) +
        parseInt(no_of_board_of_director_female)
    ) {
      openToast({
        content:
          'The total number of directors must equal the sum of male and female directors.',
        type: 'error',
      });
      return;
    }

    if (parseInt(no_of_independent_directors) >= parseInt(no_of_directors)) {
      openToast({
        content:
          'The number of independent directors must be less than the total number of directors.',
        type: 'error',
      });
      return;
    }

    // if (parseFloat(tenure) === 0) {
    //   openToast({
    //     content: 'Tenure should not be 0.',
    //     type: 'error',
    //   });
    //   return;
    // }

    const newObj = { ...state };
    newObj['entity_Id'] = user?.entity_Id;
    try {
      const res = await post(
        `/board_and_management/create-data-for-board-and-management/`,
        newObj
      );
      openToast({
        content: `${res.message}`,
        type: 'success',
      });
      navigate('/board-composition');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleReset = async () => {
    dispatch({ type: 'RESET' });
    setTouched({});
  };

  return (
    <>
      {/* <div className={Styles.governanceHeader}>
        Board and Management Composition
      </div> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className={Styles?.governanceSubTitle}>Board Composition</div>
          </Col>
          <Col span={10}>
            {inputField(
              'no_of_directors',
              'Total Number of Directors on the Board *',
              'Please enter a valid number'
            )}
          </Col>
          <Col span={10}>
            {inputField(
              'no_of_independent_directors',
              'Number of Independent Directors on the Board *',
              'Please enter a valid number'
            )}
          </Col>
          <Col span={10}>
            {inputField(
              'no_of_board_of_director_male',
              'Number of Female Directors *',
              'Please enter a valid number'
            )}
          </Col>
          <Col span={10}>
            {inputField(
              'no_of_board_of_director_female',
              'Number of Male Directors *',
              'Please enter a valid number'
            )}
          </Col>
          {/* <Col span={10}>
            {inputField('tenure', 'Tenure *', 'Please enter a valid number')}
          </Col> */}
          {/* <Col span={10}>
            {inputField(
              'board_committees',
              'Board Committees *',
              'Please enter a valid committee'
            )}
          </Col> */}
          <Col span={24}>
            <div className={Styles?.governanceSubTitle}>Management Team</div>
          </Col>
          <Col span={10}>
            {inputField(
              'no_of_executive',
              'Total Management Team *',
              'Please enter a valid number'
            )}
          </Col>
          <Col span={10}></Col>
          <Col span={10}>
            {inputField(
              'no_of_management_team_female',
              'Number of Female Management Team *',
              'Please enter a valid number'
            )}
          </Col>
          <Col span={10}>
            {inputField(
              'no_of_management_team_male',
              'Number of Male Management Team *',
              'Please enter a valid number'
            )}
          </Col>
          <Col span={24}>
            <Row justify="end" className={Styles.customPaddingTop}>
              <Col className={Styles.customPaddingRight}>
                <ButtonComponent
                  hierarchy="tertiary"
                  onClick={() => navigate('/board-composition')}
                >
                  Cancel
                </ButtonComponent>
              </Col>
              <Col className={Styles.customPaddingRight}>
                <ButtonComponent hierarchy="secondary" onClick={handleReset}>
                  Reset
                </ButtonComponent>
              </Col>
              <Col>
                <ButtonComponent
                  disabled={disableBtnFunc()}
                  hierarchy="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </ButtonComponent>
              </Col>
            </Row>
          </Col>
        </Row>
      </PageCardComponent>
    </>
  );
}
