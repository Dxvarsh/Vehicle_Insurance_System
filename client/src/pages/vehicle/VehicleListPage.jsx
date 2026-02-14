import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Car,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Filter,
  X,
  Calendar,
  Hash,
} from 'lucide-react';
import {
  fetchMyVehicles,
  deleteVehicle,
  clearVehicleError,
  selectVehicles,
} from '../../store/slices/vehicleSlice';
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  EmptyState,
  Spinner,
} from '../../components/common';
import { cn, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const VehicleListPage = () => {
  const dispatch = useDispatch();
  const { vehicles, pagination, isLoading, isSubmitting } =
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
    dispatch(fetchMyVehicles(params));
  }, [dispatch, queryParams]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearVehicleError());
    };
  }, [dispatch]);

  const handlePageChange = (page) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (key, value) => {
    setQueryParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteVehicle(deleteModal.vehicle._id)).unwrap();
      toast.success('Vehicle deleted successfully');
      setDeleteModal({ isOpen: false, vehicle: null });
    } catch (err) {
      toast.error(err || 'Failed to delete vehicle');
    }
  };

  const getVehicleTypeColor = (type) => {
    switch (type) {
      case '2-Wheeler':
        return { bg: 'bg-info-light', text: 'text-info-dark', icon: 'text-info' };
      case '4-Wheeler':
        return { bg: 'bg-primary-50', text: 'text-primary-600', icon: 'text-primary-500' };
      case 'Commercial':
        return { bg: 'bg-warning-light', text: 'text-warning-dark', icon: 'text-warning' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500' };
    }
  };

  return (
    <div>
      <PageHeader
        title="My Vehicles"
        subtitle="Manage your registered vehicles"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Vehicles' },
        ]}
      >
        <Link to="/vehicles/add">
          <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">
            Add Vehicle
          </Button>
        </Link>
      </PageHeader>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by vehicle number, model..."
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput('');
                setQueryParams({
                  page: 1,
                  limit: 10,
                  search: '',
                  vehicleType: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                });
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Vehicle Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : vehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {vehicles.map((vehicle) => {
              const typeColor = getVehicleTypeColor(vehicle.vehicleType);
              return (
                <div
                  key={vehicle._id}
                  className="bg-white rounded-xl shadow-sm border border-border-light hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={cn('px-6 py-4', typeColor.bg)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Car className={cn('w-6 h-6', typeColor.icon)} />
                        <div>
                          <h3 className="font-bold text-text-primary">
                            {vehicle.vehicleNumber}
                          </h3>
                          <p className="text-xs text-text-secondary">
                            {vehicle.vehicleID}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        vehicle.vehicleType === '2-Wheeler' ? 'info' :
                        vehicle.vehicleType === '4-Wheeler' ? 'primary' : 'warning'
                      }>
                        {vehicle.vehicleType}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Model</span>
                        <span className="text-sm font-medium text-text-primary">
                          {vehicle.model}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Reg. Year</span>
                        <span className="text-sm font-medium text-text-primary">
                          {vehicle.registrationYear}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Vehicle Age</span>
                        <span className="text-sm font-medium text-text-primary">
                          {new Date().getFullYear() - vehicle.registrationYear} years
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Added On</span>
                        <span className="text-sm text-text-tertiary">
                          {formatDate(vehicle.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-3 bg-bg-primary border-t border-border-light flex items-center justify-between">
                    <Link
                      to={`/vehicles/${vehicle._id}`}
                      className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/vehicles/${vehicle._id}/edit`}
                        className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-primary-500 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, vehicle })
                        }
                        className="p-2 rounded-lg hover:bg-danger-light text-text-secondary hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary px-3">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Car}
          title="No vehicles registered"
          description="Add your first vehicle to start purchasing insurance policies"
        >
          <Link to="/vehicles/add">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Add Your First Vehicle
            </Button>
          </Link>
        </EmptyState>
      )}

      {/* Delete Confirmation Modal */}
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
              Delete Vehicle
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          Are you sure you want to delete vehicle{' '}
          <span className="font-semibold text-text-primary">
            {deleteModal.vehicle?.vehicleNumber}
          </span>{' '}
          ({deleteModal.vehicle?.model})?
        </p>
        <p className="text-sm text-danger bg-danger-light p-3 rounded-lg mt-3">
          ⚠️ This action cannot be undone. Vehicle can only be deleted if there are no active policies or pending claims.
        </p>
      </Modal>
    </div>
  );
};

export default VehicleListPage;