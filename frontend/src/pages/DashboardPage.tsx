import { Package, AlertTriangle, Users, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useDashboardData } from '../hooks/dashboard';
import IsLoadingDisplay from '../components/common/IsLoadingDisplay';
import IsErrorDisplay from '../components/common/IsErrorDisplay';


const monthMap = {
    January: 'Jan',
    February: 'Feb',
    March: 'Mar',
    April: 'Apr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Aug',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dec',
};


const recentActivities = [
    { id: 1, type: 'sale', message: 'Bill #1234 generated - ₹0000', time: '5 mins ago' },
    { id: 2, type: 'product', message: 'New product added: Car Perfume Set', time: '23 mins ago' },
    { id: 3, type: 'stock', message: 'Stock updated for Premium Floor Mats', time: '1 hour ago' },
    { id: 4, type: 'vendor', message: 'New vendor registered: AutoParts Pro', time: '2 hours ago' },
    { id: 5, type: 'return', message: 'Product return processed - ₹1,200', time: '3 hours ago' },
    { id: 6, type: 'sale', message: 'Bill #1233 generated - ₹3,890', time: '4 hours ago' },
];


export default function DashboardPage() {
    const [alertsExpanded, setAlertsExpanded] = useState(true);
    const [activityExpanded, setActivityExpanded] = useState(true);

    const { data: dashboardData, isLoading, isError } = useDashboardData();

    if (isLoading) return <IsLoadingDisplay />;

    if (isError) return <IsErrorDisplay type='dashboard' />;

    const kpis = [
        {
            title: 'Total Products',
            value: dashboardData?.total_products,
            change: '+12%',
            trend: 'up',
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Low Stock Items',
            value: dashboardData?.low_stock,
            change: '+5',
            trend: 'up',
            icon: AlertTriangle,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
        {
            title: 'Total Vendors',
            value: dashboardData?.total_vendors,
            change: '+3',
            trend: 'up',
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: "Today's Sales",
            value: dashboardData?.total_sales_today,
            change: '+18%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Bills Generated',
            value: dashboardData?.total_bills,
            change: '+24',
            trend: 'up',
            icon: FileText,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            title: 'Monthly Revenue',
            value: '₹' + dashboardData?.monthly_revenue,
            change: '+22%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
        },
    ];

    const salesData = dashboardData?.monthly_sales.map(item => ({
        month: monthMap[item.month as keyof typeof monthMap],
        sales: item.total_sales
    }));


    const stockAlerts = dashboardData?.low_stock_products || [];



    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {kpis.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={index}
                            className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                                    <h3 className="text-foreground mb-2">{kpi.value}</h3>
                                    <div className="flex items-center gap-1">
                                        {kpi.trend === 'up' ? (
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {kpi.change}
                                        </span>
                                    </div>
                                </div>
                                <div className={`${kpi.bgColor} ${kpi.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sales Chart */}
            <div className="bg-card rounded-xl p-5 lg:p-6 border border-border shadow-sm">
                <h2 className="mb-4">Sales Overview</h2>
                <div className="h-80 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#2563eb"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorSales)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stock Alerts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Stock Alerts */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div
                        className="p-5 border-b border-border flex items-center justify-between cursor-pointer lg:cursor-default"
                        onClick={() => window.innerWidth < 1024 && setAlertsExpanded(!alertsExpanded)}
                    >
                        <h3>Stock Alerts</h3>
                        <span className="lg:hidden text-muted-foreground">{alertsExpanded ? '−' : '+'}</span>
                    </div>
                    <div className={`${alertsExpanded ? 'block' : 'hidden'} lg:block`}>
                        <div className="divide-y divide-border">
                            {
                                stockAlerts.length === 0 && (
                                    <div className="p-4">
                                        <p className="text-sm text-muted-foreground text-center">No Low stock  found.</p>
                                    </div>
                                )
                            }
                            {stockAlerts.map((alert, index) => (
                                <div key={index} className="p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{alert.product__product_name}</p>
                                            <p className="text-sm text-muted-foreground mt-1">SKU: {alert.vendor__name}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm text-amber-600">{alert.stock} units</p>
                                            <p className="text-xs text-muted-foreground mt-1">Min: 5</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div
                        className="p-5 border-b border-border flex items-center justify-between cursor-pointer lg:cursor-default"
                        onClick={() => window.innerWidth < 1024 && setActivityExpanded(!activityExpanded)}
                    >
                        <h3>Recent Activity</h3>
                        <span className="lg:hidden text-muted-foreground">{activityExpanded ? '−' : '+'}</span>
                    </div>
                    <div className={`${activityExpanded ? 'block' : 'hidden'} lg:block`}>
                        <div className="divide-y divide-border">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}