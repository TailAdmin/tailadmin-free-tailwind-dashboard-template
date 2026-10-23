import LocationCard from '@/components/SydvattenKPI/LocationCard'
import EcommerceMetrics from '@/components/ecommerce/EcommerceMetrics'
import { locationById, type LocationId } from '@/data/locations'

export default function LocationOverview({ id }: { id: LocationId }) {
  const location = locationById[id]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <LocationCard location={location} />
      <EcommerceMetrics />
    </div>
  )
}