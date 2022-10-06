import React from 'react';
import './App.css';
import UserContext from './Contexts/UserContext';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from './GraphqlQueries';
import ShowOnOffControl from './Components/Widgets/ShowOnOffControl';
import MuteOnOffControl from './Components/Widgets/MuteOnOffControl';
import DeviceStatusView from './Components/Widgets/DeviceStatusView';
import DailySchedulerView from './Components/Widgets/DailySchedulerView';

function App() {

  const { loading, err, data } = useQuery(GET_CURRENT_USER);

  if(loading) return <></>

  return (
    <UserContext.Provider value={data.getCurrentUser || ''}>
      <ShowOnOffControl/>
      <MuteOnOffControl/>
      <DeviceStatusView/>
      <DailySchedulerView/>
    </UserContext.Provider>
  )
}

export default App;
