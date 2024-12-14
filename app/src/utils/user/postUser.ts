import axios from 'axios'

export const postUser = async ({
  dynamicUserId,
}: {
  dynamicUserId: string
}) => {
  try {
    if (!dynamicUserId) throw new Error('No id provided.')

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`
    const data = { dynamicUserId }
    const headers = { 'Content-Type': 'application/json' }

    const response = await axios.post(apiUrl, data, { headers })

    return response
  } catch (error: any) {
    console.error(error)
    throw error
  }
}
