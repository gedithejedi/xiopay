'use client'

import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import DonationWidget from '@/components/organisms/DonationWidget'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

interface CreateWidgetProps {
  title: string
  recipient: string
}

export default function Home() {
  const { address } = useAccount()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateWidgetProps>({
    defaultValues: {
      title: 'My new campaign',
      recipient: address,
    },
  })

  const campaignTitle = watch('title')

  const onSubmit: SubmitHandler<CreateWidgetProps> = (data) => {
    console.log(data)
  }

  return (
    <div>
      <PageTitle>Create a Campaign</PageTitle>

      <div className="flex flex-col gap-6">
        <div>
          <span className="text-lg">Create widget:</span>
          <Card>
            <div className="flex gap-6 w-full flex-col">
              <div className="flex-1 pb-4">
                <form onSubmit={handleSubmit(onSubmit)}>
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

                    <div>
                      <label className="input input-bordered flex items-center gap-2">
                        <input
                          disabled
                          {...register('recipient', { required: false })}
                          type="text"
                          className="grow"
                          placeholder="Recipient wallet address"
                        />
                      </label>
                    </div>

                    <button className="btn btn-accent">Create widget</button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <span className="text-lg">Preview:</span>
          <Card>
            <DonationWidget isInCreate={true} title={campaignTitle} />
          </Card>
        </div>
      </div>
    </div>
  )
}
