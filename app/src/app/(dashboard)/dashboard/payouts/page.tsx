'use client'
import PageLayout from '@/components/organisms/PageLayout'
import { useMemo, useState } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Table from '@/components/organisms/Table'
import { TableColumn } from '@/components/organisms/Table/Table.types'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getCampaigns } from '@/utils/campaign/getCampaigns'
import { Abi, formatEther, parseEther } from 'viem'
import { useAccount } from 'wagmi'
import { Chain } from '@/app/lib/chains'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import CampaignAbi from '@/constants/abi/campaign.json'
import { withdrawCampaign } from '@/utils/transactions'
import useIndexCampaigns from '@/utils/campaign/indexCampaign'

interface PayoutFormData {
  amount: number
}

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
  const { address, chain } = useAccount()
  const creator = address || ''
  const chainId = chain?.id || Chain.NEOX_TESTNET

  const [selectedCampaign, setSelectedCampaign] = useState<string>('')

  const { mutate: forceReindex, isPending: isReindexing } = useIndexCampaigns()

  const { data: campaignData, isLoading } = useQuery({
    queryKey: ['campaign', creator, chainId],
    queryFn: async () => {
      try {
        const campaigns = await getCampaigns({
          creator,
          chainId,
        })

        const formattedCamaigns = campaigns?.map((campaign) => ({
          ...campaign,
          balance: formatEther(campaign.balance),
        }))

        setSelectedCampaign(formattedCamaigns[0].campaignId)
        return formattedCamaigns
      } catch (error: unknown) {
        console.error(error)
        return []
      }
    },
    enabled: !!creator,
  })

  const hasCampaigns = campaignData?.length === 0

  const grantsMapping = useMemo(() => {
    if (!campaignData || campaignData.length < 1) return {}

    return campaignData.reduce(
      (acc, campaign) => {
        acc[campaign.campaignId] = campaign
        return acc
      },
      {} as Record<string, (typeof campaignData)[number]>
    )
  }, [campaignData])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayoutFormData>({
    defaultValues: {
      amount: 0,
    },
  })

  const { mutate: onWithdraw, isPending: isWithdrawing } = useMutation({
    mutationFn: async (data: PayoutFormData) => {
      if (!campaignData)
        return toast.error('Something went wrong while processing.')
      if (!chainId || !address) {
        return toast.error('Something went wrong while processing.')
      }

      const rawAmount = data?.amount
      if (!rawAmount) return toast.error('Please enter an amount to donate.')

      if (rawAmount <= 0)
        return toast.error('Please enter an amount higher than 0.')

      const campaign = grantsMapping[selectedCampaign]
      const amount = parseEther(rawAmount.toString())

      if (amount > parseEther(campaign.balance)) {
        return toast.error(
          'Insufficient balance. Claiming more than available.'
        )
      }

      if (chainId !== campaign.chainId) {
        return toast.error('Invalid chain')
      }

      try {
        const res = await withdrawCampaign({
          amount,
          contractAddress: campaign.contractAddress,
          campaignId: campaign.campaignId,
          abi: CampaignAbi as Abi,
        })

        forceReindex({
          chainId: campaign.chainId,
        })

        reset({
          amount: 0,
        })

        return res
      } catch (error) {
        toast.error('Something went wrong while processing donation.')
        console.error(error)
        return
      }
    },
  })

  return (
    <PageLayout title="Payouts" isLoading={false}>
      <div className="w-full h-full flex flex-col">
        <Card className="flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Withdraw funds</h2>

            <form onSubmit={handleSubmit((data) => onWithdraw(data))}>
              <div className="flex gap-4">
                <div className="flex gap-3 w-full items-end">
                  <div className="flex items-end w-[300px]">
                    <label className="flex flex-col w-full items-start">
                      <span className="text-sm">From</span>
                      <select
                        disabled={
                          isLoading ||
                          hasCampaigns ||
                          isWithdrawing ||
                          isReindexing
                        }
                        className={classNames('select select-bordered')}
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                      >
                        {campaignData?.map(({ name, campaignId }, i) => (
                          <option key={i} value={campaignId}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex gap-2 items-end">
                    <div>
                      <span className="text-sm">
                        Available:{' $'}
                        {grantsMapping[selectedCampaign]?.balance || '0'}
                      </span>
                      <label className="input input-bordered flex items-center gap-2 w-full">
                        $
                        <input
                          disabled={isLoading || isWithdrawing || isReindexing}
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
                      disabled={
                        isLoading ||
                        isWithdrawing ||
                        hasCampaigns ||
                        isReindexing
                      }
                      styling="secondary"
                      className="btn btn-accent h-full"
                      type="submit"
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold">Payout History</h2>
            <Table
              data={payoutHistory}
              columns={columns}
              tableClassName=""
              headerClassName="text-foreground text-[14px] border-b"
              rowClassName=""
            />
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}
