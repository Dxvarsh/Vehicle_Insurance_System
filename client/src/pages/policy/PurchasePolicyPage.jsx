import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Car,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Calculator,
  AlertCircle,
  CreditCard,
  History,
  Zap,
} from 'lucide-react';
import {
  fetchPolicyById,
  calculatePremiumPreview,
  purchasePolicy,
  clearPolicyError,
  clearPremiumPreview,
  selectPolicies,
} from '../../store/slices/policySlice';
import { fetchMyVehicles, selectVehicles } from '../../store/slices/vehicleSlice';
import {
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
} from '../../components/common';
import { cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PurchasePolicyPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPolicy, premiumPreview, isLoading, isSubmitting, error } = useSelector(selectPolicies);
  const { vehicles, isLoading: loadingVehicles } = useSelector(selectVehicles);

  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPolicyById(id));
    dispatch(fetchMyVehicles({ limit: 100 })); // Get all vehicles to choose from
    return () => {
      dispatch(clearPolicyError());
      dispatch(clearPremiumPreview());
    };
  }, [dispatch, id]);

  const handleCalculate = async () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }

    try {
      await dispatch(calculatePremiumPreview({
        policyID: id,
        vehicleID: selectedVehicle._id
      })).unwrap();
      setStep(2);
    } catch (err) {
      toast.error(err || 'Failed to calculate premium');
    }
  };

  const handlePurchase = async () => {
    try {
      const result = await dispatch(purchasePolicy({
        id,
        vehicleID: selectedVehicle._id
      })).unwrap();

      toast.success('Policy application submitted successfully!');
      setShowConfirmModal(false);
      // Navigate to payment page (premium/pay/:id)
      navigate(`/premium/pay/${result.data.premium._id}`);
    } catch (err) {
      toast.error(err || 'Failed to purchase policy');
    }
  };

  if (isLoading || loadingVehicles) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentPolicy) return null;
  const { policy } = currentPolicy;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link to={`/policies/${id}`} className="inline-flex items-center gap-2 text-text-tertiary hover:text-primary-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Policy Details</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Apply for {policy.policyName}
        </h1>
        <p className="text-text-secondary">Step {step} of 2: {step === 1 ? 'Select Vehicle' : 'Review Premium'}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden flex">
        <div className={cn("h-full bg-primary-500 transition-all duration-500", step === 1 ? "w-1/2" : "w-full")}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-border-light p-8 shadow-sm">
                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Car className="w-5 h-5 text-primary-600" />
                  </div>
                  Which vehicle do you want to insure?
                </h3>

                {vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {vehicles.map((vehicle) => (
                      <button
                        key={vehicle._id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={cn(
                          "flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-200",
                          selectedVehicle?._id === vehicle._id
                            ? "border-primary-500 bg-primary-50/30 shadow-md ring-4 ring-primary-50"
                            : "border-border-light hover:border-primary-200 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            selectedVehicle?._id === vehicle._id ? "bg-primary-500 text-white" : "bg-bg-primary text-text-tertiary"
                          )}>
                            <Car className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{vehicle.vehicleNumber}</p>
                            <p className="text-xs text-text-secondary">{vehicle.model} • {vehicle.vehicleType}</p>
                          </div>
                        </div>
                        {selectedVehicle?._id === vehicle._id && (
                          <CheckCircle2 className="w-6 h-6 text-primary-500 fill-primary-500 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-border-light rounded-3xl bg-bg-primary">
                    <Car className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-primary font-bold">No vehicles found</p>
                    <p className="text-text-secondary text-sm mb-6">You need to register a vehicle before you can purchase insurance.</p>
                    <Link to="/vehicles/add">
                      <Button leftIcon={<History className="w-4 h-4" />}>Register New Vehicle</Button>
                    </Link>
                  </div>
                )}
              </div>

              {selectedVehicle && (
                <div className="bg-primary-900 rounded-3xl p-8 text-white shadow-xl shadow-primary-200 flex flex-col items-center gap-6 text-center">
                  <Calculator className="w-10 h-10 text-primary-300" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Ready to calculate?</h3>
                    <p className="text-primary-200 text-sm max-w-sm">
                      We'll calculate your custom premium based on {selectedVehicle.vehicleNumber}'s details.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full h-14 bg-white text-primary-900 hover:bg-primary-50 rounded-2xl font-bold text-lg"
                    onClick={handleCalculate}
                  >
                    Calculate Premium
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-border-light p-8 shadow-sm">
                <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
                  <div className="p-2 bg-success-light rounded-lg">
                    <Shield className="w-5 h-5 text-success-dark" />
                  </div>
                  Premium Summary
                </h3>

                <div className="space-y-6">
                  {/* Breakdown List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Base Policy Amount</span>
                      <span className="font-mono text-text-primary font-semibold">₹{premiumPreview.premiumBreakdown.baseAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Vehicle Type Multiplier ({selectedVehicle.vehicleType})</span>
                      <span className="font-mono text-text-primary font-semibold">x {premiumPreview.premiumBreakdown.vehicleTypeMultiplier}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Coverage Multiplier ({policy.coverageType})</span>
                      <span className="font-mono text-text-primary font-semibold">x {premiumPreview.premiumBreakdown.coverageMultiplier}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-danger">
                      <span className="">Vehicle Age Depreciation ({new Date().getFullYear() - selectedVehicle.registrationYear} Yrs)</span>
                      <span className="font-mono font-semibold">- {premiumPreview.premiumBreakdown.ageDepreciation}%</span>
                    </div>

                    <div className="pt-6 border-t border-border-light mt-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-text-primary uppercase tracking-tight">Total Final Premium</span>
                          <p className="text-xs text-text-tertiary">Including all applicable taxes and fees</p>
                        </div>
                        <span className="text-3xl font-black text-primary-600 font-mono">
                          ₹{premiumPreview.premiumBreakdown.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-border-light p-8 shadow-sm space-y-4">
                <h4 className="font-bold text-text-primary flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Important Note
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  The calculated premium is valid for 7 days. You will be redirected to the payment gateway to complete the transaction. Your policy will be issued instantly once payment is confirmed.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="w-1/3 h-14 rounded-2xl"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-5 h-5" />}
                >
                  Change Vehicle
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 h-14 rounded-2xl shadow-xl shadow-primary-200"
                  onClick={() => setShowConfirmModal(true)}
                  rightIcon={<CreditCard className="w-5 h-5" />}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-border-light p-6 shadow-sm">
            <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Policy Summary
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Plan Name</span>
                <p className="text-sm font-bold text-text-primary">{policy.policyName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Coverage</span>
                <Badge variant="primary">{policy.coverageType}</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Duration</span>
                <p className="text-sm font-bold text-text-primary">{policy.policyDuration} Months</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl text-white shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold mb-2">Instant Issuance</h4>
            <p className="text-sm text-primary-50/80 leading-relaxed">
              Skip the paperwork! Get your digital policy certificate instantly in your dashboard after a successful payment.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Purchase"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handlePurchase} isLoading={isSubmitting}>
              Apply & Pay
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to apply for {policy.policyName} for vehicle <span className="font-bold text-text-primary">{selectedVehicle?.vehicleNumber}</span>?
          </p>
          <div className="p-4 bg-bg-primary rounded-xl border border-border-light flex justify-between items-center">
            <span className="text-sm font-medium text-text-secondary">Amount to Pay</span>
            <span className="text-xl font-bold text-primary-600 font-mono">
              ₹{premiumPreview?.premiumBreakdown?.finalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-start gap-2 p-2 px-3 bg-warning-light/50 rounded-lg text-xs text-warning-dark border border-warning-light">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>On the next screen, you will be able to choose your payment method.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PurchasePolicyPage;
