import { useId, type ComponentProps } from 'react'

export function Field({
  label,
  name,
  hint,
  ...inputProps
}: { label: string; name: string; hint?: string } & ComponentProps<'input'>) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className={inputProps.type === 'radio' ? 'choice' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} aria-describedby={hintId} {...inputProps} />
      {hint && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}
    </div>
  )
}
