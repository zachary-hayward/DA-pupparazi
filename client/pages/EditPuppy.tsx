import { useParams } from 'react-router-dom'
import { usePuppy } from '../hooks/api.ts'
import ErrorMessage from '../components/ErrorMessage.tsx'
import LoadingIndicator from '../components/LoadingIndicator.tsx'
import EditPuppyForm from '../components/EditPuppyForm.tsx'

export default function EditPuppy() {
  const params = useParams()
  const id = Number(params.id)
  if (isNaN(id)) {
    throw new Error(`Route param "id" is missing or invalid`)
  }

  const puppy = usePuppy(id)

  if (puppy.isPending) {
    return <LoadingIndicator />
  }

  if (puppy.isError || !puppy.data) {
    return <ErrorMessage error={puppy.error} />
  }

  return <EditPuppyForm {...puppy.data} />
}
