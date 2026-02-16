import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Shield,
  Search,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  fetchPolicies,
  selectPolicies,
} from '../../store/slices/policySlice';
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  DataTable,
} from '../../components/common';
import { formatDate, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';
import policyService from '../../services/policyService';

const AdminPolicyListPage = () => {
  const dispatch = useDispatch();
  const { policies, pagination, isLoading } = useSelector(selectPolicies);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    coverageType: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [toggleModal, setToggleModal] = useState({ isOpen: false, policy: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch policies
  const loadPolicies = useCallback(() => {
    const params = { ...queryParams };
    Object.keys(params).forEach((key) => {
      if (params[key] === '') delete params[key];
    });
    dispatch(fetchPolicies(params));
  }, [dispatch, queryParams]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

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

  const handleToggleStatus = async () => {
    setIsSubmitting(true);
    try {
      await policyService.adminTogglePolicyStatus(toggleModal.policy._id);
      toast.success(`Policy ${toggleModal.policy.isActive ? 'deactivated' : 'activated'} successfully`);
      setToggleModal({ isOpen: false, policy: null });
      loadPolicies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update policy status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const basePath = window.location.pathname.includes('/staff/') ? '/staff' : '/admin';

  const columns = [
    {
      header: 'Policy Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{row.policyName}</p>
            <p className="text-xs text-text-tertiary">{row.policyID}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Coverage',
      render: (row) => (
        <Badge variant={
          row.coverageType === 'Comprehensive' ? 'primary' :
          row.coverageType === 'Third-Party' ? 'info' : 'warning'
        }>
          {row.coverageType}
        </Badge>
      ),
    },
    {
      header: 'Base Amount',
      render: (row) => (
        <span className="text-sm font-mono text-text-primary">
          ₹{row.baseAmount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Duration',
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.policyDuration} Months</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Created',
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
            to={`/policies/${row._id}`}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-primary-500 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {/* Only Admin can edit/toggle */}
          {!basePath.includes('staff') && (
            <>
              <Link
                to={`${basePath}/policies/${row._id}/edit`}
                className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-info transition-colors"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setToggleModal({ isOpen: true, policy: row })}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  row.isActive 
                    ? "hover:bg-danger-light text-text-secondary hover:text-danger" 
                    : "hover:bg-success-light text-text-secondary hover:text-success"
                )}
                title={row.isActive ? "Deactivate" : "Activate"}
              >
                {row.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Policy Management"
        subtitle="Manage insurance policies and plans"
      >
        {!basePath.includes('staff') && (
          <Link to={`${basePath}/policies/new`}>
            <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">
              Create Policy
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4 mb-6">
        {/* ... Similar filter UI as other lists ... */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light bg-bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
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
              value={queryParams.coverageType}
              onChange={(e) => handleFilterChange('coverageType', e.target.value)}
              className="px-3 py-2 rounded-lg border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">All Coverage</option>
              <option value="Comprehensive">Comprehensive</option>
              <option value="Third-Party">Third-Party</option>
              <option value="Own-Damage">Own-Damage</option>
            </select>
            <select
              value={queryParams.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-3 py-2 rounded-lg border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <Button variant="ghost" size="sm" onClick={() => {
              setSearchInput('');
              setQueryParams({ page: 1, limit: 10, search: '', coverageType: '', isActive: '' });
            }}>
              Clear
            </Button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={policies}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        emptyMessage="No policies found"
        emptyIcon={Shield}
      />

      <Modal
        isOpen={toggleModal.isOpen}
        onClose={() => setToggleModal({ isOpen: false, policy: null })}
        title={toggleModal.policy?.isActive ? "Deactivate Policy" : "Activate Policy"}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setToggleModal({ isOpen: false, policy: null })}>Cancel</Button>
            <Button 
              variant={toggleModal.policy?.isActive ? "danger" : "success"} 
              onClick={handleToggleStatus} 
              isLoading={isSubmitting}
            >
              {toggleModal.policy?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          Are you sure you want to {toggleModal.policy?.isActive ? "deactivate" : "activate"}{' '}
          <span className="font-bold text-text-primary">{toggleModal.policy?.policyName}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default AdminPolicyListPage;
