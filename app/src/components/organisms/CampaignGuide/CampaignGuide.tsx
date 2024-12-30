'use client'

import { CampaignGuideProps } from './CampaignGuide.types'
import Collapse from '@/components/atoms/Collapse'
import { CopyBlock, dracula } from 'react-code-blocks'

function createAddTestBlock(campaignUrl: string) {
  return `<div style="width: 600px; height: 600px;">
    <iframe 
      src="${campaignUrl}" 
      width="100%" 
      height="100%"
      style="border: none;"
    ></iframe>
</div>`
}

export default function CampaignGuide({ campaignId }: CampaignGuideProps) {
  const campaignUrl = `${window.location.origin}/donate/${campaignId}`

  return (
    <div className="flex flex-col gap-2">
      <Collapse title="How do I add campaign to my website?">
        <div className="flex flex-col gap-2 pl-4">
          <p className="mb-2">
            To add a campaign to your website, please add the following code to
            your website!
          </p>
          <CopyBlock
            customStyle={{ width: '600px' }}
            language="html"
            text={createAddTestBlock(campaignUrl)}
            codeBlock
            theme={dracula}
            showLineNumbers={false}
          />
        </div>
      </Collapse>
    </div>
  )
}
