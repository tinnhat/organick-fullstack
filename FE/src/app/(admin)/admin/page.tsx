'use client'
import { Grid, Box } from '@mui/material'
// components
import SalesOverview from './components/dashboard/TheSalesOverview'
import ProfileCard from './components/dashboard/TheProfileCard'
import MyContacts from './components/dashboard/TheMyContacts'
import PageContainer from './components/container/PageContainer'
const Dashboard = () => {
  return (
    <PageContainer title='Dashboard' description='this is Dashboard'>
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProfileCard />
              </Grid>
              <Grid item xs={12}>
                <MyContacts />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard
