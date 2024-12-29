import { z } from 'zod'
import { chainsInString } from '@/app/lib/chains'

export const chainIdSchema = z
  .enum(chainsInString)
  .transform((chainId) => Number(chainId))

export const chainIdObjectSchema = z.object({
  chainId: chainIdSchema,
})

export type ChainIdObject = z.infer<typeof chainIdObjectSchema>
