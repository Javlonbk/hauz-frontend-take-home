import { useId, type ComponentProps } from 'react'

export function Field({
  label,
  name,
  ...inputProps
}: { label: string; name: string } & ComponentProps<'input'>) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id}>{label}</label>{' '}
      <input id={id} name={name} {...inputProps} />
    </div>
  )
}
