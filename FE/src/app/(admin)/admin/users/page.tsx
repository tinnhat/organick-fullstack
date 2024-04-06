'use client'
import { useGetAllUsersQuery } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
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
import AddUser from './addUser'
import DeleteUser from './deleteUser'

export default function Users() {
  const fetchApi = useFetch()
  const { data: allUsers, isLoading, refetch } = useGetAllUsersQuery(fetchApi)
  const [users, setUsers] = useState<User[]>([])
  const [usersShow, setUsersShow] = useState<User[]>([])
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showDelete, setShowDelete] = useState({
    show: false,
    id: '',
  })
  const debouncedSearch = useDebounce(search, 300)
  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers)
      setUsersShow(allUsers)
    }
  }, [allUsers])

  //use useEffect to watch value and debounce
  useEffect(() => {
    const newProductsShow = cloneDeep(users)
    if (debouncedSearch) {
      const filtered = newProductsShow.filter((item: User) => {
        return item.email.includes(search)
      })
      setUsersShow(filtered)
      setPage(0)
    }
  }, [debouncedSearch, users, search])

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
    return usersShow && usersShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, usersShow])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

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
                  <TextField
                    value={search}
                    onChange={handleChangeSearch}
                    sx={{ width: { xs: '50%', md: '40%', lg: '30%' } }}
                    id='search-basic'
                    label='Search'
                    type='text'
                    variant='outlined'
                    placeholder='Search by email'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {search ? (
                            <CloseIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                setSearch('')
                                setUsersShow(users)
                              }}
                            />
                          ) : (
                            <SearchIcon sx={{ cursor: 'pointer' }} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
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
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component='div'
                      count={usersShow && usersShow.length}
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
      <AddUser refetch={refetch} open={open} toggleDrawer={toggleDrawer} />
      <DeleteUser refetch={refetch} showDelete={showDelete} setShowDelete={setShowDelete} />
    </>
  )
}
