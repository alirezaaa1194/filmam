import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/utilities/components'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { sectionFilterKeys } from '../headerMenus.data'
import type { HeaderMenuFilterItem } from '../headerMenus.type'

type FiltersEditorProps = {
  filters: HeaderMenuFilterItem[]
  onChange: (filters: HeaderMenuFilterItem[]) => void
}

export function FiltersEditor({ filters, onChange }: FiltersEditorProps) {
  const { t } = useTranslation()

  const updateFilter = (index: number, next: HeaderMenuFilterItem) => {
    onChange(filters.map((filter, i) => (i === index ? next : filter)))
  }

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index))
  }

  const addFilter = () => {
    onChange([...filters, { filter_key: 'SEARCH', filter_value: '' }])
  }

  return (
    <div className='col-span-6 space-y-2'>
      {filters.length === 0 && (
        <p className='rounded-md border border-dashed p-2 text-center text-xs text-muted-foreground'>
          {t('header_menus.no_filters_yet')}
        </p>
      )}
      {filters.map((filter, index) => (
        <div key={index} className='flex items-center gap-2'>
          <Select
            value={filter.filter_key}
            onValueChange={(value) =>
              updateFilter(index, {
                ...filter,
                filter_key: value as HeaderMenuFilterItem['filter_key'],
              })
            }
          >
            <SelectTrigger className='w-44'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sectionFilterKeys.map(({ labelKey, value }) => (
                <SelectItem key={value} value={value}>
                  {t(labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={filter.filter_value}
            onChange={(event) =>
              updateFilter(index, {
                ...filter,
                filter_value: event.target.value,
              })
            }
            placeholder={t('header_menus.filter_value_placeholder')}
            className='h-9 flex-1'
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-9 shrink-0 text-destructive hover:text-destructive'
            onClick={() => removeFilter(index)}
            aria-label={t('header_menus.remove_filter')}
            title={t('header_menus.remove_filter')}
          >
            <X className='size-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={addFilter}
        className='w-full'
      >
        <span className='me-1'>+</span> {t('header_menus.add_filter')}
      </Button>
    </div>
  )
}
