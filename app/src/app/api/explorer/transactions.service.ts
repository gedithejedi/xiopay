// import { NextResponse } from 'next/server'
// import dayjs from 'dayjs'
// import logger from '@/app/lib/logger'
// import { Chain } from 'viem'

import { Chain } from '@/app/lib/chains'

const getTransactions = async ({
  address,
  networks,
  // criterias,
}: {
  address: string
  networks: Chain[]
  // criterias?: Criteria[]
}) => {
  return undefined
}

// const indexTransactions = async ({
//   address,
//   networks,
// }: {
//   address: string
//   networks: Chain[]
// }) => {
//   const transactions = new Map<Chain, TransactionInterface[]>()

//   const cachedWallet: WalletInterface | null = await WalletSchema.findOne({
//     address,
//   })
//   let tempCachedWallet = cachedWallet
//     ? { transactions: cachedWallet.transactions, deltas: cachedWallet.deltas }
//     : {
//         transactions: {} as Record<Chain, string[]>,
//         deltas: {} as Record<Chain, number>,
//       }

//   for (let i = 0; i < networks.length; i++) {
//     const chainId = networks[i]

//     const allNewChainTransactions: TransactionInterface[] = []
//     let cursor = ''

//     do {
//       const { transactions, nextCursor } = await fetchTransactions(
//         chainId,
//         address,
//         cursor
//       )
//       let needsToFetchMore = false

//       if (
//         cachedWallet?.deltas &&
//         Object.keys(cachedWallet?.deltas).length > 0
//       ) {
//         const delta = cachedWallet.deltas[chainId]
//         const firstBlocknumber = transactions[0]?.block_number || 0

//         const lastBlocknumber =
//           transactions[transactions.length - 1]?.block_number || 0

//         const isFirstDeltaOutdated = delta
//           ? delta > Number(firstBlocknumber)
//           : false

//         if (!isFirstDeltaOutdated) {
//           logger.info(`No new transactions found for chain ${chainId}`)
//           cursor = ''
//           break
//         }

//         const isLastDeltaAlreadySaved = delta
//           ? Number(lastBlocknumber) < delta
//           : false

//         if (isLastDeltaAlreadySaved) {
//           const newTransactions = transactions.filter(
//             (tx: TransactionInterface) =>
//               Number(tx.block_number) > delta && !tx.possible_spam
//           )

//           logger.info(
//             `${newTransactions.length} new transactions found for chain ${chainId}`
//           )
//           allNewChainTransactions.push(...newTransactions)
//           cursor = ''
//           break
//         }
//       }

//       const filteredTransactions = transactions.filter(
//         (tx: TransactionInterface) => !tx.possible_spam
//       )
//       allNewChainTransactions.push(...filteredTransactions)
//       logger.info(
//         `Adding ${allNewChainTransactions.length} new transactions for chain ${chainId}`
//       )

//       cursor = needsToFetchMore ? nextCursor : ''
//     } while (cursor)

//     if (allNewChainTransactions.length > 0) {
//       transactions.set(chainId, allNewChainTransactions)

//       const newTransactions = allNewChainTransactions.map((transaction) => ({
//         ...transaction,
//         chainId,
//       }))

//       const transactionLog = {
//         ...(tempCachedWallet?.transactions || {}),
//         [chainId]: allNewChainTransactions?.map((tx) => tx.hash),
//       } as Record<Chain, string[]>

//       const deltasLog = {
//         ...(tempCachedWallet?.deltas || {}),
//         [chainId]: allNewChainTransactions[0]?.block_number,
//       } as Record<Chain, number>

//       await TransactionSchema.create(newTransactions)
//       logger.info(
//         `Added ${newTransactions.length} new transactions for chain ${chainId} as delta ${deltasLog[chainId]}`
//       )
//       await WalletSchema.findOneAndReplace(
//         { address },
//         {
//           address,
//           transactions: transactionLog,
//           deltas: deltasLog,
//           updatedAt: dayjs().unix(),
//         },
//         { upsert: true }
//       )

//       //Update tempCachedWallet so we can save the new transactions and deltas from last iteration
//       tempCachedWallet.transactions = transactionLog
//       tempCachedWallet.deltas = deltasLog
//     }
//   }

//   return tempCachedWallet
// }

// // export default { getTransactions, indexTransactions };
export default { getTransactions }
