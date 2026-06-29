interface Props {
  rated: number
  total: number
}

export default function ProgressBar({ rated, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((rated / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{rated} of {total} rated this round</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
