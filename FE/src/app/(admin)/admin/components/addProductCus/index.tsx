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
  ClickAwayListener,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import React, { useEffect, useState } from 'react'
import { ProductsMock } from '@/app/common/mockData'
import { useGetAllProductsQuery } from '@/app/utils/hooks/productsHooks'
import { cloneDeep } from 'lodash'

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

function AddProductCus({ cart, setCart }: Props) {
  const { data: allProducts, isLoading } = useGetAllProductsQuery()
  const [productsShow, setProductsShow] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (allProducts) {
      setProductsShow(allProducts)
    }
  }, [allProducts])
  const handleAddtoCart = (item: Product) => {
    const itemCart = cart.find((cartItem: Product) => cartItem._id === item._id)
    if (itemCart) {
      const cloneCart: any = cloneDeep(cart)
      const findIndexItem = cloneCart.findIndex(
        (cartItem: Product) => cartItem._id === itemCart._id
      )
      cloneCart[findIndexItem].quantityAddtoCart += 1
      setCart([...cloneCart])
      return
    }
    setCart([
      ...cart,
      {
        ...item,
        quantityAddtoCart: 1,
      },
    ])
  }
  const handleSearch = () => {
    setShow(true)
    if (!search) {
      //show all product
      setProductsShow(allProducts)
    } else {
      const productFilter = allProducts?.filter((item: Product) => {
        return item.name.toLowerCase().includes(search.toLowerCase())
      })
      setProductsShow(productFilter)
      //show theo filter
    }
  }

  const handleClickAway = () => {
    setShow(false)
  }

  if (isLoading) return <div>Loading...</div>

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
              <SearchIcon sx={{ cursor: 'pointer' }} onClick={handleSearch} />
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
              {productsShow.map((item: Product, index: number) => (
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
                      src={item.image?.toString()}
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

export default React.memo(AddProductCus)