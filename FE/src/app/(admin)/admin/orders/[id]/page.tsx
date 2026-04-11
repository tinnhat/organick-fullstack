'use client'
import {
  useGetOrderDetailQuery,
  useUpdateOrderByAdminMutation,
} from '@/app/utils/hooks/ordersHooks'
import useFetch from '@/app/utils/useFetch'
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
} from '@mui/material'
import { Form, Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as yup from 'yup'
import BaseCard from '../../components/shared/BaseCard'
import Loading from '../../loading'

type MyFormValues = {
  address: string
  phone: string
  note?: string
  _destroy: boolean
}

enum STATUS {
  PENDING = 'Pending',
  CANCEL = 'Cancel',
  COMPLETE = 'Complete',
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

export default function OrderDetail() {
  const params = useParams()
  const route = useRouter()
  const [cart, setCart] = useState<Product[]>([])
  const [status, setStatus] = useState('')
  const fetchApi = useFetch()
  const { data: orderDetail, isLoading } = useGetOrderDetailQuery(fetchApi, params.id.toString())
  const { mutateAsync: updateOrder } = useUpdateOrderByAdminMutation(fetchApi, params.id.toString())
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string)
  }
  const initialValues: MyFormValues = {
    address: '',
    phone: '',
    note: '',
    _destroy: false,
  }

  useEffect(() => {
    if (orderDetail) {
      setStatus(orderDetail.status)
      for (let i = 0; i < orderDetail.listProducts.length; i++) {
        const findIndex = orderDetail.listProductsDetail.findIndex(
          (item: Product) => item._id === orderDetail.listProducts[i]._id
        )
        if (findIndex !== -1) {
          orderDetail.listProductsDetail[findIndex].quantityAddtoCart =
            orderDetail.listProducts[i].quantityAddtoCart
        }
      }
      setCart(orderDetail.listProductsDetail)
    }
  }, [orderDetail])

  const handleSubmit = async (values: any, actions: any) => {
    const dataUpdate = {
      address: values.address.trim(),
      phone: values.phone.trim(),
      note: values.note.trim(),
      status: status,
      _destroy: values._destroy,
    }
    const result = await updateOrder(dataUpdate)
    if (result) {
      toast.success('Order updated successfully', { position: 'bottom-right' })
    }
  }
  if (isLoading) return <Loading />

  return (
    <div>
      <BaseCard title={`Order - ${params.id}`}>
        <>
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
                      <TableCell sx={{ width: 300 }}>
                        <Typography color='textSecondary' variant='h6'>
                          Category
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
                    {cart.map(item => (
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
                            src={item.image!.toString()}
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
                          <Box display='flex' alignItems='center'>
                            <Box>
                              <TypographyCus data={item.category![0].name} showToolTip={true} />
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
                            <TextField
                              value={item.quantityAddtoCart}
                              InputProps={{
                                inputProps: {
                                  max: 999,
                                  min: 1,
                                  step: 1,
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
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </BaseCard>
          </Box>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchema}
            enableReinitialize={true}
            initialValues={
              {
                address: orderDetail?.address,
                phone: orderDetail?.phone,
                note: orderDetail?.note,
                totalPrice: orderDetail?.totalPrice,
                _destroy: orderDetail?._destroy,
                user: orderDetail?.user[0].email,
              } || initialValues
            }
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, values, touched, handleChange }) => {
              const { address, phone, note, _destroy, user } = values
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
                        value={user}
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
                        helperText={touched.address && (errors.address as string)}
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
                        helperText={touched.phone && (errors.phone as string)}
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
                        helperText={touched.note && (errors.note as string)}
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
                          {Object.values(STATUS).map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          ))}
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
