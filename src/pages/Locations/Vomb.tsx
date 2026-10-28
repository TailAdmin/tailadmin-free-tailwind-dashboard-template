import LocationCard from '@/components/sydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/sydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/sydvattenKPI/VattenNivaCard'

const Vomb = () => {
  
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Vomb</h4> 
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      
        <LocationCard location={locationById.vomb} />
     
        <VattenNivaCard location ={locationById.vomb}/>
    
        <LatestFlowCard location ={locationById.vomb} />
    
      
    </div>
    </div>
  )
}

export default Vomb