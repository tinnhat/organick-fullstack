import { ProductsMock, UsersMock } from '@/app/common/mockData'
import {
  Autocomplete,
  Avatar,
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import BaseCard from '../../components/shared/BaseCard'
import DeleteIcon from '@mui/icons-material/Delete'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
}

type MyFormValues = {
  address: string
  phone: string
  note?: string
  totalPrice: number
}

const styleOneColumn = {
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
}


const TypographyCus = ({ data, showToolTip }: { data: any; showToolTip: boolean }) => {
  return showToolTip ? (
    <Tooltip title={data}>
      <Typography sx={styleOneColumn} fontSize='15px' fontWeight={500}>
        {data}
      </Typography>
    </Tooltip>
  ) : (
    <Typography sx={styleOneColumn} fontSize='15px' fontWeight={500}>
      {data}
    </Typography>
  )
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
  _destroy: yup.boolean(),
})

export default function AddOrder({ open, toggleDrawer }: Props) {
  const handleClose = () => {
    toggleDrawer(false)
  }

  const initialValues: MyFormValues = {
    address: '',
    phone: '',
    note: '',
    totalPrice: 0,
  }

  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90vw', md: '70vw', lg: '50vw' },
        },
      }}
      variant='temporary'
      anchor='right'
      open={open}
    >
      <Box sx={{ padding: 2 }}>
        <Typography sx={{ mb: 4 }} variant='h5'>
          Add Order
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button variant='contained'>Add Products</Button>
          <Button sx={{ ml: 2 }} variant='outlined' color='error'>
            Clear Products
          </Button>
        </Box>
        

        <Box sx={{ mb: 2 }}>
          <BaseCard title='Cart'>
            <TableContainer
              sx={{
                width: '100%',
                maxHeight: 400,
              }}
            >
              <Table
                aria-label='simple table'
                sx={{
                  whiteSpace: 'nowrap',
                  mt: 2,
                }}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 100 }}>
                      <Typography color='textSecondary' variant='h6'>
                        Image
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 300 }}>
                      <Typography color='textSecondary' variant='h6'>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 100 }}>
                      <Typography color='textSecondary' variant='h6'>
                        Price
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 200 }}>
                      <Typography color='textSecondary' variant='h6'>
                        Quantity
                      </Typography>
                    </TableCell>
                    <TableCell align='right' sx={{ width: 80 }}>
                      <Typography
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                        color='textSecondary'
                        variant='h6'
                      >
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ maxHeight: '400px', overflow: 'auto' }}>
                  <TableRow
                    sx={{
                      cursor: 'pointer',
                      '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                    }}
                  >
                    <TableCell>
                      <Avatar
                        sx={{ width: 80, height: 80, borderRadius: 0, border: '1px solid #ccc' }}
                        src={'/assets/img/product1.png'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display='flex' alignItems='center'>
                        <Box>
                          <TypographyCus
                            data={'Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli'}
                            showToolTip={true}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={styleOneColumn} color='textSecondary' fontSize='14px'>
                        $23999
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Button>+</Button>
                        <TextField
                          InputProps={{
                            inputProps: {
                              max: 999,
                              min: 1,
                            },
                          }}
                          sx={{
                            mx: 1,
                            width: 70,
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                              {
                                display: 'none',
                              },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                            },
                          }}
                          type='number'
                        />
                        <Button>-</Button>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          ...styleOneColumn,
                          cursor: 'pointer',
                          '&:hover': {
                            transition: 'all 0.5s ease',
                            color: 'red',
                          },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        color='textSecondary'
                        fontSize='14px'
                      >
                        <DeleteIcon />
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </BaseCard>
        </Box>
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
            const { address, phone, note, totalPrice } = values
            return (
              <Form>
                <Stack spacing={2}>
                  <Autocomplete
                    id='user-select'
                    fullWidth
                    options={UsersMock}
                    autoHighlight
                    onChange={(event: any, newValue: any) => {
                      console.log(newValue)
                    }}
                    getOptionLabel={option => option.fullname}
                    renderOption={(props, option) => (
                      <Box
                        onClick={event => event.stopPropagation()}
                        component='li'
                        sx={{ padding: 1 }}
                        {...props}
                        key={option._id}
                      >
                        <Avatar sx={{ width: 40, height: 40 }} src={'/images/users/user2.jpg'} />
                        <Typography sx={{ ml: 1 }}>{option.fullname}</Typography>
                      </Box>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Choose a User'
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    id='address'
                    label='Address'
                    variant='outlined'
                    value={address}
                    onChange={handleChange}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    multiline
                    minRows={4}
                  />
                  <TextField
                    fullWidth
                    type='phone'
                    id='phone'
                    label='Phone'
                    variant='outlined'
                    value={phone}
                    onChange={handleChange}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                  <TextField
                    fullWidth
                    id='note'
                    label='Note'
                    variant='outlined'
                    value={note}
                    onChange={handleChange}
                    error={touched.note && Boolean(errors.note)}
                    helperText={touched.note && errors.note}
                    multiline
                    minRows={4}
                  />
                  <TextField
                    fullWidth
                    type='number'
                    id='totalPrice'
                    label='Total Price'
                    variant='outlined'
                    value={totalPrice}
                    onChange={handleChange}
                    error={touched.totalPrice && Boolean(errors.totalPrice)}
                    helperText={touched.totalPrice && errors.totalPrice}
                  />
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
