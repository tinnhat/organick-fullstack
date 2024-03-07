import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
}

type MyFormValues = {
  name: string
  _destroy: boolean
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
  _destroy: yup.boolean(),
})

export default function AddCategory({ open, toggleDrawer }: Props) {
  const handleClose = () => {
    toggleDrawer(false)
  }

  const initialValues: MyFormValues = {
    name: '',
    _destroy: false,
  }

  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90vw', md: '50vw', lg: '30vw' },
        },
      }}
      variant='temporary'
      anchor='right'
      open={open}
    >
      <Box sx={{ padding: 2 }}>
        <Typography sx={{ mb: 4 }} variant='h5'>
          Add Category
        </Typography>

        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            console.log(values)
            setTimeout(() => {
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {({ isSubmitting, errors, values, touched, handleChange }) => {
            const { name, _destroy } = values
            return (
              <Form>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    id='name'
                    label='Name'
                    variant='outlined'
                    value={name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <FormControl component='fieldset' variant='standard'>
                      <FormLabel component='legend'>Deleted</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={_destroy}
                              onChange={handleChange}
                              value={_destroy}
                              name='_destroy'
                            />
                          }
                          label='Admin'
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Button type='submit' disabled={isSubmitting} variant='contained'>
                      Add
                    </Button>
                    <Button
                      variant='outlined'
                      sx={{
                        ml: 2,
                      }}
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Drawer>
  )
}
