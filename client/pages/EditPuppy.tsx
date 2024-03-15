import { useParams } from 'react-router-dom'
import { usePuppy } from '../hooks/api.ts'
import ErrorMessage from '../components/ErrorMessage.tsx'
import LoadingIndicator from '../components/LoadingIndicator.tsx'
import EditPuppyForm from '../components/EditPuppyForm.tsx'

export default function EditPuppy() {
  const id = useParams()
  if (id == undefined) {
    throw new Error(`Missing route param "id"`)
  }

  const idAsNumber = Number(id)
  if (isNaN(idAsNumber)) {
    throw new Error(`Route param "id" is invalid`)
  }

  const puppy = usePuppy(idAsNumber)

  if (puppy.isPending) {
    return <LoadingIndicator />
  }

  if (puppy.isError || !puppy.data) {
    return <ErrorMessage error={puppy.error} />
  }

  return <EditPuppyForm {...puppy.data} />
}
