import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode, useEffect, useState } from 'react'

type KpiCardProps = {
  title: string
  value: number
  icon: ReactNode
  colorClass: string
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const frameRate = 1000 / 60
    const totalFrames = Math.round(duration / frameRate)
    let frame = 0

    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const currentCount = value * progress
      setCount(currentCount)

      if (frame === totalFrames) {
        clearInterval(counter)
        setCount(value)
      }
    }, frameRate)

    return () => clearInterval(counter)
  }, [value])

  return (
    <span className="text-3xl font-bold text-foreground">
      {count.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}
    </span>
  )
}

export const KpiCard = ({ title, value, icon, colorClass }: KpiCardProps) => {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('h-6 w-6', colorClass)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <AnimatedCounter value={value} />
      </CardContent>
    </Card>
  )
}
