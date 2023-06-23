
import React, { useState, useEffect, useCallback } from 'react';
import { Table } from "./components/Table/Table";
import { UploadFile } from "./components/UploadFile/UploadFile"
import DateSelector from "./components/DateSelector/DateSelector"
import ErrorBoundry from "./components/ErrorBoundry"
import { format } from "date-fns"
import "./App.css"

function App () {
  const [schedule, setSchedule] = useState([])
  const [columns, setColumns] = useState([])
  const [holidays, setHolidays] = useState([])
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
           Cell: ({ value }) => { return format(new Date(value), 'MM/dd/yyy')}
         }
        )
      }else{
        COLUMNS.push(
         {
           Header: key,
           Footer: key,
           accessor: key
         }
        )
      }
    }
    return COLUMNS;
  }

  useEffect(() => {
    fetch("https://vm-www3build:53872/")
      .then(response => response.json())
      .then(data => {
        setSchedule([...data])
        setColumns([...cols(data)])
        findHolidays(data)
      });
    fetch("https://vm-www3build:53872/observers")
      .then(response => response.json())
      .then(data => {
        setSchedule([...data])
        setColumns([...cols(data)])
      });
  }, [findHolidays])

  const convertTime = (d) => {
    return d.getTime()-(d.getTime()%86400000) - 50400000
  }

  const findHolidays = useCallback((data)=> {
    const hol = []
    for (var day in data){
      if(data[day].Holiday === 'X'){
        hol.push(data[day].Date)
      }
    }
    setHolidays([...hol])
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
    findHolidays(data)
  }

  if (schedule.length === 0) {
        return <div />
      }


  return (
    <div>
      <ErrorBoundry>
        <div className="grid-container">
          <div className="grid-item">
            <DateSelector dateRange={dateRange} setDateRange={setDateRange}/>
          </div>
          <div className="grid-item">
            <UploadFile isSignedIn={isSignedIn} onRouteChange={onRouteChange} onNewSchedule={onNewSchedule}/>
          </div>
        </div>
        <Table dat={filteredSchedule()} cols={columns} holidays={holidays} today={convertTime(new Date())}
          getCellProps={cellInfo => ({
            style: {
              backgroundColor: ["K1", "K1O", "K1T", "R1", "R1O", "R1T"].includes(cellInfo.value) ? "#FFC863" :
                               ["K2", "K2O", "K2T", "R2", "R2O", "R2T"].includes(cellInfo.value) ? "#7272FD" :
                               ["X", "L"].includes(cellInfo.value) ? "#D680D6" :
                               cellInfo.value === "OM" ? "#FFFF64" :
                               cellInfo.value === "HQ" ? "#2EB22E" :
                               cellInfo.value === "H" ? "#00D897" :
                               // cellInfo.value === null ? "#FFFFFF":
                               // (cellInfo.value.toString().startsWith('O') && cellInfo.value.length < 4) ? "#FFFFFF":
                               null

            },
          })}/>
      </ErrorBoundry>
    </div>
  );

}


export default App;
