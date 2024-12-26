import { HiOutlineClock } from 'react-icons/hi'
import PageLayout from '@/components/organisms/PageLayout'

export default function StatisticsPage() {
  return (
    <PageLayout title="Statistics" isLoading={false}>
      <div className="bg-white flex items-center justify-center w-full h-full gap-2 rounded-lg">
        <h3 className="text-2xl font-bold">Coming Soon</h3>
        <HiOutlineClock className="text-4xl" />
      </div>
    </PageLayout>
  )
}
