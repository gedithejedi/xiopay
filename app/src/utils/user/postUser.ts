import axios from 'axios'

export const postUser = async ({
  dynamicUserId,
}: {
  dynamicUserId: string
}) => {
  try {
    if (!dynamicUserId) throw new Error('No id provided.')

    const apiUrl = `/api/user/${dynamicUserId}`
    const headers = { 'Content-Type': 'application/json' }

    const response = await axios.post(apiUrl, { headers })

    return response
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
