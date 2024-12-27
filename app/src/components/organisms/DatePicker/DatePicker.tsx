import 'cally'
import { format } from 'date-fns'
import { HiOutlineCalendar } from 'react-icons/hi'
import { DatePickerProps } from './DatePicker.types'

const getDateValue = (dateRange: [Date, Date]) => {
  return `${format(dateRange[0], 'yyyy-MM-dd')}/${format(dateRange[1], 'yyyy-MM-dd')}`
}
const dateFormatToShow = 'LLL dd, y'

export default function DatePicker({
  dateRange,
  setDateRange,
}: DatePickerProps) {
  return (
    <>
      <button
        popoverTarget="cally-popover1"
        className="input input-border"
        id="cally1"
        style={{ anchorName: '--cally1' }}
      >
        <HiOutlineCalendar />
        {format(dateRange[0], dateFormatToShow)} -{' '}
        {format(dateRange[1], dateFormatToShow)}
      </button>
      <div
        popover="auto"
        id="cally-popover1"
        className="dropdown bg-base-100 rounded-box shadow-lg"
        style={{
          positionAnchor: '--cally1',
          top: 'calc(anchor(bottom) + 5px)',
          justifySelf: 'anchor-center',
        }}
      >
        <calendar-range
          max={format(new Date(), 'yyyy-MM-dd')}
          class="cally"
          value={getDateValue(dateRange)}
          onchange={(e) => {
            const [start, end] = e.target.value.split('/')
            setDateRange([new Date(start), new Date(end)])
          }}
        >
          <div className="grid grid-cols-2 gap-1">
            <calendar-month></calendar-month>
            <calendar-month offset={1}></calendar-month>
          </div>
        </calendar-range>
      </div>
    </>
  )
}
