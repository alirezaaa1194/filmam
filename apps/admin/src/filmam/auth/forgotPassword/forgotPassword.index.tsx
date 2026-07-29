import { AuthLayout } from '../authLayout/authLayout.index'
import { ForgotPasswordForm } from './forgotPasswordForm/forgotPasswordForm.index'
import { useState } from 'react'
import { useTimer } from '../../../hooks'
import { PageTitle } from '@/utilities/components'
import { OtpForm } from './otpForm/otpForm.index'

export function ForgotPassword() {
  const [step, setStep] = useState<'Email' | 'Otp'>('Email')
  const [email, setEmail] = useState('')
  const { timer, start, stop, reset } = useTimer(120)
  return (
    <AuthLayout>
      <PageTitle titleKey='forgot_password' />
      {step === 'Email' ? (
        <ForgotPasswordForm
          setStep={setStep}
          setEmail={setEmail}
          start={start}
        />
      ) : (
        <OtpForm
          setStep={setStep}
          email={email}
          start={start}
          stop={stop}
          reset={reset}
          timer={timer}
        />
      )}
    </AuthLayout>
  )
}
