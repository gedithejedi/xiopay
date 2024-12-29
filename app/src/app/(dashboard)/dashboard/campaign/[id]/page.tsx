import PageLayout from '@/components/organisms/PageLayout'
import Campaign from '@/components/campaignPage'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const campaignId = (await params).id

  return (
    <PageLayout title="Campaign" isLoading={false}>
      <Campaign id={campaignId} />
    </PageLayout>
  )
}
