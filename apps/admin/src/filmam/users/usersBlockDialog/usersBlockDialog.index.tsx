'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { startOfToday } from 'date-fns'
import { Ban, Timer } from 'lucide-react'
import { Api, TranslateServerError } from '@/scripts'
import {
  Button,
  Checkbox,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Spinner,
} from '@/utilities/components'

import {
  blockDurations,
  isUserBanned,
  PERMANENT_BLOCK_DURATION_MS,
} from '../users.data'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppApis } from '../../../data'
import { toast } from 'sonner'

type BlockableUser = {
  id: number | string
  username: string
  block_expires_at?: string | null
}

type UserBlockDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: BlockableUser[]
}

const toLocalTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const getEarliestBlockExpiry = (users: BlockableUser[]): Date | null => {
  let earliest: Date | null = null
  for (const user of users) {
    if (!user.block_expires_at) continue
    const candidate = new Date(user.block_expires_at)
    if (!earliest || candidate.getTime() < earliest.getTime()) {
      earliest = candidate
    }
  }
  return earliest
}

const formatCountdown = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  parts.push(`${String(hours).padStart(2, '0')}h`)
  parts.push(`${String(minutes).padStart(2, '0')}m`)
  parts.push(`${String(seconds).padStart(2, '0')}s`)
  return parts.join(' ')
}

export function UsersBlockDialog({
  open,
  onOpenChange,
  users,
}: UserBlockDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('')
  const [isPermanent, setIsPermanent] = useState(false)
  const [remainingMs, setRemainingMs] = useState<number | null>(null)

  const resetState = () => {
    setDate(undefined)
    setTime('')
    setIsPermanent(false)
  }

  const isMulti = users.length > 1
  const isBlocked =
    users.length > 0 &&
    users.every((user) => isUserBanned(user.block_expires_at ?? null))
  const blockExpiresAt = useMemo(
    () => (isBlocked ? getEarliestBlockExpiry(users) : null),
    [users, isBlocked]
  )

  useEffect(() => {
    if (!blockExpiresAt) return
    const target = blockExpiresAt.getTime()
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, target - Date.now()))
    }, 1000)
    return () => clearInterval(interval)
  }, [blockExpiresAt])

  const handlePresetClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const ms = Number(event.currentTarget.dataset.ms)
    const target = new Date(Date.now() + ms)
    setDate(target)
    setTime(toLocalTime(target))
    setIsPermanent(false)
  }

  const handleDateChange = (selected: Date | undefined) => {
    setDate(selected)
    if (selected) {
      setTime((prev) => prev || toLocalTime(new Date()))
    }
  }

  const buildExpiresAt = (): Date | null => {
    if (!date) return null
    const [hours, minutes] = time.split(':').map(Number)
    const expiresAt = new Date(date)
    if (Number.isInteger(hours)) {
      expiresAt.setHours(hours, minutes || 0, 0, 0)
    }
    return expiresAt
  }

  const onSuccessReset = (message: string) => {
    toast.success(message)
    resetState()
    onOpenChange(false)
    queryclient.invalidateQueries({ queryKey: ['users'] })
  }

  const { mutate: blockMutate, isPending: isBlocking } = useMutation({
    mutationFn: (expiresAt: Date) =>
      Api(AppApis.user.adminBan, {
        method: 'PUT',
        body: {
          users_ids: users.map((user) => Number(user.id)),
          block_expires_at: expiresAt.toISOString(),
        },
      }),
    onSuccess: () =>
      onSuccessReset(
        isMulti
          ? t('users.users_blocked', { count: users.length })
          : t('users.user_blocked')
      ),
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const { mutate: unblockMutate, isPending: isUnblocking } = useMutation({
    mutationFn: () =>
      Api(AppApis.user.adminBan, {
        method: 'PUT',
        body: {
          users_ids: users.map((user) => Number(user.id)),
          block_expires_at: null,
        },
      }),
    onSuccess: () =>
      onSuccessReset(
        isMulti
          ? t('users.users_unblocked', { count: users.length })
          : t('users.user_unblocked')
      ),
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const handleSubmit = () => {
    if (!isPermanent) {
      const expiresAt = buildExpiresAt()
      if (!expiresAt) {
        toast.error(t('users.block_date_time_required'))
        return
      }
      if (expiresAt.getTime() <= Date.now()) {
        toast.error(t('users.block_expires_in_past'))
        return
      }
      blockMutate(expiresAt)
      return
    }
    blockMutate(new Date(Date.now() + PERMANENT_BLOCK_DURATION_MS))
  }

  const handleUnblock = () => {
    unblockMutate()
  }

  const isSubmittingDisabled =
    isBlocking || isUnblocking || (!isPermanent && !date)

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        resetState()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            <Ban className='me-1 inline-block stroke-destructive' size={18} />{' '}
            {isMulti ? t('users.block_users') : t('users.block_user')}
          </DialogTitle>
          <DialogDescription>
            {isMulti
              ? t('users.block_users_desc', { count: users.length })
              : t('users.block_user_desc', { username: users[0]?.username })}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {isBlocked ? (
            <div className='flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2.5'>
              <Timer className='size-4 shrink-0 text-destructive' />
              <span className='text-sm font-medium'>
                {t('users.block_expires_in')}
              </span>
              <span
                dir='ltr'
                className='ms-auto font-mono text-sm font-semibold tabular-nums text-destructive'
              >
                {remainingMs === null ? '--' : formatCountdown(remainingMs)}
              </span>
            </div>
          ) : null}
          <div className='space-y-2'>
            <Label>{t('users.quick_durations')}</Label>
            <div className='flex flex-wrap gap-2'>
              {blockDurations.map((duration) => (
                <Button
                  key={duration.labelKey}
                  size='sm'
                  variant='outline'
                  type='button'
                  data-ms={duration.ms}
                  onClick={handlePresetClick}
                >
                  {t(duration.labelKey)}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Label className='w-28'>{t('users.block_date')}</Label>
              <DatePicker
                selected={date}
                onSelect={handleDateChange}
                placeholder={t('users.block_date')}
                disabled={(day) => day < startOfToday()}
              />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Label className='w-28'>{t('users.block_time')}</Label>
              <Input
                type='time'
                className='w-40'
                value={time}
                disabled={isPermanent}
                onChange={(e) => setTime(e.target.value)}
                aria-label={t('users.select_time')}
              />
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='permanent-block'
                checked={isPermanent}
                onCheckedChange={(checked) => setIsPermanent(!!checked)}
              />
              <Label htmlFor='permanent-block'>
                {t('users.permanent_block')}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          {isBlocked ? (
            <Button
              type='button'
              variant='outline'
              onClick={handleUnblock}
              disabled={isBlocking || isUnblocking}
            >
              {isUnblocking ? <Spinner /> : null} {t('users.unblock')}
            </Button>
          ) : null}
          <Button
            type='button'
            variant='destructive'
            onClick={handleSubmit}
            disabled={isSubmittingDisabled}
          >
            {isBlocking ? <Spinner /> : null} {t('users.confirm_block')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
