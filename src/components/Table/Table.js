import React, { useMemo }  from 'react'
import { useTable, useFilters} from 'react-table'
import './Table.css'
import { ColumnFilter } from './ColumnFilter'
import { format } from "date-fns"

export const Table = ({dat, cols, getCellProps, hiddenColumns=[]}) => {

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
  // TODO clean up &nbsp;
  return (
    <>
        <div className="bb b--white">
          Current schedule start date: {format(new Date(data[0].Date), 'MM/dd/yyy')} End date: {format(new Date(data[data.length -1].Date), 'MM/dd/yyy')}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                  <tr className={row.original.DOW} {...row.getRowProps()}>
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
