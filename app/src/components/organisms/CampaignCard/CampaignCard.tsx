import type { CampaignCardProps } from './CampaignCard.types'
import Card from '@/components/atoms/Card'
import { FaRegUser, FaWallet } from 'react-icons/fa'
export default function CampaignCard({
  name,
  creator,
  balance,
  children,
}: CampaignCardProps) {
  return (
    <Card>
      <div className="flex justify-between ">
        <h2 className="text-2xl font-bold tracking-tight">
          {name || 'Campaign Name'}
        </h2>
        <div className="my-2 flex items-center gap-3 font-medium text-gray-500">
          <FaRegUser className="h-4 w-4" />
          <span className="text-sm">
            Created by: {creator || 'Unknown Creator'}
          </span>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-4 px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-base font-semibold">
            <FaWallet className="h-5 w-5" />
            <p>Balance</p>
            <p className="font-semibold">${balance || '0'}</p>
          </div>
        </div>
      </div>
      {children}
    </Card>
  )
}
