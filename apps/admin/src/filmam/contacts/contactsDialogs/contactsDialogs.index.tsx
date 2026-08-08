import { ContactAnswerDialog } from '../contactAnswerDialog/contactAnswerDialog.index'
import { ContactRejectDialog } from '../contactRejectDialog/contactRejectDialog.index'
import { ContactViewMessageDialog } from '../contactViewMessageDialog/contactViewMessageDialog.index'
import { ContactsDeleteDialog } from '../contactsDeleteDialog/contactsDeleteDialog.index'
import { useContacts } from '../contactsProvider/contactsProvider.index'

export function ContactsDialogs() {
  const { open, setOpen, currentRow } = useContacts()
  return (
    <>
      {currentRow && (
        <>
          <ContactAnswerDialog
            key={`contact-answer-${currentRow.id}`}
            open={open === 'answer'}
            onOpenChange={() => setOpen('answer')}
            currentRow={currentRow}
          />
          <ContactRejectDialog
            key={`contact-reject-${currentRow.id}`}
            open={open === 'reject'}
            onOpenChange={() => setOpen('reject')}
            currentRow={currentRow}
          />
          <ContactViewMessageDialog
            key={`contact-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => setOpen('view')}
            currentRow={currentRow}
          />
          <ContactsDeleteDialog
            key={`contact-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => setOpen('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
