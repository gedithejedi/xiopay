'use client'

import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DonateFormData } from './DonationWidget.types'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import {
  getCampaignDeploymentAddress,
  getTokenAddress,
} from '@/constants/contract/deployAddresses'
import { donateToCampaign, getPermit } from '@/utils/transactions'
import { Abi, parseEther } from 'viem'
import Button from '@/components/atoms/Button'
import CampaignAbi from '@/constants/abi/campaign.json'

function DonationWidget({
  isDemoMode = false,
  title,
  campaignId,
}: {
  isDemoMode?: boolean
  title: string
  campaignId: string
}) {
  const { chain, address } = useAccount()
  const chainId = chain?.id || ''

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonateFormData>({
    defaultValues: {
      amount: 0,
      name: '',
      description: '',
    },
  })

  const { mutate: onDonate, isPending: isDonating } = useMutation({
    mutationFn: async (data: DonateFormData) => {
      if (!chainId || !address) {
        return toast.error('Something went wrong while processing.')
      }

      if (data.amount <= 0)
        return toast.error('Please enter an amount higher than 0.')

      const rawAmount = data.amount

      if (!rawAmount) return toast.error('Please enter an amount to donate.')

      const contractAddress = getCampaignDeploymentAddress(chainId)
      const tokenAddress = getTokenAddress(chainId)

      const amount = parseEther(rawAmount.toString())

      if (isDemoMode) return toast.success('Kaching! you have a new donation.')

      const permit = await getPermit({
        chainId,
        tokenAddress,
        account: address, // User address
        toAddress: contractAddress, // Donation contract address
        amount,
      })

      if (!permit) {
        return toast.error(
          'Something went wrong while signing the donation transaction.'
        )
      }

      try {
        const res = await donateToCampaign({
          amount,
          contractAddress,
          campaignId,
          abi: CampaignAbi as Abi,
          permit,
        })

        console.log(res)
        return res
      } catch (error) {
        toast.error('Something went wrong while processing donation.')
        console.error(error)
        return
      }
    },
  })

  const currentAmount = watch('amount')

  const increaseAmount = (amount: number) => {
    setValue('amount', Number(currentAmount || 0) + amount)
  }

  return (
    <>
      <form onSubmit={handleSubmit((data) => onDonate(data))}>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl mb-3 font-bold">{title}</h2>
            <label className="input input-bordered flex items-center gap-2">
              <span>$</span>
              <input
                type="number"
                step="any"
                {...register('amount', {
                  required: 'Please enter a valid amount.',
                  valueAsNumber: true,
                })}
                className="grow"
                placeholder="Enter amount"
              />
              <span
                className="badge badge-default badge-outline hover:bg-base-300 cursor-pointer"
                onClick={() => increaseAmount(1)}
              >
                +1$
              </span>
              <span
                className="badge badge-default badge-outline hover:bg-base-300 cursor-pointer"
                onClick={() => increaseAmount(2)}
              >
                +2$
              </span>
              <span
                className="badge badge-default badge-outline hover:bg-base-300 cursor-pointerg"
                onClick={() => increaseAmount(5)}
              >
                +5$
              </span>
            </label>
            {errors.amount && (
              <span className="text-xs text-error">
                {errors.amount.message}
              </span>
            )}
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <input
              {...register('name', { required: false })}
              type="text"
              className="grow"
              placeholder="Name"
            />
          </label>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                cols={50}
                className="textarea textarea-bordered textarea-md text-[16px] pt-2"
                placeholder="Say something nice..."
              ></textarea>
            )}
          />
          <Button styling="primary" loading={isDonating} type="submit">
            {isDonating
              ? 'Donating...'
              : currentAmount > 0
                ? `Donate $${currentAmount}`
                : 'Support'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default DonationWidget
