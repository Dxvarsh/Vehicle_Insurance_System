import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Shield,
  Search,
  Filter,
  X,
  CreditCard,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchPolicies,
  clearPolicyError,
  selectPolicies,
} from '../../store/slices/policySlice';
import {
  PageHeader,
  Button,
  Badge,
  EmptyState,
  Spinner,
} from '../../components/common';
import { cn } from '../../utils/helpers';

const PolicyListPage = () => {
  const dispatch = useDispatch();
  const { policies, pagination, isLoading } = useSelector(selectPolicies);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    coverageType: '',
    policyDuration: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const handleFilterChange = (key, value) => {
    setQueryParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const getCoverageBadge = (type) => {
    switch (type) {
      case 'Comprehensive':
        return <Badge variant="primary">Comprehensive</Badge>;
      case 'Third-Party':
        return <Badge variant="info">Third-Party</Badge>;
      case 'Own-Damage':
        return <Badge variant="warning">Own-Damage</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Policies"
        subtitle="Explore and purchase the best insurance plans for your vehicles"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Policies' },
        ]}
      />

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search policies by name or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={cn(
                'w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-light bg-bg-primary',
                'text-sm text-text-primary placeholder-text-tertiary',
                'focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all'
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
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-32"
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-light grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
                Coverage Type
              </label>
              <select
                value={queryParams.coverageType}
                onChange={(e) => handleFilterChange('coverageType', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">All Coverage Types</option>
                <option value="Third-Party">Third-Party</option>
                <option value="Comprehensive">Comprehensive</option>
                <option value="Own-Damage">Own-Damage</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
                Policy Duration
              </label>
              <select
                value={queryParams.policyDuration}
                onChange={(e) => handleFilterChange('policyDuration', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">Any Duration</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput('');
                  setQueryParams({
                    page: 1,
                    limit: 12,
                    search: '',
                    coverageType: '',
                    policyDuration: '',
                  });
                }}
                className="mb-1"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Policy List */}
      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : policies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="bg-white rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-500" />
                  </div>
                  {getCoverageBadge(policy.coverageType)}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {policy.policyName}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-2 min-h-[40px]">
                  {policy.description || 'Comprehensive vehicle insurance with flexible coverage options.'}
                </p>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 bg-bg-primary/50 flex items-center justify-between border-y border-border-light">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm font-medium text-text-secondary">
                    {policy.policyDuration} Months
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-tertiary block">Starting from</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{policy.baseAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Features - Hardcoded for demo if not in schema */}
              <div className="p-6 space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Instant Policy Issuance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>24/7 Roadside Assistance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Cashless Repair Network</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0">
                <Link to={`/policies/${policy._id}`}>
                  <Button
                    variant="primary"
                    className="w-full rounded-xl group"
                    rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Shield}
          title="No policies found"
          description="We couldn't find any insurance policies matching your criteria."
        >
          <Button
            variant="outline"
            onClick={() => {
              setSearchInput('');
              setQueryParams({
                page: 1, search: '', coverageType: '', policyDuration: ''
              });
            }}
          >
            Clear All Filters
          </Button>
        </EmptyState>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-text-secondary">
            Page <span className="font-semibold text-text-primary">{pagination.currentPage}</span> of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PolicyListPage;
