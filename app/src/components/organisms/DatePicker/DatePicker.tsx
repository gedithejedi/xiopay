import 'cally'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { DatePickerProps } from './DatePicker.types'

export default function DatePicker({
  dateRange,
  setDateRange,
}: DatePickerProps) {
  const formattedStartDay = useMemo(
    () => format(dateRange[0], 'yyyy-MM-dd'),
    [dateRange]
  )
  const formattedEndDay = useMemo(
    () => format(dateRange[1], 'yyyy-MM-dd'),
    [dateRange]
  )

  return (
    <>
      <button
        popoverTarget="cally-popover1"
        className="input input-border"
        id="cally1"
        style={{ anchorName: '--cally1' }}
      >
        {formattedStartDay} / {formattedEndDay}
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
          value={`${formattedStartDay}/${formattedEndDay}`}
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
