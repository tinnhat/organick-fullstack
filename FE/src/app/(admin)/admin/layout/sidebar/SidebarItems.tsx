import React from 'react'
import Menuitems from './MenuItems'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import NavItem from './NavItem'
const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname()
  const pathDirect = pathname

  return (
    <Box sx={{ px: 2 }}>
      <List sx={{ pt: 0 }} className='sidebarNav' component='div'>
        {Menuitems.map(item => {
          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
          )
        })}
      </List>
    </Box>
  )
}
export default SidebarItems
