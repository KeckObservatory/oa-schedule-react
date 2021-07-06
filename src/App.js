
import React, { Component } from 'react';
import { Table } from "./components/Table/Table";
import { UploadFile } from "./components/UploadFile/UploadFile"
import ErrorBoundry from "./components/ErrorBoundry"
import { format } from "date-fns"
import "./App.css"

class App extends Component {
  constructor() {
    super()
    this.state = {
      schedule: [],
      columns: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  cols = (schedule) => {
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

  componentDidMount() {
    fetch("http://localhost:5000/")
      .then(response => response.json())
      .then(data => this.setState({ schedule: [...data], columns: [...this.cols(data)] }));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    }else if (route === 'signin') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  onNewSchedule = (data) => {
    this.setState({ schedule: [...data], columns: [...this.cols(data)] })
  }

  render() {
    const { isSignedIn, schedule, columns } = this.state;

    if (schedule.length === 0) {
          return <div />
        }


    return (
      <div>
        <UploadFile isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} onNewSchedule={this.onNewSchedule}/>
        <ErrorBoundry>
          <Table dat={schedule} cols={columns}
            getCellProps={cellInfo => ({
              style: {
                backgroundColor: ["K1", "K1O", "K1T", "R1", "R1O", "R1T"].includes(cellInfo.value) ? "orange" :
                                 ["K2", "K2O", "K2T", "R2", "R2O", "R2T"].includes(cellInfo.value) ? "blue" :
                                 ["X", "L"].includes(cellInfo.value) ? "purple" :
                                 cellInfo.value === "OM" ? "yellow" :
                                 cellInfo.value === "HQ" ? "green" :
                                 cellInfo.value === "H" ? "#7FFFD4" :
                                 null

              },
            })}/>
        </ErrorBoundry>
      </div>
    );
  }
}


export default App;
