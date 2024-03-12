import { Tooltip, Typography } from '@mui/material'
import React from 'react'

type Props = {
  data: any,
  showToolTip?: boolean
}

const styleOneColumn = {
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical'
}

export default function TypographyTooltip({data, showToolTip = false}: Props) {
  return showToolTip ? (
    <Tooltip title={data}>
      <Typography sx={styleOneColumn} fontSize='15px' fontWeight={500}>
        {data}
      </Typography>
    </Tooltip>
  ) : (
    <Typography sx={styleOneColumn} fontSize='15px' fontWeight={500}>
      {data}
    </Typography>
  )
}