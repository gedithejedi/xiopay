import Donate from '@/components/donatePage/Donate'
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const campaignId = (await params).id

  return (
    <div className="flex w-full justify-center">
      <Donate campaignId={campaignId} />
    </div>
  )
}
