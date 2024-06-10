import React, { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import './styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../LoadingSpinner'
type Props = {
  title?: string
  description?: string
  children: ReactNode
  loading?: boolean
}
const ModalSimple = ({ title,description,children,loading }: Props) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet">Edit profile</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        {loading && <LoadingSpinner />}
        {title && (
          <Dialog.Title className="DialogTitle">{title}</Dialog.Title>
        )}
         {description && (
        <Dialog.Description className="DialogDescription">
          {description}
        </Dialog.Description>
        )}
        {children}
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <FontAwesomeIcon icon={faClose} width={16} height={16} />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export default ModalSimple
