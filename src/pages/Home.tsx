import React from 'react'
import LocationCard from '@/components/sydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import Label from '@/components/form/Label'
const Home = () => {
  return (
    
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <Label><h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Översikt</h4> </Label>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <LocationCard location={locationById.vomb} />
      <LocationCard location={locationById.ringsjon} />
      <LocationCard location={locationById.bolmen} />
      </div>
      
    </div>
  )
}

export default Home