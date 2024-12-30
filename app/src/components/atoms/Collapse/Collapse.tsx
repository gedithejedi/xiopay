import { CollapseProps } from './Collapse.type'

export default function Collapse({ title, children }: CollapseProps) {
  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-base font-semibold">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  )
}
