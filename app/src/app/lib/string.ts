export const formatHash = (
  hash: string,
  first: number = 4,
  last: number = 6
): string | undefined => {
  if (!hash) return
  return `0x${hash.slice(2, first)}...${hash.slice(-last)}`
}
