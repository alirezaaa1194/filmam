import { createFileRoute } from '@tanstack/react-router'
import { MaintenanceError } from '@/filmam/errors/maintenanceError/maintenanceError.index'

export const Route = createFileRoute('/(errors)/503')({
  component: MaintenanceError,
})
