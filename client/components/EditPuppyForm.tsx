import { ChangeEvent, FormEvent, useState } from 'react'
import { Puppy } from '../../models/Puppy'
import { useNavigate } from 'react-router-dom'
import { useUpdatePuppy } from '../hooks/api'

interface Props extends Puppy {}

export default function EditPuppyForm(props: Props) {
  const { ...puppy } = props

  const edit = useUpdatePuppy(puppy.id)
  const navigate = useNavigate()
  const [formState, setFormState] = useState(puppy)

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (edit.isPending) {
      return
    }
    await edit.mutateAsync({ puppy })
    navigate(`/${puppy.id}`)
  }

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.currentTarget
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <img className="img-circle" src={puppy.image} alt={puppy.name} />
      <div className="form-item">
        <label htmlFor="name">Name:</label>
        <input
          name="name"
          id="name"
          value={formState.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-item">
        <label htmlFor="breed">Breed:</label>
        <input
          name="breed"
          id="breed"
          value={formState.breed}
          onChange={handleChange}
        />
      </div>
      <div className="form-item">
        <label htmlFor="owner">Owner:</label>
        <input
          name="owner"
          id="owner"
          value={formState.owner}
          onChange={handleChange}
        />
      </div>
      <div className="form-item">
        <label htmlFor="image">Image:</label>
        <input
          name="image"
          id="image"
          value={formState.image}
          onChange={handleChange}
        />
      </div>
      <button data-pending={edit.isPending}>Submit</button>
    </form>
  )
}
