'use client'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { Checkbox } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import BaseCard from '../components/shared/BaseCard'
import TypographyTooltip from '../components/typograhyTooltip'
import Loading from '../loading'
import AddCategory from './addCategory'
import DeleteCategory from './deleteCategory'

type Props = {}

export default function Categories({}: Props) {
  const { data: allCategory, isLoading, refetch } = useGetCategoriesQuery()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesShow, setCategoriesShow] = useState<Category[]>([])
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showDelete, setShowDelete] = useState({
    show: false,
    id: '',
  })
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (allCategory) {
      setCategories(allCategory)
      setCategoriesShow(allCategory)
    }
  }, [allCategory])

  //use useEffect to watch value and debounce
  useEffect(() => {
    const newCategoriesShow = cloneDeep(categories)
    if (debouncedSearch) {
      const filtered = newCategoriesShow.filter((item: Category) => {
        return item.name.toLowerCase().includes(search.toLowerCase())
      })
      setCategoriesShow(filtered)
      setPage(0)
    }
  }, [debouncedSearch, categories, search])

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
    return categoriesShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, categoriesShow])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const deleteCategory = (e: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDelete({
      show: true,
      id,
    })
  }

  const exportFile = () => {
    const header = ['Id', 'Name', 'Update At', 'Created At', 'Is Deleted']
    const rows = categoriesShow.map((row: Category) => ({
      _id: row._id,
      name: row.name,
      updateAt: row.updateAt.toString(),
      createdAt: row.createdAt.toString(),
      _destroy: row._destroy ? 'Deleted' : 'Active',
    }))
    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates')

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, 'Categories.xlsx', { compression: true })
  }

  if (isLoading) return <Loading />
  return (
    <>
      <div className='categories'>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title='Categories'>
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
                    Add Category
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
                    placeholder='Search by name'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {search ? (
                            <CloseIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                setSearch('')
                                setCategoriesShow(categories)
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
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Id
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Name
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Delete
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
                                Action
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visibleRows.map((cate: Category) => (
                            <TableRow
                              key={cate._id}
                              sx={{
                                cursor: 'pointer',
                                '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                              }}
                              onClick={() => router.push(`/admin/categories/${cate._id}`)}
                            >
                              <TableCell>
                                <TypographyTooltip data={cate._id} showToolTip={true} />
                              </TableCell>
                              <TableCell>
                                <Box display='flex' alignItems='center'>
                                  <Box>
                                    <TypographyTooltip data={cate.name} showToolTip={true} />
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Checkbox checked={cate._destroy} />
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
                                  <DeleteIcon onClick={e => deleteCategory(e, cate._id)} />
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
                      count={categoriesShow.length}
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
      <AddCategory refetch={refetch} open={open} toggleDrawer={toggleDrawer} />
      <DeleteCategory refetch={refetch} showDelete={showDelete} setShowDelete={setShowDelete} />
    </>
  )
}
