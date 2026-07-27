import { useTranslation } from 'react-i18next'
import { Link, useSearch } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/utilities/components'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { t } = useTranslation()
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>{t('auth.sign_in')}</CardTitle>
          <CardDescription>
            Enter your email and password below to log into{' '}
            <br className='max-sm:hidden' /> your account. Don't have an
            account?{' '}
            <Link
              to='/sign-up'
              className='text-nowrap underline underline-offset-4 hover:text-primary'
            >
              {t('auth.sign_up')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
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
