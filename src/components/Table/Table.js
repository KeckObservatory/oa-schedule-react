import React, { useMemo }  from 'react'
import { useTable, useFilters} from 'react-table'
import './Table.css'
import { ColumnFilter } from './ColumnFilter'
import { format } from "date-fns"
import { IndividualDownload } from "../IndividualDownload/IndividualDownload"

export const Table = ({dat, cols, holidays, basepay, today, getCellProps, hiddenColumns=[]}) => {

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
    footerGroups,
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
  useFilters)

  return (
    <>
      <div className="bb b--white">
        <div className="grid-container">
          <div className="grid-item">
            {console.log(schedule)}
            Current schedule range: {format(new Date(data[0].Date), 'MM/dd/yyy')} to {format(new Date(data[data.length -1].Date), 'MM/dd/yyy')}
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
      <div className="tablewrap">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map( (column) => (
                  <th {...column.getHeaderProps()}><div className="checkmark"><input type='checkbox' {...column.getToggleHiddenProps()} /></div><br></br>{column.render('Header')}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row=> {
              prepareRow(row)
              return (
                <tr className={holidays.includes(row.original.Date) ? "holiday " + row.original.DOW:
                              //TODO figure out why I need to round
                              Math.round((basepay.getTime() - new Date(row.original.Date).getTime())/(1000*3600*24)%14) === 0 ? "pay "  + row.original.DOW:
                              row.original.Date === today ? "today "  + row.original.DOW:
                              holidays.includes(row.original.Date) && row.original.Date === today ? "today holiday"  + row.original.DOW:
                              Math.round((basepay.getTime() - new Date(row.original.Date).getTime())/(1000*3600*24)%14) && row.original.Date === today ? "today pay"  + row.original.DOW:
                              row.original.DOW} 
                              {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps([getCellProps(cell)])} onClick={(e) => {
                      if (cell.column.Header==="Date") {
                        telSchedule(row.original.Date, e)
                      }
                    }}>
                    {cell.render('Cell')}</td>
                  })}
                </tr>
              )
              })}
          </tbody>
          <tfoot>
            {footerGroups.map((footerGroup) => (
                <tr {...footerGroup.getFooterGroupProps()}>
                  {footerGroup.headers.map(column => (
                      <td {...column.getFooterProps}>{column.render('Footer')}</td>
                    ))}
                </tr>
              ))}
          </tfoot>
        </table>
      </div>
    </>
  )
}
