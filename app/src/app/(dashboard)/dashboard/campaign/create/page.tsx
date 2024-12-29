'use client'

import Card from '@/components/atoms/Card'
import PageLayout from '@/components/organisms/PageLayout'
import { createCampaign } from '@/utils/transactions'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import campaignAbi from '@/constants/abi/campaign.json'
import { Abi } from 'viem'
import { useGetCampaigns } from '@/utils/campaign/getCampaigns'
import { Chain } from '@/app/lib/chains'
import Button from '@/components/atoms/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useIndexCampaigns from '@/utils/campaign/indexCampaign'
import { queryClient } from '@/components/authentication/AuthContextProvider/AuthContextProvider'

interface CreateWidgetFormData {
  title: string
  // recipient: string
}

export default function Home() {
  const { chain, address } = useAccount()
  const chainId = chain?.id

  const [isDeployed, setIsDeployed] = useState(false)

  const { data: campaignData } = useGetCampaigns({
    creator: address || '',
    chainId: chainId || Chain.NEOX_TESTNET,
  })

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWidgetFormData>({
    defaultValues: {
      title: 'My new campaign',
    },
  })

  const { mutate: forceReindex, isPending: isReindexing } = useIndexCampaigns()

  const { mutate: onCreate, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateWidgetFormData) => {
      if (!chainId) {
        return toast.error('Something went wrong while processing.')
      }
      if (!data.title) {
        return toast.error('Title is required')
      }

      if (
        !!campaignData &&
        campaignData.length > 0 &&
        campaignData.find((c) => c.name === data.title)
      ) {
        return toast.error('Campaign with this name already exists')
      }

      try {
        const receipt = await createCampaign({
          chainId,
          name: data.title,
          abi: campaignAbi as Abi,
        })

        if (!receipt) {
          toast.error('Something went wrong while creating the campaign.')
          return
        }

        const topic =
          '0xc45b06cdba4c6571442bc66a5f531757b478e6a049b3c25a8418919893769f06'

        const log = receipt.logs.find((log) => {
          if (log.topics[0] === topic) {
            return true
          }

          return false
        })

        if (!log) {
          toast.error('Something went wrong while creating the campaign.')
          return
        }

        const campaignId = log.topics[1]

        forceReindex({
          chainId: Chain.NEOX_TESTNET,
        })

        await queryClient.invalidateQueries({
          queryKey: ['campaign', chainId, address],
        })

        setIsDeployed(true)

        router.push(`/dashboard/campaign/${campaignId}`)

        return
      } catch (error) {
        toast.error('Something went wrong while unwrapping.')
        console.error(error)
        return
      }
    },
  })

  return (
    <PageLayout title="Create a Campaign" isLoading={false}>
      <div className="flex flex-col gap-6">
        <div>
          <Card>
            <div className="flex gap-6 w-full flex-col">
              <div className="flex-1 pb-4">
                <form onSubmit={handleSubmit((data) => onCreate(data))}>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="input input-bordered flex items-center gap-2 w-full">
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

                    <Button
                      styling="secondary"
                      className="btn btn-accent"
                      disabled={isDeployed}
                      loading={isCreating || isDeployed}
                      type="submit"
                    >
                      {isCreating || isReindexing
                        ? 'Creating...'
                        : isDeployed
                          ? 'Campaign created'
                          : 'Create widget'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
