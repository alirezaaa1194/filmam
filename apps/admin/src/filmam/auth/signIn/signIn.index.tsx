import { AuthLayout } from '../authLayout/authLayout.index'
import { useState } from 'react'
import { useTimer } from '../../../hooks'
import { SignInForm } from './signInForm/signInForm.index'
import { OtpForm } from './otpForm/otpForm.index'

export function SignIn() {
  const [step, setStep] = useState<'Login' | 'Otp'>('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { timer, start, stop, reset } = useTimer(120)

  return (
    <AuthLayout>
      {step === 'Login' ? (
        <SignInForm
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
