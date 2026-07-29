import { type SVGProps } from 'react'
import { Cn } from '@/scripts'

export function Logo({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src='/images/logo.jpg'
      height='24'
      width='24'
      className={Cn('size-10', className)}
    />
  )
}
