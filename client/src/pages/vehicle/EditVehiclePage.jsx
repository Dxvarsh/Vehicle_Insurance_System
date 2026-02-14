import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Car, Calendar, ArrowLeft, Save } from 'lucide-react';
import {
  fetchVehicleById,
  updateVehicle,
  clearVehicleError,
  clearSelectedVehicle,
  selectVehicles,
} from '../../store/slices/vehicleSlice';
import { selectAuth } from '../../store/slices/authSlice';
import {
  PageHeader,
  Button,
  Input,
  Select,
  Alert,
  Spinner,
  EmptyState,
} from '../../components/common';
import { PATTERNS, MESSAGES, VEHICLE_TYPE_OPTIONS, getRegistrationYearOptions } from '../../utils/constants';
import toast from 'react-hot-toast';

const EditVehiclePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedVehicle, isLoading, isSubmitting, error } =
    useSelector(selectVehicles);
  const { user } = useSelector(selectAuth);

  const vehicle = selectedVehicle?.vehicle;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  // Fetch vehicle
  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(id));
    }
    return () => {
      dispatch(clearSelectedVehicle());
      dispatch(clearVehicleError());
    };
  }, [dispatch, id]);

  // Populate form when vehicle loads
  useEffect(() => {
    if (vehicle) {
      reset({
        vehicleNumber: vehicle.vehicleNumber || '',
        vehicleType: vehicle.vehicleType || '',
        model: vehicle.model || '',
        registrationYear: vehicle.registrationYear?.toString() || '',
      });
    }
  }, [vehicle, reset]);

  const onSubmit = async (data) => {
    // Only send changed fields
    const changedFields = {};
    if (data.vehicleNumber.toUpperCase() !== vehicle.vehicleNumber)
      changedFields.vehicleNumber = data.vehicleNumber.toUpperCase();
    if (data.vehicleType !== vehicle.vehicleType)
      changedFields.vehicleType = data.vehicleType;
    if (data.model !== vehicle.model) changedFields.model = data.model;
    if (parseInt(data.registrationYear, 10) !== vehicle.registrationYear)
      changedFields.registrationYear = parseInt(data.registrationYear, 10);

    if (Object.keys(changedFields).length === 0) {
      toast.error('No changes detected');
      return;
    }

    try {
      await dispatch(updateVehicle({ id, data: changedFields })).unwrap();
      toast.success('Vehicle updated successfully!');
      navigate(-1);
    } catch (err) {
      toast.error(err || 'Failed to update vehicle');
    }
  };

  const getBackPath = () => {
    if (user?.role === 'Admin') return '/admin/vehicles';
    if (user?.role === 'Staff') return '/staff/vehicles';
    return '/vehicles';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <EmptyState
        icon={Car}
        title="Vehicle not found"
        description="The vehicle you're looking for doesn't exist."
      >
        <Button
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
      </EmptyState>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Vehicle"
        subtitle={`Update details for ${vehicle.vehicleNumber}`}
        breadcrumbs={[
          { label: 'Dashboard', href: user?.role === 'Customer' ? '/dashboard' : `/${user?.role?.toLowerCase()}/dashboard` },
          { label: 'Vehicles', href: getBackPath() },
          { label: 'Edit' },
        ]}
      >
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </PageHeader>

      <div className="max-w-2xl">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => dispatch(clearVehicleError())}
            className="mb-6"
          />
        )}

        {/* Active Policy Warning */}
        {selectedVehicle?.hasActivePolicies && (
          <Alert
            type="warning"
            title="Active Policies Found"
            message="This vehicle has active insurance policies. Vehicle type cannot be changed while policies are active."
            className="mb-6"
          />
        )}

        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Vehicle Number */}
            <Input
              label="Vehicle Number"
              placeholder="MH01AB1234"
              icon={Car}
              required
              helperText="Format: XX00XX0000 (e.g., KA01AB1234)"
              error={errors.vehicleNumber?.message}
              {...register('vehicleNumber', {
                required: MESSAGES.REQUIRED,
                pattern: {
                  value: PATTERNS.VEHICLE_NUMBER,
                  message: MESSAGES.INVALID_VEHICLE,
                },
              })}
            />

            {/* Vehicle Type & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Vehicle Type"
                options={VEHICLE_TYPE_OPTIONS}
                required
                disabled={selectedVehicle?.hasActivePolicies}
                error={errors.vehicleType?.message}
                {...register('vehicleType', {
                  required: MESSAGES.REQUIRED,
                })}
              />

              <Input
                label="Model"
                placeholder="Honda City, TVS Apache, etc."
                required
                error={errors.model?.message}
                {...register('model', {
                  required: MESSAGES.REQUIRED,
                  minLength: {
                    value: 2,
                    message: 'Model must be at least 2 characters',
                  },
                })}
              />
            </div>

            {/* Registration Year */}
            <Select
              label="Registration Year"
              options={getRegistrationYearOptions()}
              icon={Calendar}
              required
              error={errors.registrationYear?.message}
              {...register('registrationYear', {
                required: MESSAGES.REQUIRED,
              })}
            />

            {/* Current Details */}
            <div className="bg-bg-secondary p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-text-primary mb-2">
                Current Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                <span>Vehicle ID: <strong>{vehicle.vehicleID}</strong></span>
                <span>Registered: <strong>{vehicle.vehicleNumber}</strong></span>
                <span>Type: <strong>{vehicle.vehicleType}</strong></span>
                <span>Model: <strong>{vehicle.model}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isDirty}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVehiclePage;