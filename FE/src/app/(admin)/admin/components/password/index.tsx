import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormHelperText } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import React, { useState } from 'react'

type Props = {
  id: string
  label?: string
  variant?: 'filled' | 'standard' | 'outlined' | undefined
  value?: any
  onChange?: any
  error?: any
  helperText?: any
}

export default function TextFieldPassword({
  id,
  label,
  variant,
  value,
  onChange,
  error,
  helperText,
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <FormControl variant={variant ? variant : 'outlined'}>
      <InputLabel error={error} htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
      <OutlinedInput
        label={label}
        error={error}
        value={value}
        id={id}
        type={showPassword ? 'text' : 'password'}
        onChange={onChange}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={error} id={`outlined-adornment-${label}`}>
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}
