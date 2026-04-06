import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import { SelectChangeEvent } from '@mui/material/Select'
import { useDebounce } from '@uidotdev/usehooks'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'

export interface Column {
  key: string
  label: string
  filterable?: boolean
  sortable?: boolean
}

export interface FilterState {
  search: string
  filters: Record<string, string>
  sortKey: string
  sortDir: 'asc' | 'desc'
}

interface AdminTableFiltersProps {
  columns: Column[]
  data: any[]
  onFilter: (filters: FilterState) => void
  onSort: (sortKey: string, sortDir: 'asc' | 'desc') => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  totalItems: number
  currentPage: number
  pageSize: number
  loading?: boolean
  searchPlaceholder?: string
}

export default function AdminTableFilters({
  columns,
  data,
  onFilter,
  onSort,
  onPageChange,
  onPageSizeChange,
  totalItems,
  currentPage,
  pageSize,
  loading = false,
  searchPlaceholder = 'Search...',
}: AdminTableFiltersProps) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(currentPage)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  const debouncedSearch = useDebounce(search, 500)

  const filterableColumns = columns.filter(col => col.filterable)
  const sortableColumns = columns.filter(col => col.sortable)

  useEffect(() => {
    const newFilters: FilterState = {
      search: debouncedSearch,
      filters,
      sortKey,
      sortDir,
    }
    onFilter(newFilters)
  }, [debouncedSearch, filters, sortKey, sortDir])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(0)
  }

  const handleClearSearch = () => {
    setSearch('')
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const newFilters = cloneDeep(prev)
      if (value) {
        newFilters[key] = value
      } else {
        delete newFilters[key]
      }
      return newFilters
    })
    setPage(0)
  }

  const handleSort = (key: string) => {
    let newSortDir: 'asc' | 'desc' = 'asc'
    if (sortKey === key) {
      newSortDir = sortDir === 'asc' ? 'desc' : 'asc'
    }
    setSortKey(key)
    setSortDir(newSortDir)
    onSort(key, newSortDir)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    onPageChange(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10)
    setRowsPerPage(newPageSize)
    setPage(0)
    onPageSizeChange(newPageSize)
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({})
    setSortKey('')
    setSortDir('asc')
    setPage(0)
    onFilter({
      search: '',
      filters: {},
      sortKey: '',
      sortDir: 'asc',
    })
  }

  const hasActiveFilters = search || Object.keys(filters).length > 0 || sortKey

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'center',
          gap: 2,
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          sx={{ width: { xs: '100%', md: 250, lg: 300 } }}
          id='search-basic'
          label='Search'
          type='text'
          variant='outlined'
          placeholder={searchPlaceholder}
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {search ? (
                  <ClearIcon sx={{ cursor: 'pointer' }} onClick={handleClearSearch} />
                ) : (
                  <SearchIcon sx={{ cursor: 'pointer' }} />
                )}
              </InputAdornment>
            ),
          }}
        />

        {filterableColumns.map(column => (
          <FormControl key={column.key} size='small' sx={{ minWidth: 120 }}>
            <InputLabel id={`filter-${column.key}`}>{column.label}</InputLabel>
            <Select
              labelId={`filter-${column.key}`}
              id={`filter-select-${column.key}`}
              value={filters[column.key] || ''}
              label={column.label}
              onChange={(e: SelectChangeEvent) => handleFilterChange(column.key, e.target.value)}
            >
              <MenuItem value=''>
                <em>All</em>
              </MenuItem>
            </Select>
          </FormControl>
        ))}

        {sortableColumns.length > 0 && (
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='sort-by'>Sort By</InputLabel>
            <Select
              labelId='sort-by'
              id='sort-select'
              value={sortKey}
              label='Sort By'
              onChange={(e: SelectChangeEvent) => handleSort(e.target.value)}
            >
              {sortableColumns.map(column => (
                <MenuItem key={column.key} value={column.key}>
                  {column.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {sortKey && (
          <Button
            variant='text'
            size='small'
            onClick={() => {
              setSortKey('')
              setSortDir('asc')
            }}
          >
            {sortDir === 'asc' ? '↑' : '↓'} Clear Sort
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {hasActiveFilters && (
          <Button
            variant='outlined'
            size='small'
            color='error'
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            Clear Filters
          </Button>
        )}
      </Box>
    </Box>
  )
}

interface AdminTableFiltersPaginationProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: unknown, newPage: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowsPerPageOptions?: number[]
}

export function AdminTableFiltersPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
}: AdminTableFiltersPaginationProps) {
  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component='div'
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  )
}
