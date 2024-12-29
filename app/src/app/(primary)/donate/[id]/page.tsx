import Donate from '@/modules/donate/routes/Donate/Donate'
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
