'use client'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { Form, Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import * as yup from 'yup'
import BaseCard from '../../components/shared/BaseCard'
import { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AddProductCus from '../../components/addProductCus'
import DeleteIcon from '@mui/icons-material/Delete'

type Props = {}

type MyFormValues = {
  address: string
  phone: string
  note?: string
  _destroy: boolean
}

const styleOneColumn = {
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
}

const validationSchema = yup.object({
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone is required'),
  note: yup.string(),
  _destroy: yup.boolean(),
})

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

export default function OrderDetail({}: Props) {
  const params = useParams()
  const route = useRouter()
  const [cart, setCart] = useState<Product[]>([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [status, setStatus] = useState('');

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  const initialValues: MyFormValues = {
    address: '',
    phone: '',
    note: '',
    _destroy: false,
  }

  const handleRemoveCart = (item: Product) => {
    setCart(cart.filter(cartItem => cartItem._id !== item._id))
  }

  return (
    <div>
      <BaseCard title={`Order - ${params.id}`}>
        <>
          <Box sx={{ mb: 2 }}>
            {showAddProduct ? (
              <Button variant='contained' color='error' onClick={() => setShowAddProduct(false)}>
                Hide Add Products
              </Button>
            ) : (
              <Button variant='contained' onClick={() => setShowAddProduct(true)}>
                Add Products
              </Button>
            )}
            {cart.length > 0 && (
              <Button sx={{ ml: 2 }} variant='outlined' color='error' onClick={() => setCart([])}>
                Clear Products
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
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
                    {cart.length === 0 && (
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ textAlign: 'center', mt: 2, fontWeight: 500 }}>
                            Cart is empty
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {cart
                      .map(item => {
                        return {
                          ...item,
                          quantityAddtoCart: 1,
                        }
                      })
                      .map(item => (
                        <TableRow
                          key={item._id}
                          sx={{
                            cursor: 'pointer',
                            '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                          }}
                        >
                          <TableCell>
                            <Avatar
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 0,
                                border: '1px solid #ccc',
                              }}
                              src={'/assets/img/product1.webp'}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display='flex' alignItems='center'>
                              <Box>
                                <TypographyCus data={item.name} showToolTip={true} />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={styleOneColumn} color='textSecondary' fontSize='14px'>
                              ${item.price}
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
                                value={item.quantityAddtoCart}
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
                              <DeleteIcon onClick={() => handleRemoveCart(item)} />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </BaseCard>
          </Box>

          {showAddProduct && (
            <Box sx={{ mb: 2 }}>
              <AddProductCus cart={cart} setCart={setCart} />
            </Box>
          )}
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
              const { address, phone, note, _destroy } = values
              return (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='totalPrice'
                        label='Total Price'
                        variant='outlined'
                        value={123123}
                        disabled
                      />
                    </Grid>
                    <Divider />
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        type='text'
                        fullWidth
                        id='user'
                        label='User'
                        variant='outlined'
                        value={'user'}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='address'
                        label='Address'
                        variant='outlined'
                        value={address}
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
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
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='note'
                        label='Note'
                        variant='outlined'
                        value={note}
                        onChange={handleChange}
                        error={touched.note && Boolean(errors.note)}
                        helperText={touched.note && errors.note}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <FormControl fullWidth>
                        <InputLabel id='status-label'>Status</InputLabel>
                        <Select
                          labelId='status-label'
                          id='status'
                          value={status}
                          label='Status'
                          onChange={handleChangeStatus}
                        >
                          <MenuItem value={10}>pending</MenuItem>
                          <MenuItem value={20}>shipping</MenuItem>
                          <MenuItem value={30}>complete</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <FormControl component='fieldset' variant='standard'>
                        <FormLabel component='legend'>Active</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={_destroy}
                                value={_destroy}
                                onChange={handleChange}
                                name='_destroy'
                              />
                            }
                            label='Deleted'
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
                    <Button type='submit' disabled={isSubmitting} variant='contained'>
                      Save
                    </Button>
                    <Button variant='outlined' onClick={() => route.back()}>
                      Back
                    </Button>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        </>
      </BaseCard>
    </div>
  )
}
