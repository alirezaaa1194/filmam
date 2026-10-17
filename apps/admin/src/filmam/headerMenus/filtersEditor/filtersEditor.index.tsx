import {
  Button,
  AsyncSelect,
  type AsyncSelectApi,
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
import { countriesSelectApi, genresSelectApi, languagesSelectApi, tagsSelectApi } from '../../movies/movies.data'
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

  const entityFilterConfig: Record<string, { api: AsyncSelectApi<any>; id: (item: any) => string; label: (item: any) => string }> = {
    GENRES: { api: genresSelectApi, id: (item) => item.slug, label: (item) => item.name },
    COUNTRIES: { api: countriesSelectApi, id: (item) => item.code, label: (item) => item.label },
    TAGS: { api: tagsSelectApi, id: (item) => item.slug, label: (item) => item.label },
    LANGUAGES: { api: languagesSelectApi, id: (item) => item.code, label: (item) => item.label },
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
                filter_value: '',
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
          {filter.filter_key in entityFilterConfig ? (() => {
            const config = entityFilterConfig[filter.filter_key]
            return <AsyncSelect
              className='h-9 flex-1'
              queryKey={['header-menus', 'filter-values', filter.filter_key]}
              api={config.api}
              getOptionId={config.id}
              getOptionLabel={config.label}
              value={filter.filter_value ? [filter.filter_value] : []}
              onValueChange={(values) => updateFilter(index, { ...filter, filter_value: values[0] ?? '' })}
              placeholder={t('header_menus.filter_value_placeholder')}
              searchPlaceholder={t('header_menus.filter_value_placeholder')}
            />
          })() : filter.filter_key === 'TYPE' || filter.filter_key === 'AGE_LIMITS' ? <Select
            value={filter.filter_value}
            onValueChange={(value) => updateFilter(index, { ...filter, filter_value: value })}
          >
            <SelectTrigger className='h-9 flex-1'>
              <SelectValue placeholder={t('header_menus.filter_value_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {(filter.filter_key === 'TYPE'
                ? [{ value: 'CINEMATIC', label: 'CINEMATIC' }, { value: 'SERIES', label: 'SERIES' }]
                : [0, 6, 12, 15, 18].map((age) => ({ value: String(age), label: `${age}+` }))
              ).map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select> : <Input
            type={filter.filter_key === 'RELEASED_YEAR_FROM' || filter.filter_key === 'RELEASED_YEAR_TO' ? 'number' : 'text'}
            value={filter.filter_value}
            onChange={(event) => updateFilter(index, { ...filter, filter_value: event.target.value })}
            placeholder={t('header_menus.filter_value_placeholder')}
            className='h-9 flex-1'
          />}
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
