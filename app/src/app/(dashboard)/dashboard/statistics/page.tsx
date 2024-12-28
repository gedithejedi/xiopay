'use client'
import PageLayout from '@/components/organisms/PageLayout'
import DatePicker from '@/components/organisms/DatePicker'
import { useState, useMemo } from 'react'
import { addDays, startOfDay, eachDayOfInterval, format } from 'date-fns'
import Card from '@/components/atoms/Card'
import {
  Tooltip,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts'

// TODO: get actual campaign names
const campaignNames = ['Campaign 1', 'Campaign 2', 'Campaign 3']
function getMockData(dateRange: [Date, Date]) {
  const interval = eachDayOfInterval({
    start: dateRange[0],
    end: dateRange[1],
  })

  return interval.map((date) => ({
    date,
    amount: Math.floor(Math.random() * 1000),
    count: Math.floor(Math.random() * 100),
  }))
}

const dateFormat = 'MMM d, yyyy'
function tooltipLabelFormatter(label: any) {
  return format(new Date(label), dateFormat)
}

export default function StatisticsPage() {
  const today = startOfDay(new Date())
  const startOfWeek = addDays(today, -7)
  const [dateRange, setDateRange] = useState<[Date, Date]>([startOfWeek, today])
  const [selectedCampaign, setSelectedCampaign] = useState(campaignNames[0])
  const events = useMemo(() => getMockData(dateRange), [dateRange])

  return (
    <PageLayout title="Statistics" isLoading={false}>
      <div className=" w-full h-full flex flex-col gap-4">
        <div className="w-full flex justify-between">
          <label className="flex gap-1 w-full items-center font-semibold">
            <span>Donations for </span>
            <select
              className="select"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              {campaignNames.map((n, i) => (
                <option key={i}>{n}</option>
              ))}
            </select>
          </label>
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <div className="w-full grid grid-cols-1 gap-4">
          <Card>
            <div className="mb-2">
              <h2 className="text-xl font-bold">Total Amount</h2>
              <p className="text-sm text-gray-500">Total donations amount</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={events}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), dateFormat)}
                />
                <YAxis
                  dataKey="amount"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip labelFormatter={tooltipLabelFormatter} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div className="mb-2">
              <h2 className="text-xl font-bold">Total Count</h2>
              <p className="text-sm text-gray-500">Number of donations</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart width={730} height={250} data={events}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), dateFormat)}
                />
                <YAxis />
                <Tooltip labelFormatter={tooltipLabelFormatter} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
