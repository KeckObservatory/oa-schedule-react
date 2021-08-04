import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange;
  return(
    <div>
      <div>
        Enter a date range
      </div>
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
