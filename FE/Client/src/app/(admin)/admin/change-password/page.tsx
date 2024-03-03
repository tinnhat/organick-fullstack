import React from 'react'
import {
  Paper,
  Grid,
  Stack,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Button,
} from '@mui/material'
import BaseCard from '../components/shared/BaseCard'
import Link from 'next/link'

type Props = {}

export default function ChangePassword({}: Props) {
  return (
    <div className='change-password'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <BaseCard title='Change password'>
            <>
              <Stack spacing={3}>
                <TextField
                  sx={{ width: '50%' }}
                  id='pass-basic'
                  label='Old Password'
                  type='password'
                  variant='outlined'
                />
                <TextField
                  sx={{ width: '50%' }}
                  id='pass-basic'
                  label='New Password'
                  type='password'
                  variant='outlined'
                />
                <TextField
                  sx={{ width: '50%' }}
                  id='pass-basic'
                  label='Confirm new Password'
                  type='password'
                  variant='outlined'
                />
              </Stack>
              <Button variant='contained' color='primary' sx={{ mt: 3 }}>
                Change password
              </Button>
            </>
          </BaseCard>
        </Grid>
      </Grid>
    </div>
  )
}
