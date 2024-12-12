import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import Link from 'next/link'
import { HiOutlineFolder } from 'react-icons/hi'

export default function Campaigns() {
  return (
    <div>
      <PageTitle>Campaigns</PageTitle>

      <Card className="flex flex-col gap-2">
        <div className="text-center flex flex-col gap-1 items-center">
          <HiOutlineFolder className="text-4xl text-base-400" />
          <p className="text-lg font-semibold">
            You haven&apos;t added any widgets yet.
          </p>
          <p className="">
            Set one up in few easy steps, by clicking the button below
          </p>
        </div>
        <div className="flex justify-center w-full mt-2">
          <button className="btn btn-accent btn-sm">
            <Link href={'/dashboard/campaign/create'}>Create a campaign</Link>
          </button>
        </div>
      </Card>
    </div>
  )
}
