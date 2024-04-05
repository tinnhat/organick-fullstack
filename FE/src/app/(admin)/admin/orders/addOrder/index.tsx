import { useCreateOrderByAdminMutation } from '@/app/utils/hooks/ordersHooks'
import { useGetAllUsersQuery } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Autocomplete,
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { Form, Formik } from 'formik'
import { cloneDeep } from 'lodash'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import * as yup from 'yup'
import AddProductCus from '../../components/addProductCus'
import BaseCard from '../../components/shared/BaseCard'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
  refetch: () => void
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
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone is required'),
  note: yup.string(),
})

export default function AddOrder({ open, toggleDrawer, refetch }: Props) {
  const fetchApi = useFetch()
  const { data: allUser, isLoading } = useGetAllUsersQuery(fetchApi)
  const { mutateAsync: createOrder } = useCreateOrderByAdminMutation(fetchApi)
  const [cart, setCart] = useState<Product[]>([])
  const [user, setUser] = useState<User>()
  const [showAddProduct, setShowAddProduct] = useState(false)
  const handleClose = () => {
    toggleDrawer(false)
    setShowAddProduct(false)
    setUser(undefined)
    setCart([])
  }

  const initialValues: MyFormValues = {
    address: '',
    phone: '',
    note: '',
    totalPrice: 0,
  }
  const handleRemoveCart = (item: Product) => {
    setCart(cart.filter(cartItem => cartItem._id !== item._id))
  }

  const handleSubmit = async (values: any, actions: any) => {
    if (!user) {
      toast.warning('Please select user', { position: 'bottom-left' })
      actions.setSubmitting(false)
      return
    }
    if (!cart.length) {
      toast.warning('Please add product', { position: 'bottom-left' })
      actions.setSubmitting(false)
      return
    }
    const dataAdd = {
      address: values.address.trim(),
      phone: values.phone.trim(),
      note: values.note.trim(),
      totalPrice: totalPriceInCart,
      userId: user._id,
      listProducts: cart,
    }
    const result = await createOrder(dataAdd)
    if (result) {
      actions.resetForm()
      handleClose()
      setCart([])
      refetch()
      toast.success('Order added successfully', { position: 'bottom-left' })
    }
  }

  const handleIncreaseQuantity = (item: Product) => {
    const cloneCart: any = cloneDeep(cart)
    const findIndexItem = cloneCart.findIndex((cartItem: any) => cartItem._id === item._id)
    cloneCart[findIndexItem].quantityAddtoCart += 1
    if (cloneCart[findIndexItem].quantityAddtoCart > item.quantity) {
      toast.warning('Quantity not enough', { position: 'bottom-left' })
      //reset ve 1
      cloneCart[findIndexItem].quantityAddtoCart = 1
    }
    setCart([...cloneCart])
  }

  const totalPriceInCart = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price * item.quantityAddtoCart!
    }, 0)
  }, [cart])
  const handleDecreaseQuantity = (item: Product) => {
    const cloneCart: any = cloneDeep(cart)
    const findIndexItem = cloneCart.findIndex((cartItem: any) => cartItem._id === item._id)
    cloneCart[findIndexItem].quantityAddtoCart -= 1
    if (cloneCart[findIndexItem].quantityAddtoCart < 1) {
      handleRemoveCart(item)
    }
    setCart([...cloneCart])
  }
  const handleQuantityChange = (e: any, item: Product) => {
    if (e.target.value === '') {
      toast.warning('Quantity at least 1', { position: 'bottom-left' })
    }
    if (e.target.value > item.quantity) {
      toast.warning('Quantity not enough', { position: 'bottom-left' })
      //reset ve 1
      e.target.value = 1
    }
    const cloneCart: any = cloneDeep(cart)
    const findIndexItem = cloneCart.findIndex((cartItem: any) => cartItem._id === item._id)
    cloneCart[findIndexItem].quantityAddtoCart = Number(e.target.value)
    setCart([...cloneCart])
  }

  if (isLoading) return <div>Loading...</div>
  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90vw', md: '70vw', lg: '60vw' },
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
                  {cart.length === 0 && (
                    <TableRow>
                      <Typography sx={{ textAlign: 'center', mt: 2, fontWeight: 500 }}>
                        Cart is empty
                      </Typography>
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
                          src={item.image?.toString()}
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
                          <Button
                            sx={{ mx: 1 }}
                            onClick={() => handleIncreaseQuantity(item)}
                            variant='contained'
                          >
                            +
                          </Button>
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
                            onChange={e => handleQuantityChange(e, item)}
                          />
                          <Button
                            sx={{ mx: 1 }}
                            onClick={() => handleDecreaseQuantity(item)}
                            variant='contained'
                          >
                            -
                          </Button>
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
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, touched, handleChange }) => {
            const { address, phone, note, totalPrice } = values
            return (
              <Form>
                <Stack spacing={2}>
                  <Autocomplete
                    id='user-select'
                    fullWidth
                    options={allUser}
                    autoHighlight
                    onChange={(event: any, newValue: any) => {
                      setUser(newValue)
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
                        <Avatar sx={{ width: 40, height: 40 }} src={option.avatar} />
                        <Typography sx={{ ml: 1 }}>
                          {option.email} - {option.fullname}
                        </Typography>
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
                    minRows={2}
                  />
                  <TextField
                    fullWidth
                    type='number'
                    id='totalPrice'
                    label='Total Price'
                    variant='outlined'
                    value={totalPriceInCart}
                    disabled
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
