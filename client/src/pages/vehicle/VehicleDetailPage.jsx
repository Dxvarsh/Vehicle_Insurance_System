import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Car,
  Hash,
  Calendar,
  User,
  ArrowLeft,
  Edit3,
  FileText,
  Shield,
} from 'lucide-react';
import {
  fetchVehicleById,
  clearSelectedVehicle,
  selectVehicles,
} from '../../store/slices/vehicleSlice';
import { selectAuth } from '../../store/slices/authSlice';
import {
  PageHeader,
  Button,
  Badge,
  Spinner,
  EmptyState,
} from '../../components/common';
import { formatDate, formatCurrency } from '../../utils/helpers';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedVehicle, isLoading } = useSelector(selectVehicles);
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(id));
    }
    return () => {
      dispatch(clearSelectedVehicle());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedVehicle?.vehicle) {
    return (
      <EmptyState
        icon={Car}
        title="Vehicle not found"
        description="The vehicle you're looking for doesn't exist."
      >
        <Button onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
      </EmptyState>
    );
  }

  const { vehicle, activePolicies, hasActivePolicies } = selectedVehicle;
  const vehicleAge = new Date().getFullYear() - vehicle.registrationYear;

  const detailFields = [
    { icon: Hash, label: 'Vehicle ID', value: vehicle.vehicleID },
    { icon: Car, label: 'Vehicle Number', value: vehicle.vehicleNumber },
    { icon: Car, label: 'Vehicle Type', value: vehicle.vehicleType },
    { icon: Car, label: 'Model', value: vehicle.model },
    { icon: Calendar, label: 'Registration Year', value: vehicle.registrationYear },
    { icon: Calendar, label: 'Vehicle Age', value: `${vehicleAge} year${vehicleAge !== 1 ? 's' : ''}` },
    { icon: Calendar, label: 'Added On', value: formatDate(vehicle.createdAt) },
  ];

  // Add owner info for Admin/Staff
  if (vehicle.customerID && typeof vehicle.customerID === 'object') {
    detailFields.splice(1, 0, {
      icon: User,
      label: 'Owner',
      value: `${vehicle.customerID.name} (${vehicle.customerID.customerID})`,
    });
  }

  return (
    <div>
      <PageHeader
        title="Vehicle Details"
        subtitle={`Details for ${vehicle.vehicleNumber}`}
        breadcrumbs={[
          { label: 'Dashboard', href: user?.role === 'Customer' ? '/dashboard' : `/${user?.role?.toLowerCase()}/dashboard` },
          { label: 'Vehicles', href: user?.role === 'Customer' ? '/vehicles' : `/${user?.role?.toLowerCase()}/vehicles` },
          { label: vehicle.vehicleNumber },
        ]}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Link to={`/vehicles/${vehicle._id}/edit`}>
            <Button size="sm" leftIcon={<Edit3 className="w-4 h-4" />}>
              Edit
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="max-w-3xl">
        {/* Vehicle Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {vehicle.vehicleNumber}
                </h2>
                <p className="text-primary-100 text-sm">
                  {vehicle.model} • {vehicle.vehicleType}
                </p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-1">
                  {vehicle.vehicleType}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Vehicle Information
            </h3>
            <div className="space-y-1">
              {detailFields.map((field, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 py-3 border-b border-border-light last:border-0"
                >
                  <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <field.icon className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
                      {field.label}
                    </p>
                    <p className="text-sm text-text-primary font-medium mt-0.5">
                      {field.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Policies */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Insurance Policies ({activePolicies?.length || 0})
            </h3>
            {hasActivePolicies && (
              <Badge status="Active">Active Coverage</Badge>
            )}
          </div>

          {activePolicies?.length > 0 ? (
            <div className="space-y-3">
              {activePolicies.map((premium) => (
                <div
                  key={premium._id}
                  className="flex items-center justify-between p-4 bg-bg-primary rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {premium.policyID?.policyName || 'Insurance Policy'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {premium.policyID?.coverageType} •{' '}
                        {premium.premiumID}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text-primary">
                      {formatCurrency(premium.calculatedAmount)}
                    </p>
                    <Badge status="Paid" className="mt-1">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No active policies"
              description="This vehicle doesn't have any active insurance policies"
            >
              <Link to="/policies">
                <Button size="sm">Browse Policies</Button>
              </Link>
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;