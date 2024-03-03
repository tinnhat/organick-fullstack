'use client'
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
import { useRouter } from 'next/navigation'
type Props = {}

export default function MyProfile({}: Props) {
  const router = useRouter()
  return (
    <div className='my-profile'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <BaseCard title='My Information'>
            <>
              <Stack spacing={3}>
                <TextField
                  sx={{ width: '50%' }}
                  id='name-basic'
                  label='Name'
                  variant='outlined'
                  defaultValue='Nirav Joshi'
                />
                <TextField
                  sx={{ width: '50%' }}
                  id='email-basic'
                  label='Email'
                  variant='outlined'
                />
                <TextField
                  sx={{ width: '50%' }}
                  id='phone-basic'
                  label='Phone'
                  variant='outlined'
                />
              </Stack>
              <Button variant='contained' color='primary' sx={{ mt: 3 }}>
                Save
              </Button>
              <Button
                variant='outlined'
                color='primary'
                sx={{ mt: 3, ml: 3 }}
                onClick={() => router.push('/admin/change-password')}
              >
                Change Password
              </Button>
            </>
          </BaseCard>
        </Grid>
      </Grid>
    </div>
  )
}
