import { CampaignGuideProps } from './CampaignGuide.types'
import Collapse from '@/components/atoms/Collapse'

export default function CampaignGuide({ campaignId }: CampaignGuideProps) {
  return (
    <div className="flex flex-col gap-2">
      <Collapse title="How do I add campaign to my website?">
        <div className="flex flex-col gap-2 pl-4">
          <p className="mb-2">
            To add a campaign to your website, you need to follow these steps:
          </p>
          <ol className="list-decimal list-inside">
            <li>TODO: {campaignId}</li>
          </ol>
        </div>
      </Collapse>
    </div>
  )
}
