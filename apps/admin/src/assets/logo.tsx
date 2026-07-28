import { type SVGProps } from 'react'
import { Cn } from '@/scripts'
import logoPic from '../../public/images/logo.jpg'

export function Logo({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src={logoPic}
      height='24'
      width='24'
      className={Cn('size-10', className)}
    />
  )
}
