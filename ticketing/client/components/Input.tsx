import React from 'react'

interface InputProps {
  value: string
  label: string
  type: string
  id: string
  onChange(value: string): void
  error?: string
  ariaDescribedby?: string
}

const Input = ({
  value,
  label,
  type,
  id,
  onChange,
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
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </label>
  </div>
)

export default Input
