
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
  const [observingMeetings, setObservingMeetings] = useState([])
  const [firstDay, setFirstDay] = useState(new Date().setDate(new Date().getDate()-14))
  //TODO figure out why I have to ignore this
  // eslint-disable-next-line
  const [isAdmin, setIsAdmin] = useState(false)
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  const filterRange = (range) => {
    if (new Date(range[0]).getTime() < firstDay && new Date(range[1]).getTime() < firstDay && range[1] !== null){
      fetch("https://vm-www3build:53872/nightstaff", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'Start': new Date(range[0]).getTime(), 'End': new Date(range[1]).getTime(), 'Overlap': false })
    })
      .then(response => response.json())
      .then(data => {
        const newsched = data.concat(schedule)
        fetch("https://vm-www3build:53872/observers", {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({'Schedule': newsched, 'Start': new Date(range[0]).getTime(), 'End': new Date(range[1]).getTime()})
            })
              .then(response => response.json())
              .then(data => {
                setSchedule([...data])
                setDateRange(range)
           });
      });
    }else if (new Date(range[0]).getTime() < firstDay && range[1] !== null){
      fetch("https://vm-www3build:53872/nightstaff", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'Start': new Date(range[0]).getTime(), 'End': firstDay, 'Overlap': true})
    })
      .then(response => response.json())
      .then(data => {
        const newsched = data.concat(schedule)
        fetch("https://vm-www3build:53872/observers", {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({'Schedule': newsched, 'Start': new Date(range[0]).getTime(), 'End': new Date(range[1]).getTime() })
            })
              .then(response => response.json())
              .then(data => {
                setSchedule([...data])
                setDateRange(range)
           });
      });
    }else if(startDate !== null && endDate !== null){
      getSchedule()
      setDateRange(range)
    }else{
      setDateRange(range)
    }   
  }

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
      }else if (key!=='Holiday' && key!=='Mtg'){
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

  const findOMs = useCallback((data)=> {
    const om = []
    for (var day in data){
      if(data[day].Mtg === 'OM'){
        om.push(data[day].Date)
      }
    }
    setObservingMeetings([...om])
  }, [])

  const getInitialSchedule = useCallback(() => {
    let end = new Date().setDate(new Date().getDate()+60)
    fetch("https://vm-www3build:53872/nightstaff", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'Start': firstDay, 'End': end, 'Overlap': false })
          })
          .then(response => response.json())
          .then(data => {
            setSchedule([...data])
            setColumns([...cols(data)])
            fetch("https://vm-www3build:53872/observers", {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({'Schedule': data, 'Start': firstDay, 'End': end })
            })
              .then(response => response.json())
              .then(data => {
                setSchedule([...data])
                setColumns([...cols(data)])
              });
          });
    }, [firstDay])

  const getSchedule = useCallback(() => {
    fetch("https://vm-www3build:53872/")
    .then(response => response.json())
    .then(data => {
      setSchedule([...data])
      setColumns([...cols(data)])
      findHolidays(data)
      findOMs(data)
      setFirstDay(data[0].Date)
      fetch("https://vm-www3build:53872/observers", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'Schedule': data, 'Start': data[0].Date, 'End': data[data.length-1].Date })
      })
        .then(response => response.json())
        .then(data => {
          setSchedule([...data])
          setColumns([...cols(data)])
        });
    });
  }, [findHolidays, findOMs])

  useEffect(() => {
    fetch('https://www3build.keck.hawaii.edu/staffinfo')
      .then(response => response.json())
      .then(data => {
        if(data.Alias==="jpelletier" || data.Alias==="cjordan"){
          setIsAdmin(true)
        }else{
          setIsAdmin(false)
        }
      });
      fetch("https://vm-www3build:53872/file_check")
        .then(response => response.json())
        .then(data => {
          if (data.File){
            getSchedule()
          }else{
            getInitialSchedule()
          }
        })   
  }, [getInitialSchedule, getSchedule])

  const onNewSchedule = (data) => {
    setSchedule([...data])
    setColumns([...cols(data)])
    findHolidays(data)
    findOMs(data)
  }

  if (schedule.length === 0) {
        return <div />
  }else{
    return (
      <div>
        <ErrorBoundry>
          <div className="grid-container">
            <div className="grid-item">
              <DateSelector dateRange={dateRange} filterRange={filterRange}/>
            </div>
            <div className="grid-item">
              <UploadFile isAdmin={isAdmin} onNewSchedule={onNewSchedule}/>
            </div>
          </div>
          <Table dat={filteredSchedule()} cols={columns} holidays={holidays} oms={observingMeetings} basepay={new Date("2022-01-02")} today={convertTime(new Date())}
            getCellProps={cellInfo => ({
              style: {
                backgroundColor: ["K1", "K1O", "K1T", "R1", "R1O", "R1T"].includes(cellInfo.value) ? "#FFC863" :
                                 ["K2", "K2O", "K2T", "R2", "R2O", "R2T"].includes(cellInfo.value) ? "#7272FD" :
                                 ["K1!", "K1O!", "K1T!", "R1!", "R1O!", "R1T!", "K2!", "K2O!", "K2T!", "R2!", "R2O!", "R2T!"].includes(cellInfo.value) ? "#FF0000" :
                                 ["X", "L"].includes(cellInfo.value) ? "#E8B6EC" :
                                 cellInfo.value === "OM" ? "#FFFF64" :
                                 cellInfo.value === "HQ" ? "#9DC183" :
                                 cellInfo.value === "H" ? "#00D897" :
                                 null
  
              },
            })}/>
        </ErrorBoundry>
      </div>
    );
  }


  

}


export default App;
