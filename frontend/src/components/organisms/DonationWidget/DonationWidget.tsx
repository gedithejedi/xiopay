'use client'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DonateFormProps } from './DonationWidget.types'

function DonationWidget({
  isInCreate = false,
  title,
}: {
  isInCreate?: boolean
  title: string
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonateFormProps>({
    defaultValues: {
      amount: 0,
      name: '',
      description: '',
    },
  })
  const onSubmit: SubmitHandler<DonateFormProps> = (data) => {
    if (data.amount <= 0)
      return toast.error('Please enter an amount higher than 0.')

    if (isInCreate) return toast.success('Kaching! you have a new donation.')

    console.log(data)
  }

  const currentAmount = watch('amount')

  const increaseAmount = (amount: number) => {
    setValue('amount', Number(currentAmount || 0) + amount)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <button className="btn btn-accent">
            {currentAmount > 0 ? `Donate $${currentAmount}` : 'Support'}
          </button>
        </div>
      </form>
    </>
  )
}

export default DonationWidget
