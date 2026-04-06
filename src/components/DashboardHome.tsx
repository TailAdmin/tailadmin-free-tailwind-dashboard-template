import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { Skeleton } from '@mui/material';

const DashboardHome: React.FC = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 800);
		return () => clearTimeout(timer);
	}, []);

	const chartOptions: any = {
		chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
		colors: ['#8b5cf6', '#3b82f6'],
		dataLabels: { enabled: false },
		stroke: { curve: 'smooth', width: 3 },
		fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100, 100, 100] } },
		grid: { borderColor: 'rgba(255, 255, 255, 0.05)', strokeDashArray: 4 },
		xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], labels: { style: { colors: 'rgba(255, 255, 255, 0.3)' } }, axisBorder: { show: false }, axisTicks: { show: false } },
		yaxis: { labels: { style: { colors: 'rgba(255, 255, 255, 0.3)' } } },
		tooltip: { theme: 'dark' }
	};

	const chartSeries = [
		{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] },
		{ name: 'Sales', data: [11, 32, 45, 32, 34, 52, 41] }
	];

	const StatCard = ({ label, value, trend }: any) => (
		<motion.div whileHover={{ translateY: -4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
			<div className="text-white/40 text-sm font-medium">{label}</div>
			<div className="text-2xl font-bold mt-2">{value}</div>
			<div className="text-xs font-bold text-brand-primary mt-2">{trend} vs last month</div>
		</motion.div>
	);

	if (loading) {
		return (
			<>
				<header className="flex justify-between items-center mb-10">
					<div>
						<Skeleton variant="text" width={250} height={40} className="bg-white/5" />
						<Skeleton variant="text" width={180} height={20} className="mt-1 bg-white/5" />
					</div>
				</header>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} variant="rectangular" height={120} className="rounded-2xl bg-white/5" />
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<Skeleton variant="rectangular" height={450} className="rounded-3xl bg-white/5" />
					</div>
					<div>
						<Skeleton variant="rectangular" height={450} className="rounded-3xl bg-white/5" />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<header className="flex justify-between items-center mb-10">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
					<p className="text-white/40 mt-1">Check your performance metrics today</p>
				</div>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
				<StatCard label="Total Revenue" value="$128,430" trend="+12.5%" />
				<StatCard label="Active Users" value="42,891" trend="+8.2%" />
				<StatCard label="Conversion" value="3.24%" trend="+2.1%" />
				<StatCard label="Page Views" value="1.2M" trend="+15.8%" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-8">
					<h3 className="text-lg font-bold mb-6">Revenue Analytics</h3>
					<div id="chart">
						<ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} />
					</div>
				</div>

				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-8">
					<h3 className="text-lg font-bold mb-6">Audience Growth</h3>
					<div className="space-y-6">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-white/10" />
									<div>
										<div className="text-sm font-semibold">User {i}</div>
										<div className="text-xs text-white/30">Just joined</div>
									</div>
								</div>
								<div className="text-xs font-bold text-brand-primary">NEW</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardHome;
