import { useDeleteOrderMutation } from '@/app/utils/hooks/ordersHooks'
import useFetch from '@/app/utils/useFetch'
import { Box, Button, Modal, Typography } from '@mui/material'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  showDelete: { show: boolean; id: string }
  setShowDelete: React.Dispatch<
    React.SetStateAction<{
      show: boolean
      id: string
    }>
  >
  refetch: () => void
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'max-content',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  borderRadius: '6px',
}

export default function DeleteOrder({ showDelete, setShowDelete, refetch }: Props) {
  const fetchApi = useFetch()
  const { mutateAsync: deleteOrder } = useDeleteOrderMutation(fetchApi)
  const handleClose = () =>
    setShowDelete({
      show: false,
      id: '',
    })
  const handleDelete = async () => {
    const result = await deleteOrder(showDelete.id)
    if (result) {
      refetch()
      handleClose()
      toast.success('Order deleted successfully', { position: 'bottom-right' })
    }
  }
  return (
    <Modal
      open={showDelete.show}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}
          id='modal-modal-title'
          variant='h6'
          component='h2'
        >
          Do you want to delete
          <Typography
            onClick={handleDelete}
            sx={{ color: 'red', ml: { xs: 0, sm: 0, md: 1, lg: 1 } }}
          >
            {showDelete.id}
          </Typography>
        </Typography>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Button variant='contained'>Confirm</Button>
          <Button sx={{ ml: 2 }} variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
