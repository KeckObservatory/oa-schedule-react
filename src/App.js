
import React, { Component } from 'react';
import './App.css';
import { Table } from "./components/Table/Table";
import { UploadFile } from "./components/UploadFile/UploadFile"
import ErrorBoundry from "./components/ErrorBoundry"

class App extends Component {
  constructor() {
    super()
    this.state = {
      schedule: [],
      columns: []
    }
  }

  cols = (schedule) => {
    const COLUMNS = [];
    const first = schedule[0];

    for (var key in first) {
      if (!key.includes('.')) {
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

  onNewSchedule = (data) => {
    this.setState({ schedule: [...data], columns: [...this.cols(data)] })
  }

  render() {
    const { schedule, columns } = this.state;

    if (schedule.length === 0) {
          return <div />
        }


    return (
      <div>
        <UploadFile onNewSchedule={this.onNewSchedule}/>
        <ErrorBoundry>
          <Table dat={schedule} cols={columns} />
        </ErrorBoundry>
      </div>
    );
  }
}


export default App;
