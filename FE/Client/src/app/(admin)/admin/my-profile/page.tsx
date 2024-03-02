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

export default function MyProfile({}: Props) {
  return (
    <div className='my-profile'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
            <Stack spacing={3}>
              <TextField
                id='name-basic'
                label='Name'
                variant='outlined'
                defaultValue='Nirav Joshi'
              />
              <TextField id='email-basic' label='Email' variant='outlined' />
              <TextField
                id='phone-basic'
                label='Phone'
                variant='outlined'
              />
            </Stack>
            <Button>
              Submit
            </Button>
            <Link href='/admin/change-password'>Change Password</Link>
        </Grid>
      </Grid>
    </div>
  )
}