
import React, { useState, useEffect } from 'react';
import { Table } from "./components/Table/Table";
import { UploadFile } from "./components/UploadFile/UploadFile"
import DateSelector from "./components/DateSelector/DateSelector"
import ErrorBoundry from "./components/ErrorBoundry"
import { format } from "date-fns"
import "./App.css"

function App () {
  const [schedule, setSchedule] = useState([])
  const [columns, setColumns] = useState([])
  //TODO figure out why I have to ignore this
  // eslint-disable-next-line
  const [route, setRoute] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  const filteredSchedule = () => {
    if(startDate !== null && endDate !== null){
      return schedule.filter(sched => (sched.Date <= endDate && sched.Date >= startDate));
    }else{
      return (schedule);
    }
  }

  const cols = (schedule) => {
    const COLUMNS = [];
    const first = schedule[0];

    for (var key in first) {
      if (key==='Date'){
        COLUMNS.push(
         {
           Header: key,
           Footer: key,
           accessor: key,
           Cell: ({ value }) => { return format(new Date(value), 'MM/dd/yyy')} //TODO convert UT day to HST
         }
        )
      }else{
        COLUMNS.push(
         {
           Header: key,
           Footer: key,
           accessor: key,
         }
        )
      }
    }
    return COLUMNS;
  }

  useEffect(() => {
    fetch("http://98.151.209.95:5000/")
      .then(response => response.json())
      .then(data => {
        setSchedule([...data])
        setColumns([...cols(data)])
      });
  }, [])

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false)
    }else if (route === 'signin') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }

  const onNewSchedule = (data) => {
    setSchedule([...data])
    setColumns([...cols(data)])
  }

  if (schedule.length === 0) {
        return <div />
      }


  return (
    <div>
      <UploadFile isSignedIn={isSignedIn} onRouteChange={onRouteChange} onNewSchedule={onNewSchedule}/>
      <ErrorBoundry>
        <DateSelector dateRange={dateRange} setDateRange={setDateRange}/>
        <Table dat={filteredSchedule()} cols={columns}
          getCellProps={cellInfo => ({
            style: {
              backgroundColor: ["K1", "K1O", "K1T", "R1", "R1O", "R1T"].includes(cellInfo.value) ? "#FFC863" :
                               ["K2", "K2O", "K2T", "R2", "R2O", "R2T"].includes(cellInfo.value) ? "#7272FD" :
                               ["X", "L"].includes(cellInfo.value) ? "#D680D6" :
                               cellInfo.value === "OM" ? "#FFFF64" :
                               cellInfo.value === "HQ" ? "#2EB22E" :
                               cellInfo.value === "H" ? "#00D897" :
                               null

            },
          })}/>
      </ErrorBoundry>
    </div>
  );

}


export default App;
