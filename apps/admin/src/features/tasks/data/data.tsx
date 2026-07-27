import i18n from '@/i18n'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: i18n.t('tasks_data.bug'),
  },
  {
    value: 'feature',
    label: i18n.t('tasks_data.feature'),
  },
  {
    value: 'documentation',
    label: i18n.t('tasks_data.documentation'),
  },
]

export const statuses = [
  {
    label: i18n.t('tasks_data.backlog'),
    value: 'backlog' as const,
    icon: HelpCircle,
  },
  {
    label: i18n.t('tasks_data.todo'),
    value: 'todo' as const,
    icon: Circle,
  },
  {
    label: i18n.t('tasks_data.in_progress'),
    value: 'in progress' as const,
    icon: Timer,
  },
  {
    label: i18n.t('tasks_data.done'),
    value: 'done' as const,
    icon: CheckCircle,
  },
  {
    label: i18n.t('tasks_data.canceled'),
    value: 'canceled' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: i18n.t('tasks_data.low'),
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: i18n.t('tasks_data.medium'),
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: i18n.t('tasks_data.high'),
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: i18n.t('tasks_data.critical'),
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
