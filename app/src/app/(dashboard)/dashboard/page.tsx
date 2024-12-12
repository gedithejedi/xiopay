import Card from '@/components/atoms/Card'
import Table from '@/components/organisms/Table'
import { TableColumn } from '@/components/organisms/Table/Table.types'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'

interface Transaction {
  id: number
  from: string
  amount: number
  time: string
  status: 'withdrawn' | 'pending'
}

const transactions: Transaction[] = [
  {
    id: 1,
    from: 'Alice',
    amount: 100.5,
    time: '2023-06-01 10:30 AM',
    status: 'withdrawn',
  },
  {
    id: 2,
    from: 'Bob',
    amount: 75.2,
    time: '2023-06-01 11:45 AM',
    status: 'pending',
  },
  {
    id: 3,
    from: 'Charlie',
    amount: 200.0,
    time: '2023-06-01 1:15 PM',
    status: 'withdrawn',
  },
  {
    id: 5,
    from: 'Eve',
    amount: 150.3,
    time: '2023-06-01 4:30 PM',
    status: 'withdrawn',
  },
]

const columns: TableColumn<Transaction>[] = [
  { header: 'From', accessor: 'from' },
  {
    header: 'Amount',
    accessor: 'amount',
    render: (value) => `$${(value as number).toFixed(2)}`,
  },
  { header: 'Time', accessor: 'time' },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => (
      <span
        className={`badge ${
          value === 'withdrawn' ? 'badge-success' : 'badge-warning'
        }`}
      >
        {value}
      </span>
    ),
  },
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
            <button className="btn btn-secondary rounded-full btn-md flex gap-2">
              <HiOutlineDocumentDuplicate />
              Copy Link
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">Earnings</p>
          <p className="text-5xl font-extrabold">$0</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Payout history</h3>
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
