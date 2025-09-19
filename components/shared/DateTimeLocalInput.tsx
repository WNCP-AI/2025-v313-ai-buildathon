'use client'

import * as React from 'react'

type Props = {
  name: string
  minDaysAhead?: number
  required?: boolean
  className?: string
}

export function DateTimeLocalInput({ name, minDaysAhead = 1, required = true, className }: Props) {
  const [minValue, setMinValue] = React.useState<string>('')

  React.useEffect(() => {
    const ms = Date.now() + minDaysAhead * 24 * 60 * 60 * 1000
    const d = new Date(ms)
    // Adjust to local timezone for datetime-local expected value
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    setMinValue(d.toISOString().slice(0, 16))
  }, [minDaysAhead])

  return (
    <input
      className={className}
      type="datetime-local"
      name={name}
      min={minValue || undefined}
      required={required}
    />
  )
}


