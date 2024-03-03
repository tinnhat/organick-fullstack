'use client'
import React, { useState } from 'react'
import Tables from '../ui-components/table/page'
import BaseCard from '../components/shared/BaseCard'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Chip,
  Drawer,
  Grid,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddOrder from './addOrder'

type Props = {}

const products = [
  {
    id: '1',
    name: 'Sunil Joshi',
    post: 'Web Designer',
    pname: 'Elite Admin',
    priority: 'Low',
    pbg: 'primary.main',
    budget: '3.9',
  },
  {
    id: '2',
    name: 'Andrew McDownland',
    post: 'Project Manager',
    pname: 'Real Homes WP Theme',
    priority: 'Medium',
    pbg: 'secondary.main',
    budget: '24.5',
  },
  {
    id: '3',
    name: 'Christopher Jamil',
    post: 'Project Manager',
    pname: 'MedicalPro WP Theme',
    priority: 'High',
    pbg: 'error.main',
    budget: '12.8',
  },
  {
    id: '4',
    name: 'Nirav Joshi',
    post: 'Frontend Engineer',
    pname: 'Hosting Press HTML',
    priority: 'Critical',
    pbg: 'success.main',
    budget: '2.4',
  },
  {
    id: '5',
    name: 'Sunil Joshi',
    post: 'Web Designer',
    pname: 'Elite Admin',
    priority: 'Low',
    pbg: 'primary.main',
    budget: '3.9',
  },
  {
    id: '6',
    name: 'Andrew McDownland',
    post: 'Project Manager',
    pname: 'Real Homes WP Theme',
    priority: 'Medium',
    pbg: 'secondary.main',
    budget: '24.5',
  },
  {
    id: '7',
    name: 'Christopher Jamil',
    post: 'Project Manager',
    pname: 'MedicalPro WP Theme',
    priority: 'High',
    pbg: 'error.main',
    budget: '12.8',
  },
  {
    id: '8',
    name: 'Nirav Joshi',
    post: 'Frontend Engineer',
    pname: 'Hosting Press HTML',
    priority: 'Critical',
    pbg: 'success.main',
    budget: '2.4',
  },
  {
    id: '9',
    name: 'Sunil Joshi',
    post: 'Web Designer',
    pname: 'Elite Admin',
    priority: 'Low',
    pbg: 'primary.main',
    budget: '3.9',
  },
  {
    id: '10',
    name: 'Andrew McDownland',
    post: 'Project Manager',
    pname: 'Real Homes WP Theme',
    priority: 'Medium',
    pbg: 'secondary.main',
    budget: '24.5',
  },
]

const styleOneColumn = {
  maxWidth: 150,
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

export default function Orders({}: Props) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(newPage)

    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const visibleRows = React.useMemo(() => {
    return products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)

    setSearch(event.target.value)
  }

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
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setSearch('')} />
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
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Id
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Assigned
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Name
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Priority
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography color='textSecondary' variant='h6'>
                                Budget
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visibleRows.map(product => (
                            <TableRow
                              key={product.id}
                              sx={{
                                cursor: 'pointer',
                                '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                              }}
                              onClick={() => console.log(product)}
                            >
                              <TableCell>
                                <TypographyCus data={product.id} showToolTip={true} />
                              </TableCell>
                              <TableCell>
                                <Box display='flex' alignItems='center'>
                                  <Box>
                                    <TypographyCus
                                      data={
                                        product.name +
                                        ' test name long logn logn lgon lgongl lglnmong long'
                                      }
                                      showToolTip={true}
                                    />
                                    <Typography
                                      sx={styleOneColumn}
                                      color='textSecondary'
                                      fontSize='13px'
                                    >
                                      {product.post}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={styleOneColumn}
                                  color='textSecondary'
                                  fontSize='14px'
                                >
                                  {product.pname}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  sx={{
                                    pl: '4px',
                                    pr: '4px',
                                    backgroundColor: product.pbg,
                                    color: '#fff',
                                  }}
                                  size='small'
                                  label={product.priority}
                                ></Chip>
                              </TableCell>
                              <TableCell align='right'>
                                <Typography fontSize='14px'>${product.budget}k</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component='div'
                      count={products.length}
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
      <AddOrder open={open} toggleDrawer={toggleDrawer} />
    </>
  )
}
