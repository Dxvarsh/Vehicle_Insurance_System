import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Info,
  Car,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  fetchPolicyById,
  clearPolicyError,
  selectPolicies,
} from '../../store/slices/policySlice';
import {
  PageHeader,
  Button,
  Badge,
  Spinner,
  Alert,
} from '../../components/common';
import { cn } from '../../utils/helpers';

const PolicyDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPolicy, isLoading, error } = useSelector(selectPolicies);

  useEffect(() => {
    dispatch(fetchPolicyById(id));
    return () => dispatch(clearPolicyError());
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Back to Policies
        </Button>
        <Alert variant="danger" title="Error" message={error} />
      </div>
    );
  }

  if (!currentPolicy) return null;

  const { policy, purchaseStats } = currentPolicy;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl border border-border-light bg-white hover:bg-bg-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Policy Details</h1>
          <p className="text-text-secondary text-sm">Review coverage and benefits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Policy Overview Card */}
          <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden">
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={
                      policy.coverageType === 'Comprehensive'
                        ? 'primary'
                        : policy.coverageType === 'Third-Party'
                          ? 'info'
                          : 'warning'
                    }
                    size="lg"
                  >
                    {policy.coverageType}
                  </Badge>
                  <span className="text-xs text-text-tertiary font-medium uppercase tracking-widest">
                    ID: {policy.policyID}
                  </span>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-text-primary mb-4">
                {policy.policyName}
              </h2>

              <p className="text-text-secondary leading-relaxed mb-8">
                {policy.description ||
                  `Our ${policy.policyName} offers extensive protection for your vehicle against various risks, including accidents, theft, and natural disasters. Designed for maximum peace of mind and financial security.`}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-bg-primary border border-border-light">
                <div className="space-y-1">
                  <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                    Duration
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-bold text-text-primary">
                      {policy.policyDuration} Months
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                    Base Premium
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary font-mono">
                      ₹{policy.baseAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        policy.isActive ? 'bg-success' : 'bg-danger'
                      )}
                    ></div>
                    <span className="text-sm font-bold text-text-primary">
                      {policy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                    Type
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-warning" />
                    <span className="text-sm font-bold text-text-primary">Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Benefits */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-success" />
              What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Personal Accident Cover',
                  desc: 'Coverage for the owner-driver in case of accidental death or disability.',
                },
                {
                  title: 'Third-Party Liability',
                  desc: 'Financial protection against legal liability for damage to property or injury to third parties.',
                },
                {
                  title: 'Vehicle Damages',
                  desc: 'Coverage for repair costs due to accidents, fire, theft, or natural calamities.',
                },
                {
                  title: 'Roadside Assistance',
                  desc: '24/7 support for towing, fuel delivery, and emergency repairs.',
                },
              ].map((benefit, i) => (
                <div key={i} className="p-5 bg-white rounded-2xl border border-border-light hover:border-primary-200 transition-colors">
                  <h4 className="font-bold text-text-primary mb-1">{benefit.title}</h4>
                  <p className="text-sm text-text-secondary">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Rules (Mini Table) */}
          <div className="bg-white rounded-3xl border border-border-light p-8 shadow-sm">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary-500" />
              Premium Calculation Rules
            </h3>
            <div className="overflow-hidden rounded-xl border border-border-light">
              <table className="min-w-full divide-y divide-border-light">
                <thead className="bg-bg-primary">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">
                      Vehicle Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-text-tertiary uppercase tracking-wider">
                      Multiplier
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {Object.entries(policy.premiumRules.vehicleTypeMultiplier).map(([type, multiplier]) => (
                    <tr key={type}>
                      <td className="px-6 py-4 text-sm font-medium text-text-primary">{type}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary text-right font-mono">
                        {multiplier}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-text-tertiary italic">
              * Final premium depends on vehicle type, manufacture year, and selected coverage.
            </p>
          </div>
        </div>

        {/* Sidebar / Purchase Action */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-border-light shadow-xl p-8 sticky top-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Purchase this plan</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <Shield className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-bold text-primary-900">100% Secure</p>
                  <p className="text-xs text-primary-700">Protected by bank-grade security</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-success-light rounded-2xl border border-success-200">
                <CheckCircle2 className="w-5 h-5 text-success-dark" />
                <div>
                  <p className="text-sm font-bold text-success-dark">Paperless</p>
                  <p className="text-xs text-success-dark">Digital issuance in minutes</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border-light">
              <div className="flex justify-between items-center text-text-tertiary">
                <span className="text-sm">Base Amount</span>
                <span className="font-mono">₹{policy.baseAmount.toLocaleString()}</span>
              </div>
              <div className="mt-8">
                <Link to={`/policies/${policy._id}/purchase`}>
                  <Button
                    variant="primary"
                    className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary-200"
                    rightIcon={<ArrowLeft className="w-5 h-5 rotate-180" />}
                  >
                    Calculate Final Premium
                  </Button>
                </Link>
                <p className="text-center text-xs text-text-tertiary mt-4 px-4 font-medium">
                  By clicking, you will be able to select your vehicle and calculate the final premium.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border-light p-6 shadow-sm">
            <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-text-tertiary" />
              Need Assistance?
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Our experts are available 24/7 to help you choose the right plan for your vehicle.
            </p>
            <Button variant="outline" className="w-full rounded-xl">
              Talk to Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PolicyDetailPage;
