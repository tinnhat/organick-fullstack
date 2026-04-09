'use client'
import { useGetCouponsQuery, useToggleCouponMutation, useDeleteCouponMutation, Coupon } from '@/app/utils/hooks/couponHooks'
import useFetch from '@/app/utils/useFetch'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AdminTableFilters, { AdminTableFiltersPagination, Column } from '@/components/admin/AdminTableFilters'
import BaseCard from '../components/shared/BaseCard'
import TypographyTooltip from '../components/typograhyTooltip'
import Loading from '../../loading'
import AddCoupon from './addCoupon'

export default function Coupons() {
  const fetchApi = useFetch()
  const { data: allCoupons, isLoading, refetch } = useGetCouponsQuery()
  const { mutateAsync: toggleCoupon } = useToggleCouponMutation(fetchApi)
  const { mutateAsync: deleteCoupon } = useDeleteCouponMutation(fetchApi)

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponsShow, setCouponsShow] = useState<Coupon[]>([])
  const [open, setOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (allCoupons) {
      setCoupons(allCoupons)
      setCouponsShow(allCoupons)
    }
  }, [allCoupons])

  const columns: Column[] = [
    { key: 'code', label: 'Code', filterable: true, sortable: true },
    { key: 'type', label: 'Type', filterable: true, sortable: true },
    { key: 'value', label: 'Value', sortable: true },
    { key: 'minOrder', label: 'Min Order', sortable: true },
    { key: 'usedCount', label: 'Uses', sortable: true },
    { key: 'expiresAt', label: 'Expires', sortable: true },
    { key: 'isActive', label: 'Status', filterable: true, sortable: true },
  ]

  const handleFilter = ({ search: searchVal, filters: filterVals }: any) => {
    let filtered = cloneDeep(coupons)

    if (searchVal) {
      filtered = filtered.filter((item: Coupon) =>
        item.code.toLowerCase().includes(searchVal.toLowerCase())
      )
    }

    Object.entries(filterVals).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: Coupon) => {
          const itemValue = (item as any)[key]
          if (key === 'isActive') {
            return itemValue === (value === 'true')
          }
          if (key === 'type') {
            return itemValue === value
          }
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
        })
      }
    })

    if (sortKey) {
      filtered.sort((a: any, b: any) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    setCouponsShow(filtered)
    setPage(0)
  }

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDir(dir)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize)
    setPage(0)
  }

  const visibleRows = useMemo(() => {
    return couponsShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, couponsShow])

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setEditingCoupon(null)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setOpen(true)
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await toggleCoupon({ id: coupon._id, isActive: !coupon.isActive })
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'} successfully`)
      refetch()
    } catch (error) {
      toast.error('Failed to update coupon status')
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id)
        toast.success('Coupon deleted successfully')
        refetch()
      } catch (error) {
        toast.error('Failed to delete coupon')
      }
    }
  }

  const getStatusColor = (isActive: boolean, expiresAt: string) => {
    if (!isActive) return 'default'
    const isExpired = new Date(expiresAt) < new Date()
    if (isExpired) return 'error'
    return 'success'
  }

  const getStatusLabel = (isActive: boolean, expiresAt: string) => {
    if (!isActive) return 'Inactive'
    const isExpired = new Date(expiresAt) < new Date()
    if (isExpired) return 'Expired'
    return 'Active'
  }

  if (isLoading) return <Loading />

  return (
    <>
      <div className='coupons'>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title='Coupons'>
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
                    Add Coupon
                  </Button>
                </Box>
                <AdminTableFilters
                  columns={columns}
                  data={coupons}
                  onFilter={handleFilter}
                  onSort={handleSort}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={couponsShow.length}
                  currentPage={page}
                  pageSize={rowsPerPage}
                  searchPlaceholder='Search by code...'
                />
                <BaseCard>
                  <>
                    <TableContainer
                      sx={{
                        width: {
                          xs: '274px',
                          sm: '100%',
                        },
                      }}
                    >
                      <Table
                        aria-label='simple table'
                        sx={{
                          whiteSpace: 'nowrap',
                          mt: 2,
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Code
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Type
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Value
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Min Order
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Uses
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Expires
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Status
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                                color='textSecondary'
                                variant='h6'
                              >
                                Actions
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visibleRows.map((coupon: Coupon) => (
                            <TableRow
                              key={coupon._id}
                              sx={{
                                cursor: 'pointer',
                                '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                                opacity: coupon._destroy ? 0.6 : 1,
                              }}
                            >
                              <TableCell>
                                <TypographyTooltip data={coupon.code} showToolTip={true} />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  sx={{
                                    textTransform: 'capitalize',
                                  }}
                                  size='small'
                                  label={coupon.type}
                                  color={coupon.type === 'percentage' ? 'primary' : 'secondary'}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {coupon.type === 'percentage'
                                    ? `${coupon.value}%`
                                    : `$${coupon.value}`}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>${coupon.minOrder}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {coupon.usedCount} / {coupon.maxUses}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <TypographyTooltip
                                  data={moment(coupon.expiresAt).format('DD/MM/YYYY')}
                                  showToolTip={false}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size='small'
                                  label={getStatusLabel(coupon.isActive, coupon.expiresAt)}
                                  color={getStatusColor(coupon.isActive, coupon.expiresAt)}
                                />
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <Switch
                                    checked={coupon.isActive}
                                    onChange={() => handleToggleActive(coupon)}
                                    onClick={(e) => e.stopPropagation()}
                                    color='primary'
                                  />
                                  <EditIcon
                                    sx={{
                                      cursor: 'pointer',
                                      color: 'primary.main',
                                      '&:hover': { color: 'primary.dark' },
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEdit(coupon)
                                    }}
                                  />
                                  <DeleteIcon
                                    sx={{
                                      cursor: 'pointer',
                                      color: 'error.main',
                                      '&:hover': { color: 'error.dark' },
                                    }}
                                    onClick={(e) => handleDelete(e, coupon._id)}
                                  />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <AdminTableFiltersPagination
                      count={couponsShow.length}
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
      <AddCoupon
        refetch={refetch}
        open={open}
        toggleDrawer={toggleDrawer}
        coupon={editingCoupon}
      />
    </>
  )
}
