import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export const ColumnFilter = ({ column }) => {
  
  const {filterValue, setFilter} = column
  const [value, setValue] = useState(filterValue)
  const [searching, setSearching] = useState(false)

  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 300)

  let width = window.innerWidth;
  let inSize;
  let output;

  if(width>750){
    inSize = "4"
  }else{
    inSize="1"
  }

  if(searching){
    output = <input autofocus size={inSize} value={value || ''} onChange={(e) => {
              setValue(e.target.value)
              onChange(e.target.value)
            }}/>

  }else{
    output = <button onClick={() => setSearching(true)}>&#x1F50D;</button>
  }

  return (
    <span>
      <div className="searchinput">
        {output}
      </div>
    </span>
  )
}
