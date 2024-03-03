import React from 'react'
import Tables from '../ui-components/table/page'
import BaseCard from '../components/shared/BaseCard'
import {
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

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
]

export default function Orders({}: Props) {
  return (
    <div className='orders'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <BaseCard title='Orders'>
            <BaseCard>
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
                    {products.map(product => (
                      <TableRow key={product.name}>
                        <TableCell>
                          <Typography fontSize='15px' fontWeight={500}>
                            {product.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display='flex' alignItems='center'>
                            <Box>
                              <Typography fontSize='14px' fontWeight={600}>
                                {product.name}
                              </Typography>
                              <Typography color='textSecondary' fontSize='13px'>
                                {product.post}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography color='textSecondary' fontSize='14px'>
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
            </BaseCard>
          </BaseCard>
        </Grid>
      </Grid>
    </div>
  )
}
