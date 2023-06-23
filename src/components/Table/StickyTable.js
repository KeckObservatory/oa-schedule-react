import React, { useMemo }  from 'react'
import { useTable, useFilters, useBlockLayout } from 'react-table'
import { useSticky } from 'react-table-sticky'
import './Table.css'
import { ColumnFilter } from './ColumnFilter'
import { format } from "date-fns"
import { Styles } from './StickyStyles'
import { IndividualDownload } from "./IndividualDownload"

export const StickyTable = ({dat, cols, getCellProps, hiddenColumns=[]}) => {

  const columns = useMemo(() => cols, [cols])
  const data = useMemo(() => dat, [dat])

  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter
    }
  }, [])

  const telSchedule = (date) => {
    const day = new Date(date)
    const month = day.getMonth() + 1
    const linkDate = day.getFullYear() + '-' + month + '-' + day.getDate()
    window.open('https://www2.keck.hawaii.edu/observing/keckSchedule/keckSchedule.php?cmd=getSchedule&date=' + linkDate, "_blank")
  }

  const toggleAllCols = () => {
    toggleHideAllColumns(false)
  }

  const isolateColumn = (allColumns, name) => {
    hiddenColumns = allColumns.filter(column => column.id.length < 4 && column.id !== 'DOW' && column.id !== name).map(column => column.id)
    setHiddenColumns(hiddenColumns)
  }

  // const isolateColumn = (line) => {
  //   console.log(line)
  // }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    setHiddenColumns,
    toggleHideAllColumns
  }  = useTable({
    columns,
    data,
    defaultColumn,
    telSchedule,
    isolateColumn,
    toggleAllCols,
    initialState: {
      hiddenColumns: hiddenColumns
    }
  },
  useFilters, useBlockLayout, useSticky)
  const footerGroups = headerGroups.slice().reverse();

  // TODO clean up &nbsp;
  return (
    <>
      <div className="bb b--white">
        <div className="grid-container">
          <div className="grid-item">
            Current schedule start date: {format(new Date(data[0].Date), 'MM/dd/yyy')} End date: {format(new Date(data[data.length -1].Date), 'MM/dd/yyy')}
          </div>
          <div className="grid-item">
            Show schedule for:
            <select name="names" id="names" onChange={(e) => {
                const selection = document.getElementById("names").options[document.getElementById("names").selectedIndex].value
                if (selection === "All") {
                  toggleAllCols()
                }else{
                  isolateColumn(allColumns, selection, e)
                }
              }}>
              <option value="All">All</option>
              {allColumns.filter(column => column.id.length < 4 && column.id !== 'DOW' && column.id !== 'MTG').map(column => {
                return(<option value={column.id}>{column.id}</option>)
              })}
            </select>
          </div>
          <div className="grid-item">
            <IndividualDownload names={allColumns.filter(column => column.id.length < 4 && column.id !== 'DOW' && column.id !== 'MTG')} />
          </div>
        </div>
      </div>
      <Styles>
        <div {...getTableProps()} className="table sticky">
          <div className="header">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map( (column) => (
                  <div {...column.getHeaderProps()} className="th"><div className="checkmark"><input type='checkbox' {...column.getToggleHiddenProps()} /></div><br></br>{column.render('Header')}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()} className="body">
            {rows.map(row=> {
              prepareRow(row)
              return (
                <div className="{row.original.DOW} tr" {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <div {...cell.getCellProps([getCellProps(cell)])} className="td" onClick={(e) => {
                      if (cell.column.Header==="Date") {
                        telSchedule(row.original.Date, e)
                      }
                    }}>
                    {cell.render('Cell')}</div>
                  })}
                </div>
              )
              })}
          </div>
          <div className="footer">
            {footerGroups.map((footerGroup) => (
              <div {...footerGroup.getHeaderGroupProps()} className="tr">
                {footerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="tf">
                    {column.render('Footer')}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Styles>
    </>
  )
}
