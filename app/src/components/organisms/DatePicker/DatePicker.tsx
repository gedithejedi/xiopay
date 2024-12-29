import 'cally'
import { format } from 'date-fns'
import { HiOutlineCalendar } from 'react-icons/hi'
import { DatePickerProps } from './DatePicker.types'
import { ChangeEvent } from 'react'

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
        className="input input-border min-w-[240px]"
        id="cally1"
        // @ts-expect-error: This css style exist
        style={{ anchorName: '--cally1' }}
      >
        <HiOutlineCalendar />
        {format(dateRange[0], dateFormatToShow)} -{' '}
        {format(dateRange[1], dateFormatToShow)}
      </button>
      <div
        popover="auto"
        id="cally-popover1"
        className="absolute bg-base-100 rounded-box shadow-lg"
        style={{
          // @ts-expect-error: This css style exist
          positionAnchor: '--cally1',
          top: 'calc(anchor(bottom) + 5px)',
          justifySelf: 'anchor-center',
        }}
      >
        {/* @ts-expect-error: These are imported from cally */}
        <calendar-range
          max={format(new Date(), 'yyyy-MM-dd')}
          class="cally"
          value={getDateValue(dateRange)}
          onchange={(e: ChangeEvent<HTMLInputElement>) => {
            const [start, end] = e.target.value.split('/')
            setDateRange([new Date(start), new Date(end)])
          }}
        >
          <div className="grid grid-cols-2 gap-1">
            {/* @ts-expect-error: These are imported from cally */}
            <calendar-month></calendar-month>
            {/* @ts-expect-error: These are imported from cally */}
            <calendar-month offset={1}></calendar-month>
          </div>
          {/* @ts-expect-error: These are imported from cally */}
        </calendar-range>
      </div>
    </>
  )
}
