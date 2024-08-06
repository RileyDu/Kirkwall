import { Button } from '@chakra-ui/react'
import React from 'react'

const Admin = ({ onClick }) => {
  return (
    <Button size="lg" w="100%" fontSize="x-large" borderRadius={'full'} variant={'solid'} mb="10px" onClick={onClick}>Admin</Button>
  )
}

export default Admin