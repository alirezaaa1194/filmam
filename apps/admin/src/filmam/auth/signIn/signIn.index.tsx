import { AuthLayout } from '../authLayout/authLayout.index'
import { UserAuthForm } from './userAuthForm/userAuthForm.index'
import { useState } from 'react'
import { OtpForm } from '../otp/otpForm/otpForm.index'
import { useTimer } from '../../../hooks'

export function SignIn() {
  const [step, setStep] = useState<'Login' | 'Otp'>('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { timer, start, stop, reset } = useTimer(120)

  return (
    <AuthLayout>
      {step === 'Login' ? (
        <UserAuthForm
          setStep={setStep}
          setEmail={setEmail}
          setPassword={setPassword}
          start={start}
          />
        ) : (
          <OtpForm
          setStep={setStep}
          email={email}
          password={password}
          start={start}
          stop={stop}
          reset={reset}
          timer={timer}
        />
      )}
    </AuthLayout>
  )
}
