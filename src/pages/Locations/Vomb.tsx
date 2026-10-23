import LocationCard from '@/components/SydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import EcommerceMetrics from '@/components/ecommerce/EcommerceMetrics'

const Vomb = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div>
        <LocationCard location={locationById.vomb} />
      </div>
      <div>
        <EcommerceMetrics/>
      </div>
    </div>
  )
}

export default Vomb