import Label from '@/components/form/Label'
import SkaneOverview from '@/components/sydvattenKPI/SkaneOverview'
import React from 'react'

const Kommuner = () => {
  return (
    <div>
    <Label className=''>Översikt</Label>
    <SkaneOverview />
    </div>
  )
}

export default Kommuner