import PageTitle from '@/components/atoms/PageTitle'
import Spinner from '@/components/atoms/Spinner'

function PageLayout({
  title,
  isLoading,
  children,
  headerChildren,
  customHeader,
}: {
  title: string
  isLoading: boolean
  children: React.ReactNode
  headerChildren?: React.ReactNode
  customHeader?: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between mb-4">
        <PageTitle>{title}</PageTitle>
        {customHeader ? customHeader : ''}

        {headerChildren}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full bg-white rounded-lg">
          <Spinner className="w-10 h-10" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default PageLayout
