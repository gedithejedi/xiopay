'use client'
import currency from 'currency.js'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import Table from '@/components/organisms/Table'
import { TableColumn } from '@/components/organisms/Table/Table.types'
import Link from 'next/link'
import {
  HiOutlineUser,
  HiOutlineUserCircle,
  HiOutlineDocumentDuplicate,
  HiOutlinePencil,
} from 'react-icons/hi'
import { useGetCampaigns } from '@/utils/campaign/getCampaigns'
import { useAccount } from 'wagmi'
import { DEFAULT_CHAIN_ID } from '@/app/lib/chains'
import { CampaignInterface } from '@/../db/models/campaign-model'
import { formatEther } from 'viem'
import { fromUnixTime, format } from 'date-fns'

const dateFormat = 'MMM d, yyyy'

const columns: TableColumn<CampaignInterface>[] = [
  {
    header: 'Name',
    accessor: 'name',
  },
  {
    header: 'Balance',
    accessor: 'balance',
    render: (value) => `$ ${formatEther(value as bigint)}`,
  },
  // TODO: check if this is the correct field
  {
    header: 'Created at',
    accessor: 'updatedAt',
    render: (value) => format(fromUnixTime(value as number), dateFormat),
  },
  {
    header: '',
    accessor: 'campaignId',
    render: (campaignId) => (
      <Button styling="tertiary">
        <Link href={`/dashboard/campaign/${campaignId}`}>Details</Link>
      </Button>
    ),
  },
]

function Empty() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex items-center gap-2">
        <p className="font-semibold">
          GM! Let&apos;s create your first campaign today
        </p>
        <HiOutlinePencil className="text-lg" />
      </div>
      <Link href="/dashboard/campaign/create">
        <Button styling="primary" className="mt-4">
          Create Campaign
        </Button>
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const { chain, address } = useAccount()
  const chainId = chain?.id || DEFAULT_CHAIN_ID
  const { data: campaignData, isLoading: isLoadingCampaigns } = useGetCampaigns(
    {
      creator: address || '',
      chainId,
    }
  )
  const totalAmount =
    campaignData?.reduce((acc, campaign) => {
      return acc.add(formatEther(campaign.balance))
    }, currency(0)) ?? currency(0)

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-5">
          <HiOutlineUserCircle className="text-7xl" />
          <div className="flex gap-2 justify-between w-full items-center">
            <div className="flex flex-col">
              <p className="text-lg font-bold">Hi, 0x123...456</p>
              <Link
                href="xionPay.xyz/gedtest"
                className="text-md hover:underline"
                target="_blank"
              >
                buymeacoffee.com/gedtest
              </Link>
            </div>
            <div className="flex gap-2">
              <Button styling="tertiary" className="flex gap-2">
                <HiOutlineDocumentDuplicate />
                Copy Link
              </Button>
              <Button styling="secondary" className="flex gap-2">
                <HiOutlineUser />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">Total earnings</p>
          <p className="text-5xl font-extrabold">{totalAmount.format()}</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <PageTitle>My Campaigns</PageTitle>
        {!isLoadingCampaigns && !campaignData?.length ? (
          <Empty />
        ) : (
          <Table
            data={campaignData ?? []}
            columns={columns}
            tableClassName=""
            headerClassName="text-foreground text-[14px] border-b"
            rowClassName=""
            isLoading={isLoadingCampaigns}
          />
        )}
      </Card>
    </div>
  )
}
