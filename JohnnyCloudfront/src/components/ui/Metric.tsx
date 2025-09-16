
interface MetricProps {
  label: string
  value: number | string
  sub?: string
}

export function Metric({ label, value, sub }: MetricProps) {
  return (
    <div>
      <div className="text-sm text-jc-dim mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-jc-dim">{sub}</div>}
    </div>
  )
}
