'use client'
import { useGetAllProductsQuery } from '@/app/utils/hooks/productsHooks'
import DeleteIcon from '@mui/icons-material/Delete'
import { Avatar } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import AdminTableFilters, { AdminTableFiltersPagination, Column } from '@/components/admin/AdminTableFilters'
import BaseCard from '../components/shared/BaseCard'
import TypographyTooltip from '../components/typograhyTooltip'
import Loading from '../loading'
import AddProduct from './addProduct'
import DeleteProduct from './deleteProduct'

export default function Products() {
  const { data: allProduct, isLoading, refetch } = useGetAllProductsQuery()
  const [products, setProducts] = useState<Product[]>([])
  const [productsShow, setProductsShow] = useState<Product[]>([])
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
    { key: 'name', label: 'Name', filterable: true, sortable: true },
    { key: 'category', label: 'Category', filterable: true, sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
  ]

  useEffect(() => {
    if (allProduct) {
      setProducts(allProduct)
      setProductsShow(allProduct)
    }
  }, [allProduct])

  useEffect(() => {
    let filtered = cloneDeep(products)

    if (filters.search) {
      filtered = filtered.filter((item: Product) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    Object.entries(filters.filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: any) => {
          if (key === 'category') {
            return item.category?.[0]?.name?.toLowerCase().includes(value.toLowerCase())
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    if (filters.sortKey) {
      filtered.sort((a: any, b: any) => {
        let aVal = a[filters.sortKey]
        let bVal = b[filters.sortKey]
        if (filters.sortKey === 'category') {
          aVal = a.category?.[0]?.name || ''
          bVal = b.category?.[0]?.name || ''
        }
        if (aVal < bVal) return filters.sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return filters.sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    setProductsShow(filtered)
  }, [filters, products])

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize)
  }

  const handleFilter = (newFilters: { search: string; filters: Record<string, string>; sortKey: string; sortDir: 'asc' | 'desc' }) => {
    setFilters(newFilters)
  }

  const handleSort = (sortKey: string, sortDir: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortKey, sortDir }))
  }

  const visibleRows = useMemo(() => {
    return productsShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, productsShow])

  const deleteProduct = (e: any, id: string) => {
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
      'Category',
      'Quantity',
      'Price',
      'Price sale',
      'Image',
      'Description',
      'Star',
      'Update At',
      'Created At',
      'Is Deleted',
    ]
    const rows = productsShow.map((row: Product) => ({
      _id: row._id,
      name: row.name,
      category: row.category,
      quantity: row.quantity,
      price: row.price,
      priceSale: row.priceSale,
      image: row.image,
      description: row.description,
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
    XLSX.writeFile(workbook, 'Products.xlsx', { compression: true })
  }

  if (isLoading) return <Loading />

  return (
    <>
      <div className='products'>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title='Products'>
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
                    Add Product
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
                  data={products}
                  onFilter={handleFilter}
                  onSort={handleSort}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={productsShow.length}
                  currentPage={page}
                  pageSize={rowsPerPage}
                  searchPlaceholder='Search by name...'
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
                                Image
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Name
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Category
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Quantity
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color='textSecondary' variant='h6'>
                                Price
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
                          {visibleRows.map((product: Product) => (
                            <TableRow
                              key={product._id}
                              sx={{
                                cursor: 'pointer',
                                '&.MuiTableRow-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                              }}
                              onClick={() => router.push(`/admin/products/${product._id}`)}
                            >
                              <TableCell>
                                <Avatar
                                  alt={product.name}
                                  src={product.image?.toString()}
                                  sx={{
                                    height: 100,
                                    width: 100,
                                    mt: 2,
                                    mb: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: '0',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box display='flex' alignItems='center'>
                                  <Box>
                                    <TypographyTooltip data={product.name} showToolTip={true} />
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display='flex' alignItems='center'>
                                  <Box>
                                    <TypographyTooltip
                                      data={product.category![0].name}
                                      showToolTip={true}
                                    />
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <TypographyTooltip data={product.quantity} />
                              </TableCell>
                              <TableCell>
                                <TypographyTooltip data={`$${product.price}`} />
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
                                  <DeleteIcon onClick={e => deleteProduct(e, product._id)} />
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <AdminTableFiltersPagination
                      count={productsShow.length}
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
      <AddProduct refetch={refetch} open={open} toggleDrawer={toggleDrawer} />
      <DeleteProduct refetch={refetch} showDelete={showDelete} setShowDelete={setShowDelete} />
    </>
  )
}
