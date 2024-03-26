/* eslint-disable quotes */
import { useGetUserInfoQuery } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import { DotLoader } from 'react-spinners'
export const SidebarProfile = () => {
  const fetchApi = useFetch()
  const { data: session } = useSession()
  const { data: userInfo, isLoading } = useGetUserInfoQuery(fetchApi, session?.user._id)

  return (
    <Box
      sx={{
        backgroundImage: `url('/images/backgrounds/sidebar-profile-bg.jpg')`,
        borderRadius: '0 !important',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
      }}
    >
      <>
        <Box px='12px' py='28px' borderRadius='0 !important'>
          {isLoading ? (
            <DotLoader size={20} color='#274c5b' />
          ) : (
            <Avatar
              alt={userInfo?.fullname}
              src={userInfo?.avatar}
              sx={{ height: 50, width: 50 }}
            />
          )}
        </Box>

        <Box
          display='flex'
          alignItems='center'
          sx={{ py: 1, px: 2, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '0 !important' }}
        >
          <Typography
            variant='h6'
            fontSize='13px'
            color='white'
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {userInfo?.fullname}
          </Typography>
        </Box>
      </>
    </Box>
  )
}
