'use client'
import currency from 'currency.js'
import PageLayout from '@/components/organisms/PageLayout'
import DatePicker from '@/components/organisms/DatePicker'
import { useState, useMemo, useEffect } from 'react'
import {
  addDays,
  startOfDay,
  eachDayOfInterval,
  format,
  endOfDay,
  getUnixTime,
  fromUnixTime,
} from 'date-fns'
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
import { useGetCampaigns } from '@/utils/campaign/getCampaigns'
import { useGetDonationEventsByCampaignId } from '@/utils/donationEvent/getDonationEventsByCampaignId'
import { useAccount } from 'wagmi'
import { DEFAULT_CHAIN_ID } from '@/app/lib/chains'
import Spinner from '@/components/atoms/Spinner'
import { formatEther } from 'viem'

interface DonationEvent {
  timestamp: number
  amount: number
  count: number
}

function LoadingChart() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-30 bg-white/50">
      <Spinner className="w-10 h-10" />
    </div>
  )
}

const dateFormat = 'MMM d, yyyy'
function tooltipLabelFormatter(label: number) {
  return format(new Date(fromUnixTime(label)), dateFormat)
}

export default function StatisticsPage() {
  const today = startOfDay(new Date())
  const startOfWeek = addDays(today, -7)
  const [dateRange, setDateRange] = useState<[Date, Date]>([startOfWeek, today])
  const [selectedCampaign, setSelectedCampaign] = useState<string | undefined>(
    undefined
  )
  const { chain, address } = useAccount()
  const chainId = chain?.id || DEFAULT_CHAIN_ID

  const { data: campaignData, isLoading: isLoadingCampaigns } = useGetCampaigns(
    {
      creator: address || '',
      chainId,
    }
  )
  const { data: donationEvents, isLoading: isLoadingDonationEvents } =
    useGetDonationEventsByCampaignId({
      chainId,
      campaignId: selectedCampaign,
      filters: selectedCampaign
        ? {
            startsAt: getUnixTime(startOfDay(dateRange[0])),
            endsAt: getUnixTime(endOfDay(dateRange[1])),
          }
        : undefined,
    })

  const events = useMemo(() => {
    const defaultEvents: Record<number, DonationEvent> = eachDayOfInterval({
      start: dateRange[0],
      end: dateRange[1],
    }).reduce(
      (acc, date) => {
        const unixDate = getUnixTime(date)
        acc[unixDate] = {
          timestamp: unixDate,
          amount: 0,
          count: 0,
        }
        return acc
      },
      {} as Record<number, DonationEvent>
    )

    if (!donationEvents) return defaultEvents

    return donationEvents.reduce((acc, event) => {
      const date = getUnixTime(startOfDay(fromUnixTime(event.timestamp)))
      acc[date] = {
        timestamp: date,
        count: (acc[date]?.count || 0) + 1,
        amount: currency(acc[date]?.amount || 0).add(formatEther(event.amount))
          .value,
      }
      return acc
    }, defaultEvents)
  }, [donationEvents, dateRange])

  const campaignOptions =
    campaignData?.map((campaign) => ({
      label: campaign.name,
      value: campaign.campaignId,
    })) ?? []

  useEffect(() => {
    if (campaignOptions.length > 0 && !selectedCampaign) {
      setSelectedCampaign(campaignOptions[0].value)
    }
  }, [campaignOptions])

  return (
    <PageLayout title="Statistics" isLoading={isLoadingCampaigns}>
      <div className=" w-full h-full flex flex-col gap-4">
        <div className="w-full flex justify-between">
          <label className="flex gap-1 w-full items-center font-semibold">
            <span>Donations for </span>
            <select
              className="select"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              {campaignOptions.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <div className="w-full grid grid-cols-1 gap-4">
          <Card>
            {isLoadingDonationEvents && <LoadingChart />}

            <div className="mb-2">
              <h2 className="text-xl font-bold">Total Amount</h2>
              <p className="text-sm text-gray-500">Total donations amount</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={Object.values(events)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(date) =>
                    format(fromUnixTime(date), dateFormat)
                  }
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
            {isLoadingDonationEvents && <LoadingChart />}

            <div className="mb-2">
              <h2 className="text-xl font-bold">Total Count</h2>
              <p className="text-sm text-gray-500">Number of donations</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart width={730} height={250} data={Object.values(events)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(date) =>
                    format(fromUnixTime(date), dateFormat)
                  }
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
