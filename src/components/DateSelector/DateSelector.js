import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateSelector.css"

const DateSelector = ({ dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange;
  return(
    <div>
      <label className="date-label">
        Enter a date range:
      </label>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {setDateRange(update);}} isClearable={true}
        monthsShown={2}
      />
    </div>
  )
}

export default DateSelector
