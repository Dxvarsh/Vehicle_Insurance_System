import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Car,
  Search,
  Eye,
  Edit3,
  Trash2,
  Filter,
  X,
  Plus,
  Bike,
  Truck,
} from 'lucide-react';
import {
  fetchAllVehicles,
  fetchVehicleStats,
  deleteVehicle,
  selectVehicles,
} from '../../store/slices/vehicleSlice';
import {
  PageHeader,
  StatsCard,
  Button,
  Badge,
  Modal,
  DataTable,
} from '../../components/common';
import { formatDate, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminVehicleListPage = () => {
  const dispatch = useDispatch();
  const { vehicles, pagination, stats, isLoading, isSubmitting } =
    useSelector(selectVehicles);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    vehicleType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, vehicle: null });

  // Fetch vehicles
  const loadVehicles = useCallback(() => {
    const params = { ...queryParams };
    Object.keys(params).forEach((key) => {
      if (params[key] === '') delete params[key];
    });
    dispatch(fetchAllVehicles(params));
  }, [dispatch, queryParams]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Fetch stats
  useEffect(() => {
    dispatch(fetchVehicleStats());
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (page) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (key, value) => {
    setQueryParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setQueryParams({
      page: 1,
      limit: 10,
      search: '',
      vehicleType: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteVehicle(deleteModal.vehicle._id)).unwrap();
      toast.success('Vehicle deleted successfully');
      setDeleteModal({ isOpen: false, vehicle: null });
      dispatch(fetchVehicleStats());
    } catch (err) {
      toast.error(err || 'Failed to delete vehicle');
    }
  };

  // Determine base path based on current URL
  const basePath = window.location.pathname.includes('/staff/') ? '/staff' : '/admin';

  // Table columns
  const columns = [
    {
      header: 'Vehicle',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center',
            row.vehicleType === '2-Wheeler' ? 'bg-info-light' :
            row.vehicleType === '4-Wheeler' ? 'bg-primary-50' : 'bg-warning-light'
          )}>
            <Car className={cn(
              'w-4 h-4',
              row.vehicleType === '2-Wheeler' ? 'text-info' :
              row.vehicleType === '4-Wheeler' ? 'text-primary-500' : 'text-warning'
            )} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {row.vehicleNumber}
            </p>
            <p className="text-xs text-text-tertiary">{row.vehicleID}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Model',
      render: (row) => (
        <span className="text-sm text-text-primary">{row.model}</span>
      ),
    },
    {
      header: 'Type',
      render: (row) => (
        <Badge variant={
          row.vehicleType === '2-Wheeler' ? 'info' :
          row.vehicleType === '4-Wheeler' ? 'primary' : 'warning'
        }>
          {row.vehicleType}
        </Badge>
      ),
    },
    {
      header: 'Owner',
      render: (row) => (
        <div>
          <p className="text-sm text-text-primary">
            {row.customerID?.name || 'N/A'}
          </p>
          <p className="text-xs text-text-tertiary">
            {row.customerID?.customerID || ''}
          </p>
        </div>
      ),
    },
    {
      header: 'Year',
      render: (row) => (
        <div>
          <p className="text-sm text-text-primary">{row.registrationYear}</p>
          <p className="text-xs text-text-tertiary">
            {new Date().getFullYear() - row.registrationYear}yr old
          </p>
        </div>
      ),
    },
    {
      header: 'Added',
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`${basePath}/vehicles/${row._id}`}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-primary-500 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`${basePath}/vehicles/${row._id}/edit`}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-info transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteModal({ isOpen: true, vehicle: row })}
            className="p-2 rounded-lg hover:bg-danger-light text-text-secondary hover:text-danger transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Vehicle Management"
        subtitle="View and manage all registered vehicles"
      >
        <Link to={`${basePath}/vehicles/add`}>
          <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">
            Add Vehicle
          </Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Vehicles"
          value={stats?.total || 0}
          icon={Car}
          iconBgClass="bg-primary-50"
          iconClass="text-primary-500"
          trend={
            stats?.growthPercentage !== undefined
              ? {
                  value: Math.abs(stats.growthPercentage),
                  type: stats.growthPercentage >= 0 ? 'up' : 'down',
                  label: 'vs last month',
                }
              : undefined
          }
        />
        <StatsCard
          title="2-Wheelers"
          value={stats?.byType?.['2-Wheeler'] || 0}
          icon={Car}
          iconBgClass="bg-info-light"
          iconClass="text-info"
        />
        <StatsCard
          title="4-Wheelers"
          value={stats?.byType?.['4-Wheeler'] || 0}
          icon={Car}
          iconBgClass="bg-success-light"
          iconClass="text-success"
        />
        <StatsCard
          title="Commercial"
          value={stats?.byType?.['Commercial'] || 0}
          icon={Truck}
          iconBgClass="bg-warning-light"
          iconClass="text-warning"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by vehicle number, model, or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light bg-bg-primary',
                'text-sm text-text-primary placeholder-text-tertiary',
                'focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500'
              )}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="sm"
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-3 items-center">
            <select
              value={queryParams.vehicleType}
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
              className="px-3 py-2 rounded-lg border border-border-light text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">All Types</option>
              <option value="2-Wheeler">2-Wheeler</option>
              <option value="4-Wheeler">4-Wheeler</option>
              <option value="Commercial">Commercial</option>
            </select>

            <select
              value={queryParams.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 rounded-lg border border-border-light text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="createdAt">Sort: Newest</option>
              <option value="vehicleNumber">Sort: Number</option>
              <option value="model">Sort: Model</option>
              <option value="registrationYear">Sort: Year</option>
            </select>

            <select
              value={queryParams.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value, 10))}
              className="px-3 py-2 rounded-lg border border-border-light text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={vehicles}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        emptyMessage="No vehicles found"
        emptyIcon={Car}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, vehicle: null })}
        title="Delete Vehicle"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, vehicle: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-text-primary">
            {deleteModal.vehicle?.vehicleNumber}
          </span>{' '}
          ({deleteModal.vehicle?.model})?
        </p>
        <p className="text-sm text-danger bg-danger-light p-3 rounded-lg mt-3">
          ⚠️ Vehicle can only be deleted if there are no active policies, pending payments, or pending claims.
        </p>
      </Modal>
    </div>
  );
};

export default AdminVehicleListPage;