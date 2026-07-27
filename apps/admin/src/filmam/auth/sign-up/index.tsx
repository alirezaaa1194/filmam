import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/utilities/components'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const { t } = useTranslation()
  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.create_account')}
          </CardTitle>
          <CardDescription>
            Enter your email and password to create an account. <br />
            Already have an account?{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.sign_in')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            <span>{t('auth.sign_in_agree')}</span>{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.terms_of_service')}
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.privacy_policy')}
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
