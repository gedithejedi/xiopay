'use client'
import PageLayout from '@/components/organisms/PageLayout'
import { useState } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Table from '@/components/organisms/Table'
import { TableColumn } from '@/components/organisms/Table/Table.types'
import { useForm } from 'react-hook-form'

interface PayoutFormData {
  amount: number
  // recipient: string
}

// TODO: get actual campaign names
const campaignNames = ['Campaign 1', 'Campaign 2', 'Campaign 3']
// TODO: get actual withdrawal history
const payoutHistory = [
  {
    id: 1,
    amount: 100,
    withdrawer: '0x123',
    receiver: '0x123',
    time: '2023-06-01 10:30 AM',
  },
  {
    id: 2,
    amount: 100,
    withdrawer: '0x123',
    receiver: '0x123',
    time: '2024-06-01 12:30 AM',
  },
]

const columns: TableColumn<(typeof payoutHistory)[number]>[] = [
  { header: 'Called by', accessor: 'withdrawer' },
  { header: 'To', accessor: 'receiver' },
  {
    header: 'Amount',
    accessor: 'amount',
    render: (value) => `$${(value as number).toFixed(2)}`,
  },
  { header: 'Time', accessor: 'time' },
]

export default function StatisticsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState(campaignNames[0])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayoutFormData>({
    defaultValues: {
      amount: 0,
    },
  })

  return (
    <PageLayout title="Payouts" isLoading={false}>
      <div className=" w-full h-full flex flex-col gap-4">
        <label className="flex gap-1 w-full items-center font-semibold">
          <span>Payout for </span>
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

        <Card className="flex flex-col gap-4">
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <div className="flex gap-4 ">
              <div>
                <label className="input input-bordered flex items-center gap-2 w-full">
                  Amount:
                  <input
                    {...register('amount', { required: true })}
                    type="text"
                    className="grow"
                    placeholder="0"
                  />
                </label>
                {errors.amount && (
                  <span className="text-xs text-error">
                    {errors.amount.message}
                  </span>
                )}
              </div>

              <Button
                styling="secondary"
                className="btn btn-accent"
                type="submit"
              >
                Payout
              </Button>
            </div>
          </form>
          <h2 className="text-xl font-bold">Payout History</h2>
          <Table
            data={payoutHistory}
            columns={columns}
            tableClassName=""
            headerClassName="text-foreground text-[14px] border-b"
            rowClassName=""
          />
        </Card>
      </div>
    </PageLayout>
  )
}
