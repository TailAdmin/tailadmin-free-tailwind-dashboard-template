import LocationCard from '@/components/sydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/sydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/sydvattenKPI/VattenNivaCard'

const Vomb = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <div>
        <LocationCard location={locationById.vomb} />
        
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <LatestFlowCard location ={locationById.vomb} />
        <VattenNivaCard location ={locationById.vomb}/>
      </div>
    </div>
  )
}

export default Vomb