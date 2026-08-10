import { type Row } from '@tanstack/react-table'
import { LongText } from '@/utilities/components'
import { useContacts } from '../contactsProvider/contactsProvider.index'
import type { Contact } from '../contacts.type'

export function ContactMessageCell({ row }: { row: Row<Contact> }) {
  const { setOpen, setCurrentRow } = useContacts()
  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => {
        setCurrentRow(row.original)
        setOpen('view')
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setCurrentRow(row.original)
          setOpen('view')
        }
      }}
      className='cursor-pointer'
    >
      <LongText className='max-w-52 ps-2 hover:underline'>
        {row.getValue('message')}
      </LongText>
    </div>
  )
}