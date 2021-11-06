import React, { ChangeEvent, FocusEventHandler } from 'react'

interface InputProps {
  value: string
  label: string
  type: string
  id: string
  onChange(event: ChangeEvent<HTMLInputElement>): void
  onBlur?: FocusEventHandler<HTMLInputElement>
  error?: string
  ariaDescribedby?: string
}

const Input = ({
  value,
  label,
  type,
  id,
  onChange,
  onBlur,
  error,
  ariaDescribedby,
}: InputProps): JSX.Element => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
      <input
        required
        type={type}
        className={`form-control${error ? ' is-invalid' : ''}`}
        id={id}
        aria-describedby={ariaDescribedby}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </label>
  </div>
)

export default Input
