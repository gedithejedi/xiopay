'use client'

import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import DonationWidget from '@/components/organisms/DonationWidget'
import { createCampaign } from '@/utils/transactions'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import campaignAbi from '@/constants/abi/campaign.json'
import { Abi } from 'viem'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'

interface CreateWidgetFormData {
  title: string
  // recipient: string
}

export default function Home() {
  const { chain } = useAccount()
  const chainId = chain?.id || ''

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateWidgetFormData>({
    defaultValues: {
      title: 'My new campaign',
    },
  })

  const campaignTitle = watch('title')

  const { mutate: onCreate, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateWidgetFormData) => {
      if (!chainId) {
        return toast.error('Something went wrong while processing.')
      }
      if (!data.title) {
        return toast.error('Title is required')
      }

      const contractAddress = getCampaignDeploymentAddress(chainId)

      try {
        const receipt = await createCampaign({
          contractAddress,
          name: data.title,
          abi: campaignAbi as Abi,
        })

        console.log(receipt)
        return
      } catch (error) {
        toast.error('Something went wrong while unwrapping.')
        console.error(error)
        return
      }
    },
  })

  return (
    <div>
      <PageTitle>Create a Campaign</PageTitle>

      <div className="flex flex-col gap-6">
        <div>
          <span className="text-lg">Create widget:</span>
          <Card>
            <div className="flex gap-6 w-full flex-col">
              <div className="flex-1 pb-4">
                <form onSubmit={handleSubmit((data) => onCreate(data))}>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="input input-bordered flex items-center gap-2">
                        <input
                          {...register('title', { required: false })}
                          type="text"
                          className="grow"
                          placeholder="Campaign name"
                        />
                      </label>
                      {errors.title && (
                        <span className="text-xs text-error">
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    {/* <div>
                      <label className="input input-bordered flex items-center gap-2">
                        <input
                          disabled
                          {...register('recipient', { required: false })}
                          type="text"
                          className="grow"
                          placeholder="Recipient wallet address"
                        />
                      </label>
                    </div> */}

                    <button className="btn btn-accent">
                      {isCreating ? 'Creating...' : 'Create widget'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <span className="text-lg">Preview:</span>
          <Card>
            <DonationWidget
              isInCreate={true}
              title={campaignTitle}
              campaignId={'ID'}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
