'use client'

import classNames from 'classnames'

function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1 className={classNames('text-2xl font-bold mb-4', className)}>
      {children}
    </h1>
  )
}

export default PageTitle
