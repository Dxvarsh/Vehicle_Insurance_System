import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Shield,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  fetchPolicyById,
  clearPolicyError,
  selectPolicies,
} from '../../store/slices/policySlice';
import {
  PageHeader,
  Button,
  Spinner,
  Alert,
} from '../../components/common';
import policyService from '../../services/policyService';
import toast from 'react-hot-toast';

const ManagePolicyPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPolicy, isLoading } = useSelector(selectPolicies);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      policyName: '',
      description: '',
      coverageType: 'Comprehensive',
      baseAmount: 1000,
      policyDuration: 12,
      isActive: true,
      premiumRules: {
        vehicleTypeMultiplier: {
          '2-Wheeler': 1.0,
          '4-Wheeler': 2.5,
          'Commercial': 4.0 // Ensure string key matches schema enum if needed, or just string
        },
        ageDepreciationRate: 0.05,
        baseRate: 0.02
      }
    }
  });

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchPolicyById(id));
    } else {
      dispatch(clearPolicyError());
      reset(); // ensure clean form
    }
  }, [dispatch, id, isEditMode, reset]);

  useEffect(() => {
    if (isEditMode && currentPolicy && currentPolicy.policy) {
      const p = currentPolicy.policy;
      
      // Map API data to form structure
      // Note: vehicleTypeMultiplier in schema is Map/Object. 
      // Mongoose Map becomes Object in JSON.
      
      reset({
        policyName: p.policyName,
        description: p.description,
        coverageType: p.coverageType,
        baseAmount: p.baseAmount,
        policyDuration: p.policyDuration,
        isActive: p.isActive,
        premiumRules: {
            vehicleTypeMultiplier: {
                ...p.premiumRules.vehicleTypeMultiplier
            },
            ageDepreciationRate: p.premiumRules.ageDepreciationRate,
            baseRate: p.premiumRules.baseRate
        }
      });
    }
  }, [currentPolicy, isEditMode, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await policyService.adminUpdatePolicy(id, data);
        toast.success('Policy updated successfully');
      } else {
        await policyService.adminCreatePolicy(data);
        toast.success('Policy created successfully');
      }
      navigate('/admin/policies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoading) {
    return <div className="h-96 flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
           Back
        </Button>
      </div>

      <PageHeader
        title={isEditMode ? 'Edit Policy' : 'Create New Policy'}
        subtitle={isEditMode ? `Updating policy: ${currentPolicy?.policy?.policyName}` : 'Define a new insurance plan'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-text-primary border-b border-border-light pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Policy Name <span className="text-danger">*</span></label>
              <input
                {...register('policyName', { required: 'Policy name is required', minLength: { value: 3, message: 'Min 3 chars' } })}
                className="w-full px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="e.g. Gold Comprehensive Plan"
              />
              {errors.policyName && <p className="text-xs text-danger">{errors.policyName.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Coverage Type <span className="text-danger">*</span></label>
              <select
                {...register('coverageType', { required: true })}
                className="w-full px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none bg-white"
              >
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third-Party">Third-Party</option>
                <option value="Own-Damage">Own-Damage</option>
              </select>
            </div>

            <div className="col-span-full space-y-1">
              <label className="text-sm font-medium text-text-secondary">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="Detailed description of the policy..."
              />
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-text-primary border-b border-border-light pb-2">Pricing & Duration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Base Amount (₹) <span className="text-danger">*</span></label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">₹</span>
                 <input
                    type="number"
                    step="0.01"
                    {...register('baseAmount', { required: 'Base amount required', min: 0 })}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none"
                 />
              </div>
              {errors.baseAmount && <p className="text-xs text-danger">{errors.baseAmount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Duration (Months) <span className="text-danger">*</span></label>
              <select
                {...register('policyDuration', { required: true })}
                className="w-full px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none bg-white"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
              </select>
            </div>

             <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Status</label>
              <div className="flex items-center gap-2 mt-2">
                 <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                 <span className="text-sm text-text-primary">Active (Visible to users)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Rules */}
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-text-primary border-b border-border-light pb-2">Premium Calculation Rules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Age Depreciation Rate (%)</label>
              <input
                 type="number"
                 step="0.01"
                 {...register('premiumRules.ageDepreciationRate', { required: true, min: 0, max: 1 })}
                 className="w-full px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none"
              />
              <p className="text-xs text-text-tertiary">Rate at which vehicle value depreciates per year (e.g. 0.05 for 5%)</p>
            </div>

             <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Base Rate (%)</label>
              <input
                 type="number"
                 step="0.01"
                 {...register('premiumRules.baseRate', { required: true, min: 0, max: 1 })}
                 className="w-full px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none"
              />
              <p className="text-xs text-text-tertiary">Base percentage of vehicle value (if applicable)</p>
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-bold text-text-secondary block">Vehicle Type Multipliers</label>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs text-text-tertiary">2-Wheeler</label>
                    <input
                        type="number"
                        step="0.1"
                        {...register(`premiumRules.vehicleTypeMultiplier.2-Wheeler`, { required: true, min: 0 })}
                        className="w-full px-3 py-2 rounded border border-border-light"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-text-tertiary">4-Wheeler</label>
                    <input
                        type="number"
                        step="0.1"
                        {...register(`premiumRules.vehicleTypeMultiplier.4-Wheeler`, { required: true, min: 0 })}
                        className="w-full px-3 py-2 rounded border border-border-light"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-text-tertiary">Commercial</label>
                    <input
                        type="number"
                        step="0.1"
                        {...register(`premiumRules.vehicleTypeMultiplier.Commercial`, { required: true, min: 0 })}
                        className="w-full px-3 py-2 rounded border border-border-light"
                    />
                 </div>
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/policies')}>
             Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4"/>}>
             {isEditMode ? 'Update Policy' : 'Create Policy'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManagePolicyPage;
