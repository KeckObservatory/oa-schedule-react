
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
  //TODO figure out how to integrate this into dateRange without contant reloads
  const [firstDay, setFirstDay] = useState(new Date().setDate(new Date().getDate()-14))
  const [lastDay, setLastDay] = useState(null)
  //TODO figure out why I have to ignore this
  // eslint-disable-next-line
  const [isAdmin, setIsAdmin] = useState(false)
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  const filteredSchedule = () => {
    if(startDate !== null && endDate !== null){

      return schedule.filter(sched => (sched.Date <= endDate && sched.Date >= startDate));
    }else{
      const d = new Date();
      d.setDate(d.getDate()-14);
      return schedule.filter(sched => (sched.Date >= d));
    }
  }

  const cols = (schedule) => {
    const COLUMNS = [];
    const first = schedule[0];
    const splits = ['K1 PI', 'K2 PI', 'K1 Institution', 'K2 Institution', 'K1 Instrument', 'K2 Instrument']

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
      }else if (splits.includes(key)){
        COLUMNS.push(
          {
            Header: key,
            Footer: key,
            accessor: key,
            Cell: ({ value }) => { return value.split('/').join(' / ')}
          }
         )
      }else if (key!=='Holiday'){
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

  // TODO merge nighstaff and excel reads into something good
  // TODO make date ranges work with fetches
  // TODO FIGURE OUT WHY THIS BROKE
  const getSchedule = useCallback(() => {
    if (lastDay === null) {
      fetch("https://vm-www3build:53872/last_day")
        .then(response => response.json())
        .then(data => {
          if (data === null){
            //TODO iron out this auto date setting
            setLastDay(new Date().setDate(new Date().getDate()+60))
          }else{
            setLastDay(data)
          }
        });
    }else{
      fetch("https://vm-www3build:53872/")
        .then(response => response.json())
        .then(data => {
          setSchedule([...data])
          setColumns([...cols(data)])
          findHolidays(data)
        });
      fetch("https://vm-www3build:53872/nightstaff", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'Start': firstDay, 'End': lastDay })
      })
        .then(response => response.json())
        .then(data => {
          setSchedule([...data])
          setColumns([...cols(data)])
        });
      fetch("https://vm-www3build:53872/observers", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'Start': firstDay, 'End': lastDay })
      })
        .then(response => response.json())
        .then(data => {
          setSchedule([...data])
          setColumns([...cols(data)])
        });
      }
  }, [firstDay, lastDay, findHolidays])

  useEffect(() => {
    fetch('https://www3build.keck.hawaii.edu/staffinfo')
      .then(response => response.json())
      .then(data => {
        if(data.Alias==="jpelletier"){
          setIsAdmin(true)
        }else{
          setIsAdmin(false)
        }
      });
      getSchedule()
    // fetch("https://vm-www3build:53872/nightstaff", {
    //   method: 'post',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({'Start': start, 'End': end })
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     setSchedule([...data])
    //     setColumns([...cols(data)])
    //   });
    // fetch("https://vm-www3build:53872/")
    //   .then(response => response.json())
    //   .then(data => {
    //     setSchedule([...data])
    //     setColumns([...cols(data)])
    //     findHolidays(data)
    //   });
    // fetch("https://vm-www3build:53872/observers")
    //   .then(response => response.json())
    //   .then(data => {
    //     setSchedule([...data])
    //     setColumns([...cols(data)])
    //   });
  }, [getSchedule])

  const onNewSchedule = (data) => {
    setSchedule([...data])
    setColumns([...cols(data)])
    findHolidays(data)
  }

  if (schedule.length === 0) {
        return <div />
  }else{
    return (
      <div>
        {console.log(schedule)}
        <ErrorBoundry>
          <div className="grid-container">
            <div className="grid-item">
              <DateSelector dateRange={dateRange} setDateRange={setDateRange}/>
            </div>
            <div className="grid-item">
              <UploadFile isAdmin={isAdmin} onNewSchedule={onNewSchedule}/>
            </div>
          </div>
          <Table dat={filteredSchedule()} cols={columns} holidays={holidays} basepay={new Date("2022-01-02")} today={convertTime(new Date())}
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


  

}


export default App;
