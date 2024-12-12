'use client'

import classnames from 'classnames'

function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={classnames(
        'card card-compact bg-base-100 shadow-sm p-6',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
