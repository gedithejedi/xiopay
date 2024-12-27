'use client'
import PageLayout from '@/components/organisms/PageLayout'
import DatePicker from '@/components/organisms/DatePicker'
import { useState } from 'react'
import { addDays, startOfDay } from 'date-fns'

export default function StatisticsPage() {
  const today = startOfDay(new Date())
  const startOfWeek = addDays(today, -7)
  const [dateRange, setDateRange] = useState<[Date, Date]>([startOfWeek, today])

  return (
    <PageLayout title="Statistics" isLoading={false}>
      <div className="bg-white flex items-center justify-center w-full h-full gap-2 rounded-lg">
        <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>
    </PageLayout>
  )
}
