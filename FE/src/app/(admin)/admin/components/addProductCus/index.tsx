'use client'
import {
  Avatar,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  ClickAwayListener
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import React, { useState } from 'react'
import { ProductsMock } from '@/app/common/mockData'

type Props = {
  cart: Product[]
  setCart: (val: Product[]) => void
}

const styleOneColumn = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  ml: 2,
}

export default function AddProductCus({ cart, setCart }: Props) {
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  const handleAddtoCart = (item: Product) => {
    setCart([...cart, item])
  }
  const handleSearch = () => {
    if (!search) {
      //show all product
    } else {
      //show theo filter
    }
  }

  const handleClickAway = () => {
    setShow(false)
  }
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      <TextField
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{}}
        size='small'
        label='Product name'
        variant='outlined'
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {search ? (
                <CloseIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearch('')
                    setShow(false)
                  }}
                />
              ) : (
                <SearchIcon sx={{ cursor: 'pointer' }} onClick={() => setShow(true)} />
              )}
            </InputAdornment>
          ),
        }}
      />
      {show && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: 200,
              background: '#fff',
              overflow: 'auto',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              zIndex: 5,
              top: 'calc(100% + 4px)',
            }}
          >
            <Box sx={{ p: 2 }}>
              {ProductsMock.map((item, index) => (
                <Grid
                  key={item._id}
                  container
                  spacing={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    // width: '100%',
                    padding: '6px',
                    borderBottom: '1px solid #eee',
                    mb: 1,
                    '&.MuiGrid-root:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                  }}
                >
                  <Grid xs={1} md={1}>
                    <Avatar
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '0px',
                        border: '1px solid #eee',
                      }}
                      src={'/images/users/user2.jpg'}
                    />
                  </Grid>
                  <Grid xs={6} md={6}>
                    <Tooltip title={'John'}>
                      <Typography sx={styleOneColumn} fontSize='15px' fontWeight={500}>
                        {item.name}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid xs={2} md={2}>
                    <Typography>$ {item.price}</Typography>
                  </Grid>
                  <Grid xs={2} md={2}>
                    <Typography
                      sx={{
                        color: 'red',
                        fontWeight: 500,
                      }}
                    >
                      In Stock: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid xs={1} md={1}>
                    <AddIcon
                      onClick={() => handleAddtoCart(item)}
                      sx={{
                        cursor: 'pointer',
                        color: '#fff',
                        fontWeight: 500,
                        background: '#1e88e5',
                        borderRadius: '4px',
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  )
}
