'use client'
import { useGetOrdersQuery } from '@/app/utils/hooks/ordersHooks'
import useFetch from '@/app/utils/useFetch'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDebounce } from '@uidotdev/usehooks'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import BaseCard from '../components/shared/BaseCard'
import TypographyTooltip from '../components/typograhyTooltip'
import Loading from '../loading'
import AddOrder from './addOrder'
import DeleteOrder from './deleteOrder'

type Props = {}

export default function Orders({}: Props) {
  const fetchApi = useFetch()
  const { data: allOrders, isLoading, refetch } = useGetOrdersQuery(fetchApi)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersShow, setOrdersShow] = useState<Order[]>([])
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showDelete, setShowDelete] = useState({
    show: false,
    id: ''
  })
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (allOrders) {
      setOrders(allOrders)
      setOrdersShow(allOrders)
    }
  }, [allOrders])

  //use useEffect to watch value and debounce
  useEffect(() => {
    const newOrderShow = cloneDeep(orders)
    if (debouncedSearch) {
      const filtered = newOrderShow.filter((item: Order) => {
        return item._id.includes(search)
      })
      setOrdersShow(filtered)
      setPage(0)
    }
  }, [debouncedSearch, orders, search])

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const visibleRows = React.useMemo(() => {
    return ordersShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, ordersShow])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const deleteOrder = (e: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDelete({
      show: true,
      id
    })
  }

  const exportFile = () => {
    const header = [
      'Id',
      'Cart',
      'User',
      'Total Price',
      'Address',
      'Phone',
      'Note',
      'Status',
      'Update At',
      'Created At',
      'Is Deleted'
    ]
    const rows = ordersShow.map((row: Order) => ({
      _id: row._id,
      cart: row.listProduct,
      user: row.userId,
      totalPrice: row.totalPrice,
      address: row.address,
      phone: row.phone,
      note: row.note,
      status: row.status,
      updateAt: moment(row.updateAt).format('DD/MM/YYYY HH:mm:ss'),
      createdAt: moment(row.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      _destroy: row._destroy ? 'Deleted' : 'Active'
    }))
    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates')

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, 'Orders.xlsx', { compression: true })
  }
  if (isLoading) return <Loading />

  return (
    <>
      <div className='orders'>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title='Orders'>
              <>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                  }}
                >
                  <Button variant='contained' color='primary' onClick={() => toggleDrawer(true)}>
                    Add Order
                  </Button>
                  <Button
                    sx={{
                      mr: 'auto',
                      ml: 2
                    }}
                    variant='contained'
                    color='secondary'
                    onClick={exportFile}
                  >
                    Export
                  </Button>
                  <TextField
                    value={search}
                    onChange={handleChangeSearch}
                    sx={{ width: { xs: '50%', md: '40%', lg: '30%' } }}
                    id='search-basic'
                    label='Search'
                    type='text'
                    variant='outlined'
                    placeholder='Search by order id'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {search ? (
                            <CloseIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                setSearch('')
                                setOrdersShow(orders)
                              }}
                            />
                          ) : (
                            <SearchIcon sx={{ cursor: 'pointer' }} />
                          )}
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <BaseCard>
                  <>
                    <TableContainer
                      sx={{
                        width: {
                          xs: '274px',
                          sm: '100%'
                        }
                      }}
                    >
                      <Table
                        aria-label='simple table'
                        sx={{
                          whiteSpace: 'nowrap',
                          mt: 2
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Id
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Phone
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Total Price
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Status
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Created At
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                                color='textSecondary'
                                variant='h6'
                              >
                                Action
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visibleRows.map((order: Order) => (
                            <TableRow
                              key={order._id}
                              sx={{
                                cursor: 'pointer',
                                '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                              }}
                              onClick={() => router.push(`/admin/orders/${order._id}`)}
                            >
                              <TableCell>
                                <TypographyTooltip data={order._id} showToolTip={true} />
                              </TableCell>
                              <TableCell>
                                <Box display='flex' alignItems='center'>
                                  <Box>
                                    <TypographyTooltip data={order.phone} showToolTip={true} />
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <TypographyTooltip
                                  data={`$${order.totalPrice}`}
                                  showToolTip={false}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  sx={{
                                    pl: '4px',
                                    pr: '4px',
                                    backgroundColor:
                                      order.status === 'Pending'
                                        ? '#f1c40f'
                                        : order.status === 'Complete'
                                          ? '#27ae60'
                                          : '#e74c3ced',
                                    color: '#fff'
                                  }}
                                  size='small'
                                  label={order.status}
                                ></Chip>
                              </TableCell>
                              <TableCell>
                                <TypographyTooltip
                                  data={moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                  showToolTip={false}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    WebkitLineClamp: '1',
                                    WebkitBoxOrient: 'vertical',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      transition: 'all 0.5s ease',
                                      color: 'red'
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  color='textSecondary'
                                  fontSize='14px'
                                >
                                  <DeleteIcon onClick={e => deleteOrder(e, order._id)} />
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component='div'
                      count={ordersShow.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                </BaseCard>
              </>
            </BaseCard>
          </Grid>
        </Grid>
      </div>
      <AddOrder refetch={refetch} open={open} toggleDrawer={toggleDrawer} />
      <DeleteOrder refetch={refetch} showDelete={showDelete} setShowDelete={setShowDelete} />
    </>
  )
}
