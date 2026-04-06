import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminTableFilters, { AdminTableFiltersPagination } from '../../../components/admin/AdminTableFilters'

const mockOnFilter = jest.fn()
const mockOnSort = jest.fn()
const mockOnPageChange = jest.fn()
const mockOnPageSizeChange = jest.fn()

const columns = [
  { key: 'name', label: 'Name', filterable: true, sortable: true },
  { key: 'email', label: 'Email', filterable: true },
  { key: 'status', label: 'Status', filterable: true, sortable: true },
  { key: 'created', label: 'Created', sortable: true }
]

const mockData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', created: '2024-01-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', created: '2024-01-02' }
]

describe('AdminTableFilters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Search', () => {
    it('should render search input', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )
      expect(screen.getByLabelText('Search')).toBeInTheDocument()
    })

    it('should call onFilter when search value changes', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const searchInput = screen.getByLabelText('Search')
      fireEvent.change(searchInput, { target: { value: 'john' } })
      
      waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalled()
      })
    })

    it('should show clear button when search has value', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const searchInput = screen.getByLabelText('Search')
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      const clearButton = document.querySelector('[data-testid="clear-icon"]')
      expect(clearButton || document.querySelector('[class*="ClearIcon"]')).toBeTruthy()
    })
  })

  describe('Filters', () => {
    it('should render filter dropdowns for filterable columns', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
    })

    it('should call onFilter when filter changes', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const statusFilter = screen.getByLabelText('Status')
      fireEvent.change(statusFilter, { target: { value: 'active' } })
      
      waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalled()
      })
    })

    it('should reset page when filter changes', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={2}
          pageSize={10}
        />
      )

      const nameFilter = screen.getByLabelText('Name')
      fireEvent.change(nameFilter, { target: { value: 'john' } })
      
      expect(mockOnPageChange).toHaveBeenCalledWith(0)
    })
  })

  describe('Sorting', () => {
    it('should render sort dropdown for sortable columns', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      expect(screen.getByLabelText('Sort By')).toBeInTheDocument()
    })

    it('should call onSort when sort option is selected', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const sortSelect = screen.getByLabelText('Sort By')
      fireEvent.change(sortSelect, { target: { value: 'name' } })
      
      expect(mockOnSort).toHaveBeenCalledWith('name', 'asc')
    })

    it('should toggle sort direction when same column is selected', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const sortSelect = screen.getByLabelText('Sort By')
      fireEvent.change(sortSelect, { target: { value: 'name' } })
      expect(mockOnSort).toHaveBeenCalledWith('name', 'asc')

      fireEvent.change(sortSelect, { target: { value: 'name' } })
      expect(mockOnSort).toHaveBeenCalledWith('name', 'desc')
    })

    it('should show clear sort button when sorting is active', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const sortSelect = screen.getByLabelText('Sort By')
      fireEvent.change(sortSelect, { target: { value: 'name' } })
      
      const clearSortButton = screen.getByText(/↑ Clear Sort|↓ Clear Sort/)
      expect(clearSortButton).toBeInTheDocument()
    })
  })

  describe('Clear Filters', () => {
    it('should show clear filters button when filters are active', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const searchInput = screen.getByLabelText('Search')
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      const clearFiltersButton = screen.getByText('Clear Filters')
      expect(clearFiltersButton).toBeInTheDocument()
    })

    it('should reset all filters when clear filters is clicked', () => {
      render(
        <AdminTableFilters
          columns={columns}
          data={mockData}
          onFilter={mockOnFilter}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          totalItems={10}
          currentPage={0}
          pageSize={10}
        />
      )

      const searchInput = screen.getByLabelText('Search')
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      const clearFiltersButton = screen.getByText('Clear Filters')
      fireEvent.click(clearFiltersButton)
      
      expect(mockOnFilter).toHaveBeenCalledWith(expect.objectContaining({
        search: '',
        filters: {},
        sortKey: ''
      }))
    })
  })
})

describe('AdminTableFiltersPagination Component', () => {
  it('should render pagination', () => {
    render(
      <AdminTableFiltersPagination
        count={50}
        page={0}
        rowsPerPage={10}
        onPageChange={mockOnPageChange}
        onRowsPerPageChange={mockOnPageSizeChange}
      />
    )
    expect(screen.getByText('1-10 of 50')).toBeInTheDocument()
  })

  it('should call onPageChange when page changes', () => {
    render(
      <AdminTableFiltersPagination
        count={50}
        page={0}
        rowsPerPage={10}
        onPageChange={mockOnPageChange}
        onRowsPerPageChange={mockOnPageSizeChange}
      />
    )

    const nextButton = document.querySelector('[aria-label="Go to next page"]')
    if (nextButton) {
      fireEvent.click(nextButton)
    }
    
    expect(mockOnPageChange).toHaveBeenCalled()
  })

  it('should call onRowsPerPageChange when rows per page changes', () => {
    render(
      <AdminTableFiltersPagination
        count={50}
        page={0}
        rowsPerPage={10}
        onPageChange={mockOnPageChange}
        onRowsPerPageChange={mockOnPageSizeChange}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '25' } })
    
    expect(mockOnPageSizeChange).toHaveBeenCalled()
  })

  it('should display correct page info', () => {
    render(
      <AdminTableFiltersPagination
        count={25}
        page={1}
        rowsPerPage={10}
        onPageChange={mockOnPageChange}
        onRowsPerPageChange={mockOnPageSizeChange}
      />
    )
    expect(screen.getByText('11-20 of 25')).toBeInTheDocument()
  })
})