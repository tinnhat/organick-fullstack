'use client'
import { useGetAllUsersQuery } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
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
import AddUser from './addUser'
import DeleteUser from './deleteUser'

export default function Users() {
  const fetchApi = useFetch()
  const { data: allUsers, isLoading, refetch } = useGetAllUsersQuery(fetchApi)
  const [users, setUsers] = useState<User[]>([])
  const [usersShow, setUsersShow] = useState<User[]>([])
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
    { key: 'email', label: 'Email', filterable: true, sortable: true },
    { key: 'isConfirmed', label: 'Confirmed', filterable: true, sortable: true },
    { key: 'isAdmin', label: 'Admin', filterable: true, sortable: true },
  ]

  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers)
      setUsersShow(allUsers)
    }
  }, [allUsers])

  useEffect(() => {
    let filtered = cloneDeep(users)

    if (filters.search) {
      filtered = filtered.filter((item: User) =>
        item.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    Object.entries(filters.filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: any) => {
          if (key === 'isConfirmed' || key === 'isAdmin') {
            const boolVal = value === 'true'
            return item[key] === boolVal
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    if (filters.sortKey) {
      filtered.sort((a: any, b: any) => {
        let aVal = a[filters.sortKey]
        let bVal = b[filters.sortKey]
        if (filters.sortKey === 'isConfirmed' || filters.sortKey === 'isAdmin') {
          aVal = aVal ? 1 : 0
          bVal = bVal ? 1 : 0
        }
        if (aVal < bVal) return filters.sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return filters.sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    setUsersShow(filtered)
  }, [filters, users])

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
    return usersShow && usersShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, usersShow])

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
      'Name',
      'Email',
      'Is Confirm',
      'Is Admin',
      'Update At',
      'Created At',
      'Is Deleted',
    ]
    const rows = usersShow.map((row: User) => ({
      _id: row._id,
      fullname: row.fullname,
      email: row.email,
      isConfirmed: row.isConfirmed ? 'Confirmed' : 'Unconfirmed',
      isAdmin: row.isAdmin ? 'Admin' : 'User',
      updateAt: moment(row.updateAt).format('DD/MM/YYYY HH:mm:ss'),
      createdAt: moment(row.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      _destroy: row._destroy ? 'Deleted' : 'Active',
    }))
    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates')

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, 'Users.xlsx', { compression: true })
  }

  if (isLoading) return <Loading />

  return (
    <>
      <div className='users'>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title='Users'>
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
                    Add User
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
                  data={users}
                  onFilter={handleFilter}
                  onSort={handleSort}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={usersShow?.length || 0}
                  currentPage={page}
                  pageSize={rowsPerPage}
                  searchPlaceholder='Search by email...'
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
                            <TableCell sx={{ width: 300 }}>
                              <Typography color='textSecondary' variant='h6'>
                                Id
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: 300 }}>
                              <Typography color='textSecondary' variant='h6'>
                                Email
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: 100 }}>
                              <Typography color='textSecondary' variant='h6'>
                                Confirm
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: 100 }}>
                              <Typography color='textSecondary' variant='h6'>
                                Admin
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: 100 }}>
                              <Typography color='textSecondary' variant='h6'>
                                Deleted
                              </Typography>
                            </TableCell>
                            <TableCell align='right' sx={{ width: 100 }}>
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
                        <TableBody>
                          {visibleRows &&
                            visibleRows.map((user: User) => (
                              <TableRow
                                key={user._id}
                                sx={{
                                  cursor: 'pointer',
                                  '&.MuiTableRow-root:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                  },
                                  backgroundColor: user._destroy ? 'rgba(0,0,0,0.05)' : 'inherit',
                                  opacity: user._destroy ? 0.8 : 1,
                                }}
                                onClick={() => router.push(`/admin/users/${user._id}`)}
                              >
                                <TableCell>
                                  <TypographyTooltip data={user._id} showToolTip={true} />
                                </TableCell>
                                <TableCell>
                                  <Box display='flex' alignItems='center'>
                                    <Box>
                                      <TypographyTooltip data={user.email} showToolTip={true} />
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Checkbox checked={user.isConfirmed} />
                                </TableCell>
                                <TableCell>
                                  <Checkbox checked={user.isAdmin} />
                                </TableCell>
                                <TableCell>
                                  <Checkbox checked={user._destroy} />
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
                                        color: 'red',
                                      },
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    color='textSecondary'
                                    fontSize='14px'
                                  >
                                    <DeleteIcon onClick={e => deleteOrder(e, user._id)} />
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <AdminTableFiltersPagination
                      count={usersShow?.length || 0}
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
      <AddUser refetch={refetch} open={open} toggleDrawer={toggleDrawer} />
      <DeleteUser refetch={refetch} showDelete={showDelete} setShowDelete={setShowDelete} />
    </>
  )
}
