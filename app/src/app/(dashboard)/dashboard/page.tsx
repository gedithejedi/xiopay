import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import Table from '@/components/organisms/Table'
import { TableColumn } from '@/components/organisms/Table/Table.types'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'

interface Transaction {
  id: string
  name: string
  balance: number
  time: string
}

const transactions: Transaction[] = [
  {
    id: '0x01',
    name: 'Campaign 1',
    balance: 100.5,
    time: '2023-06-01 10:30 AM',
  },
  {
    id: '0x02',
    name: 'Campaign 2',
    balance: 75.2,
    time: '2023-06-01 11:45 AM',
  },
  {
    id: '0x03',
    name: 'Campaign 3',
    balance: 200.0,
    time: '2023-06-01 1:15 PM',
  },
  {
    id: '0x04',
    name: 'Campaign 4',
    balance: 150.3,
    time: '2023-06-01 4:30 PM',
  },
]

const columns: TableColumn<Transaction>[] = [
  { header: 'Id', accessor: 'id' },
  {
    header: 'Name',
    accessor: 'name',
  },
  {
    header: 'Balance',
    accessor: 'balance',
    render: (value) => `${(value as number).toFixed(2)}`,
  },
  { header: 'Created at', accessor: 'time' },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col">
        <div className="flex gap-3 border-b border-gray-100 pb-5 mb-5">
          <Image src="/globe.svg" width={64} height={64} alt="profile icon" />

          <div className="flex gap-2 justify-between w-full items-center">
            <div className="flex flex-col">
              <p className="text-lg font-bold">Hi, Peter</p>
              <Link
                href="xionPay.xyz/gedtest"
                className="text-md hover:underline"
                target="_blank"
              >
                buymeacoffee.com/gedtest
              </Link>
            </div>
            <Button styling="secondary" className="flex gap-2">
              <HiOutlineDocumentDuplicate />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">Total earnings</p>
          <p className="text-5xl font-extrabold">$0</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <PageTitle>My Campaigns</PageTitle>
        <Table
          data={transactions}
          columns={columns}
          tableClassName=""
          headerClassName="text-foreground text-[14px] border-b"
          rowClassName=""
        />{' '}
      </Card>
    </div>
  )
}
