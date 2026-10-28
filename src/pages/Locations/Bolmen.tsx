import React from 'react'
import EcommerceMetrics from '@/components/TailAdminComponents/ecommerce/EcommerceMetrics'
import StatisticsChart from '@/components/TailAdminComponents/ecommerce/StatisticsChart'
import ChartTab from '@/components/TailAdminComponents/common/ChartTab'
import SignUpForm from '@/components/TailAdminComponents/auth/SignUpForm'
import DangerZone from '@/components/TailAdminComponents/UserProfile/DangerZone'
import { Calendar } from '@fullcalendar/react'
import { Modal } from '@/components/ui/modal'
import BarChart from '../TailAdminPages/Charts/BarChart'
import LineChart from '../TailAdminPages/Charts/LineChart'
import BasicTables from '../TailAdminPages/Tables/BasicTables'

const Bolmen = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Bolmen</h4> 
       <BarChart></BarChart>
       <LineChart></LineChart>
       <BasicTables></BasicTables>
    </div>
  )
}

export default Bolmen