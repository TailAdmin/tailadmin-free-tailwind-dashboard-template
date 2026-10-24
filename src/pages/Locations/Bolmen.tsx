import React from 'react'
import EcommerceMetrics from '@/components/TailAdminComponents/ecommerce/EcommerceMetrics'
import StatisticsChart from '@/components/TailAdminComponents/ecommerce/StatisticsChart'

const Bolmen = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Bolmen</h4> 
      <EcommerceMetrics/>
              <StatisticsChart />
            
    
    </div>
  )
}

export default Bolmen