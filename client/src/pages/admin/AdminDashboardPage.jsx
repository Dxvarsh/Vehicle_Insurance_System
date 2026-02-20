import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDashboardStats,
    fetchChartData,
    clearDashboardError
} from '../../store/slices/dashboardSlice';
import {
    Users,
    ShieldCheck,
    IndianRupee,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    PieChart as PieChartIcon,
    BarChart3
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboardPage = () => {
    const dispatch = useDispatch();
    const { stats, charts, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchChartData());
        return () => dispatch(clearDashboardError());
    }, [dispatch]);

    if (loading && !stats) {
        return <Loader fullScreen text="Synthesizing system metrics..." />;
    }

    const statCards = [
        {
            title: 'Total Customers',
            value: stats?.customers || 0,
            icon: Users,
            color: 'indigo',
            trend: '+12%',
            trendUp: true,
            description: 'Total registered profiles'
        },
        {
            title: 'Active Policies',
            value: stats?.activePolicies || 0,
            icon: ShieldCheck,
            color: 'emerald',
            trend: '+5%',
            trendUp: true,
            description: 'Policies currently in force'
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.premiumCollected || 0),
            icon: IndianRupee,
            color: 'amber',
            trend: '+8%',
            trendUp: true,
            description: 'Gross premiums collected'
        },
        {
            title: 'Claims Paid',
            value: formatCurrency(stats?.claimsPaid || 0),
            icon: AlertCircle,
            color: 'rose',
            trend: '-2%',
            trendUp: false,
            description: 'Settled claim amounts'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <PageHeader
                title="System Insights"
                subtitle="Comprehensive overview of VIMS performance and operations"
            />

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearDashboardError())} />}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                card.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                                    card.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                        card.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                            "bg-rose-50 text-rose-600"
                            )}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                                card.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {card.trend}
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                        <p className="text-2xl font-black text-gray-900 mt-1">{card.value}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">{card.description}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Revenue Growth
                            </h3>
                            <p className="text-sm text-gray-500">Monthly premium collection trends</p>
                        </div>
                    </div>
                    <div className="h-80 w-full" style={{ minHeight: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <AreaChart data={charts.monthlyPremiums}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                                    tickFormatter={(val) => `₹${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Policy Distribution Chart */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-indigo-500" />
                            Policy Mix
                        </h3>
                        <p className="text-sm text-gray-500">Coverage type distribution</p>
                    </div>
                    <div className="h-64 w-full" style={{ minHeight: '256px' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <PieChart>
                                <Pie
                                    data={charts.policyDistribution}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {charts.policyDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        {charts.policyDistribution.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                    <span className="text-gray-600 font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-900 font-bold">{item.value} Units</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Claims Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-rose-500" />
                                Claim Lifecycle
                            </h3>
                            <p className="text-sm text-gray-500">Breakdown of claim statuses</p>
                        </div>
                    </div>
                    <div className="h-64 w-full" style={{ minHeight: '256px' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <BarChart data={charts.claimBreakdown} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="status"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                    {charts.claimBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-black mb-2">Automated Insights</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-md">
                            Your system is performing <span className="font-bold underline">optimally</span>.
                            Revenue is up 8% compared to last month, driven by a surge in "Comprehensive" policy purchases.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Health Score</p>
                            <p className="text-2xl font-bold mt-1">98%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Loss Ratio</p>
                            <p className="text-2xl font-bold mt-1">14%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Uptime</p>
                            <p className="text-2xl font-bold mt-1">99.9</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;