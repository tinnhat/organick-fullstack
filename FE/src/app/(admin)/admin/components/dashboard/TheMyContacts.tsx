import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Badge from '@mui/material/Badge'

const contacts = [
  {
    img: '/images/users/1.webp',
    title: 'Oliver Jake',
    subtext: 'info@oliver.com',
    status: 'primary.main'
  },
  {
    img: '/images/users/2.webp',
    title: 'Jack Connor',
    subtext: 'info@jack.com',
    status: 'secondary.main'
  },
  {
    img: '/images/users/3.webp',
    title: 'Harry Callum',
    subtext: 'info@harry.com',
    status: 'error.main'
  },
  {
    img: '/images/users/4.webp',
    title: 'Jacob Reece',
    subtext: 'info@jacob.com',
    status: 'warning.main'
  }
]

const MyContacts = () => {
  return (
    <>
      <Card variant='outlined' sx={{ p: 0 }}>
        <Box
          px={3}
          py={2}
          bgcolor='primary.main'
          color='white'
          borderRadius='0 !important'
          mb='-15px'
        >
          <Typography variant='h5'>My Contacts</Typography>
          <Typography variant='subtitle1'>Checkout my contacts here</Typography>
        </Box>
        <Box pt={2}>
          <List>
            {contacts.map((contact, i) => (
              <ListItem key={i}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Badge
                      variant='dot'
                      sx={{
                        '.MuiBadge-badge': {
                          backgroundColor: contact.status
                        }
                      }}
                    >
                      <Avatar src={contact.img} alt='1' />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.title}
                    primaryTypographyProps={{
                      fontSize: '16px',
                      fontWeight: 500
                    }}
                    secondary={contact.subtext}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Card>
    </>
  )
}

export default MyContacts
