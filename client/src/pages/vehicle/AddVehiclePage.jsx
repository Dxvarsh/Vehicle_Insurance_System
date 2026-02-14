import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Car, Hash, Calendar, ArrowLeft, Plus } from 'lucide-react';
import {
  addVehicle,
  clearVehicleError,
  selectVehicles,
} from '../../store/slices/vehicleSlice';
import { selectAuth } from '../../store/slices/authSlice';
import { PageHeader, Button, Input, Select, Alert } from '../../components/common';
import { PATTERNS, MESSAGES, VEHICLE_TYPE_OPTIONS, getRegistrationYearOptions } from '../../utils/constants';
import toast from 'react-hot-toast';

const AddVehiclePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSubmitting, error } = useSelector(selectVehicles);
  const { user } = useSelector(selectAuth);

  const isStaffOrAdmin = user?.role === 'Staff' || user?.role === 'Admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicleNumber: '',
      vehicleType: '',
      model: '',
      registrationYear: '',
      customerID: '',
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearVehicleError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    // Clean data
    const submitData = {
      vehicleNumber: data.vehicleNumber.toUpperCase(),
      vehicleType: data.vehicleType,
      model: data.model,
      registrationYear: parseInt(data.registrationYear, 10),
    };

    // Staff/Admin must provide customerID
    if (isStaffOrAdmin && data.customerID) {
      submitData.customerID = data.customerID;
    }

    try {
      await dispatch(addVehicle(submitData)).unwrap();
      toast.success('Vehicle added successfully!');

      // Navigate back based on role
      if (user?.role === 'Customer') {
        navigate('/vehicles');
      } else {
        navigate(-1);
      }
    } catch (err) {
      toast.error(err || 'Failed to add vehicle');
    }
  };

  // Determine breadcrumbs and back path based on role
  const getBackPath = () => {
    if (user?.role === 'Admin') return '/admin/vehicles';
    if (user?.role === 'Staff') return '/staff/vehicles';
    return '/vehicles';
  };

  const getBreadcrumbs = () => {
    if (user?.role === 'Admin') {
      return [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Vehicles', href: '/admin/vehicles' },
        { label: 'Add Vehicle' },
      ];
    }
    if (user?.role === 'Staff') {
      return [
        { label: 'Dashboard', href: '/staff/dashboard' },
        { label: 'Vehicles', href: '/staff/vehicles' },
        { label: 'Add Vehicle' },
      ];
    }
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Vehicles', href: '/vehicles' },
      { label: 'Add Vehicle' },
    ];
  };

  return (
    <div>
      <PageHeader
        title="Add New Vehicle"
        subtitle="Register a new vehicle to your account"
        breadcrumbs={getBreadcrumbs()}
      >
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(getBackPath())}
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

        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Staff/Admin: Customer ID Field */}
            {isStaffOrAdmin && (
              <Input
                label="Customer ID (MongoDB ObjectId)"
                placeholder="Enter customer's MongoDB ID"
                icon={Hash}
                required
                helperText="Enter the MongoDB _id of the customer this vehicle belongs to"
                error={errors.customerID?.message}
                {...register('customerID', {
                  required: isStaffOrAdmin ? 'Customer ID is required' : false,
                })}
              />
            )}

            {/* Vehicle Number */}
            <Input
              label="Vehicle Number"
              placeholder="MH01AB1234"
              icon={Car}
              required
              helperText="Format: XX00XX0000 (e.g., KA01AB1234, MH02A5678)"
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

            {/* Vehicle Number Info Card */}
            <div className="bg-info-light p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-info-dark mb-2">
                ℹ️ Vehicle Number Format
              </h4>
              <ul className="text-xs text-info-dark space-y-1">
                <li>• First 2 letters: State code (MH, KA, GJ, DL, etc.)</li>
                <li>• Next 2 digits: District code (01, 02, 14, etc.)</li>
                <li>• Next 1-2 letters: Series (A, AB, XY, etc.)</li>
                <li>• Last 4 digits: Unique number (1234, 5678, etc.)</li>
                <li className="font-semibold mt-2">
                  Examples: KA01AB1234, MH02A5678, DL14C9999
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(getBackPath())}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Vehicle
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehiclePage;