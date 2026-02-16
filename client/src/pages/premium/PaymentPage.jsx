import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Smartphone,
  Globe,
} from 'lucide-react';
import {
  payPremium,
  selectPolicies,
  clearPolicyError,
  fetchMyPremiums,
} from '../../store/slices/policySlice';
import {
  Button,
  Spinner,
  Badge,
} from '../../components/common';
import { cn } from '../../utils/helpers';
import toast from 'react-hot-toast';
import policyService from '../../services/policyService';

const PaymentPage = () => {
  const { id } = useParams(); // premiumID
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myPremiums, isLoading } = useSelector(selectPolicies);
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchMyPremiums({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(myPremiums) && myPremiums.length > 0) {
      const found = myPremiums.find(p => p._id === id);
      if (found) {
        setPremium(found);
        if (found.paymentStatus === 'Paid') {
          setPaymentSuccess(true);
        }
      } else if (!isLoading) {
        toast.error('Premium record not found');
        navigate('/policies');
      }
      setLoading(false);
    } else if (!isLoading && (!myPremiums || (Array.isArray(myPremiums) && myPremiums.length === 0))) {
       setLoading(false);
    }
  }, [myPremiums, id, navigate, isLoading]);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate gateway delay
    setTimeout(async () => {
      try {
        const transactionID = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await dispatch(payPremium({ id, transactionID })).unwrap();
        setPaymentSuccess(true);
        toast.success('Payment Successful!');
      } catch (err) {
        toast.error(err || 'Payment failed');
        setProcessing(false);
      }
    }, 2000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!premium) return null;

  if (paymentSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">Payment Successful!</h1>
          <p className="text-text-secondary">Your policy has been issued successfully.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-border-light shadow-sm w-full max-w-md">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-border-light">
            <span className="text-sm text-text-secondary">Transaction ID</span>
            <span className="font-mono font-medium">{premium.transactionID || 'TXN-123456'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Amount Paid</span>
            <span className="font-bold text-lg text-primary-600">₹{premium.calculatedAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            <Button onClick={() => navigate('/policies')}>View Policy</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-light bg-bg-primary flex justify-between items-center">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Lock className="w-4 h-4 text-success" />
                    Secure Payment Gateway
                </h2>
                <div className="flex gap-2">
                    <Badge variant="success">256-bit SSL</Badge>
                </div>
            </div>
            
            <div className="p-8 space-y-8">
                <div>
                    <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Choose Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button 
                            onClick={() => setPaymentMethod('card')}
                            className={cn(
                                "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                                paymentMethod === 'card' ? "border-primary-500 bg-primary-50 text-primary-700" : "border-border-light hover:border-primary-200"
                            )}
                        >
                            <CreditCard className="w-6 h-6" />
                            <span className="text-sm font-bold">Card</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('upi')}
                            className={cn(
                                "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                                paymentMethod === 'upi' ? "border-primary-500 bg-primary-50 text-primary-700" : "border-border-light hover:border-primary-200"
                            )}
                        >
                            <Smartphone className="w-6 h-6" />
                            <span className="text-sm font-bold">UPI</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('netbanking')}
                            className={cn(
                                "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                                paymentMethod === 'netbanking' ? "border-primary-500 bg-primary-50 text-primary-700" : "border-border-light hover:border-primary-200"
                            )}
                        >
                            <Globe className="w-6 h-6" />
                            <span className="text-sm font-bold">Net Banking</span>
                        </button>
                    </div>
                </div>

                {paymentMethod === 'card' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-secondary uppercase">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary-100 outline-none font-mono" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-secondary uppercase">Expiry Date</label>
                                <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary-100 outline-none font-mono" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-secondary uppercase">CVV</label>
                                <input type="password" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary-100 outline-none font-mono" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-secondary uppercase">Card Holder Name</label>
                            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary-100 outline-none" />
                        </div>
                    </div>
                )}
                
                {paymentMethod === 'upi' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 p-6 bg-bg-primary rounded-xl border border-dashed border-border-light flex flex-col items-center text-center">
                         <div className="p-3 bg-white rounded-lg shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" alt="UPI" className="h-8" />
                         </div>
                         <p className="text-sm text-text-secondary">Scan QR code or enter VPA to pay</p>
                         <input type="text" placeholder="example@upi" className="w-full max-w-xs px-4 py-2 rounded-lg border border-border-light focus:ring-2 focus:ring-primary-100 outline-none text-center" />
                    </div>
                )}

                <Button 
                    className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary-200 mt-4"
                    onClick={handlePayment}
                    isLoading={processing}
                    loadingText="Processing Payment..."
                >
                    Pay ₹{premium.calculatedAmount.toLocaleString()}
                </Button>
            </div>
        </div>
        
        <p className="text-center text-xs text-text-tertiary flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Your payment information is encrypted and secure.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-border-light shadow-sm p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Order Summary</h3>
            <div className="space-y-3 pb-4 border-b border-border-light">
                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Policy</span>
                    <span className="font-medium text-text-primary text-right">{premium.policyID.policyName}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Vehicle</span>
                    <span className="font-medium text-text-primary">{premium.vehicleID.vehicleNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-medium text-text-primary">{premium.policyID.policyDuration} Months</span>
                </div>
            </div>
            <div className="pt-4 flex justify-between items-center">
                <span className="font-bold text-text-primary">Total Amount</span>
                <span className="font-bold text-xl text-primary-600">₹{premium.calculatedAmount.toLocaleString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
