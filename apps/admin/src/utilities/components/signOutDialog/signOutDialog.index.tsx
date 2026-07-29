import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { useUserStore } from '@/stores'
import { ConfirmDialog } from '@/utilities/components'
import { useMutation } from '@tanstack/react-query'
import { AppApis } from '@/data'
import { Api, RemoveCookie, TranslateServerError } from '@/scripts'
import { ApiErrorType, MessageType } from '@/types'
import { toast } from 'sonner'
interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useUserStore()

  const { mutate, isPending } = useMutation({
    mutationFn: () => Api<MessageType>(AppApis.auth.logout, { method: 'POST' }),
    onSuccess: () => {
      setUser(null)

      RemoveCookie('accessToken')
      RemoveCookie('refreshToken')

      toast.success(t('profile.sign_out_success'))

      navigate({
        to: '/sign-in',
        replace: true,
      })
    },
    onError: (response: ApiErrorType) => {
      toast.error(t(TranslateServerError(response.errors[0].status)))
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('profile.sign_out_title')}
      desc={t('profile.sign_out_desc')}
      confirmText={t('profile.sign_out_title')}
      destructive
      handleConfirm={mutate}
      className='sm:max-w-sm'
      isLoading={isPending}
    />
  )
}
