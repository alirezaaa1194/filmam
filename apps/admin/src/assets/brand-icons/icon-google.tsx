import { type SVGProps } from 'react'
import { Cn } from '@/scripts'
import iconGooglePng from './icon-google.png'

export function IconGoogle({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src={iconGooglePng}
      width='24'
      height='24'
      className={Cn('[&>path]:stroke-current', className)}
    />
  )
}
