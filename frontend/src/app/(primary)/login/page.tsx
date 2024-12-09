'use client'

import ConnectButton from '@/components/authentication/components/ConnectButton'
import { HiCheck } from 'react-icons/hi'
import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'

const introList = [
  'Create your campaigns within a few clicks',
  'Integrate in your website in minutes',
  'Withdraw funds whenever you want',
]

export default function Login() {
  return (
    <div className="flex h-full justify-center">
      <div className="grid grid-cols-2 mt-12 w-full gap-12">
        <div className="flex-1">
          <PageTitle>Join Xio Pay</PageTitle>
          <Card>
            <ul className="py-4 text-base space-y-4">
              {introList.map((intro) => (
                <li className="flex items-center gap-2" key={intro}>
                  <HiCheck className="fill-brand w-7 h-7" />
                  <span>{intro}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="flex-1">
          <PageTitle>Get started!</PageTitle>
          <Card className="py-12">
            <ConnectButton className="btn btn-accent">
              Connect to Xio Pay
            </ConnectButton>
          </Card>
        </div>
      </div>
    </div>
  )
}
