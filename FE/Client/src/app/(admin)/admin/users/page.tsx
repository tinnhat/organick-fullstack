'use client'

import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import React from 'react';
import Tables from '../ui-components/table/page';

type Props = {}

export default function Users({}: Props) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <Drawer sx={{
        '& .MuiDrawer-paper': {
          width: '60vw',
        }
      }} variant='temporary' anchor='right' open={open} >
        <p>123</p>
        <Button onClick={toggleDrawer(false)}>Close</Button>
      </Drawer>
      <Tables />
    </div>
  );
}