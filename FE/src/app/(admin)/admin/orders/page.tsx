'use client'
import { useGetOrdersQuery } from '@/app/utils/hooks/ordersHooks'
import useFetch from '@/app/utils/useFetch'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import AdminTableFilters, { AdminTableFiltersPagination, Column } from '@/components/admin/AdminTableFilters'
import BaseCard from '../components/shared/BaseCard'
import TypographyTooltip from '../components/typograhyTooltip'
import Loading from '../loading'
import AddOrder from './addOrder'
import DeleteOrder from './deleteOrder'

export default function Orders() {
  const fetchApi = useFetch()
  const { data: allOrders, isLoading, refetch } = useGetOrdersQuery(fetchApi)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersShow, setOrdersShow] = useState<Order[]>([])
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showDelete, setShowDelete] = useState({
    show: false,
    id: '',
  })
  const [filters, setFilters] = useState({
    search: '',
    filters: {} as Record<string, string>,
    sortKey: '',
    sortDir: 'asc' as 'asc' | 'desc',
  })

  const columns: Column[] = [
    { key: '_id', label: 'Id', filterable: true, sortable: true },
    { key: 'phone', label: 'Phone', filterable: true, sortable: true },
    { key: 'totalPrice', label: 'Total Price', sortable: true },
    { key: 'status', label: 'Status', filterable: true, sortable: true },
    { key: 'createdAt', label: 'Created At', sortable: true },
  ]

  useEffect(() => {
    if (allOrders) {
      setOrders(allOrders)
      setOrdersShow(allOrders)
    }
  }, [allOrders])

  useEffect(() => {
    let filtered = cloneDeep(orders)

    if (filters.search) {
      filtered = filtered.filter((item: Order) =>
        item._id.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    Object.entries(filters.filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: any) => {
          if (key === 'createdAt') {
            return moment(item[key]).format('DD/MM/YYYY').includes(value.toLowerCase())
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    if (filters.sortKey) {
      filtered.sort((a: any, b: any) => {
        let aVal = a[filters.sortKey]
        let bVal = b[filters.sortKey]
        if (filters.sortKey === 'createdAt') {
          aVal = new Date(aVal).getTime()
          bVal = new Date(bVal).getTime()
        }
        if (aVal < bVal) return filters.sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return filters.sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    setOrdersShow(filtered)
  }, [filters, orders])

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize)
    setPage(0)
  }

  const handleFilter = (newFilters: { search: string; filters: Record<string, string>; sortKey: string; sortDir: 'asc' | 'desc' }) => {
    setFilters(newFilters)
  }

  const handleSort = (sortKey: string, sortDir: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortKey, sortDir }))
  }

  const visibleRows = useMemo(() => {
    return ordersShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, ordersShow])

  const deleteOrder = (e: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDelete({
      show: true,
      id,
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
                    mb: 2,
                  }}
                >
                  <Button variant='contained' color='primary' onClick={() => toggleDrawer(true)}>
                    Add Order
                  </Button>
                  <Button
                    sx={{
                      mr: 'auto',
                      ml: 2,
                    }}
                    variant='contained'
                    color='secondary'
                    onClick={exportFile}
                  >
                    Export
                  </Button>
                </Box>
                <AdminTableFilters
                  columns={columns}
                  data={orders}
                  onFilter={handleFilter}
                  onSort={handleSort}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={ordersShow.length}
                  currentPage={page}
                  pageSize={rowsPerPage}
                  searchPlaceholder='Search by order id...'
                />
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
                    <AdminTableFiltersPagination
                      count={ordersShow.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={(e, newPage) => handlePageChange(newPage)}
                      onRowsPerPageChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
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
