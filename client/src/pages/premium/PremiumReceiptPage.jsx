import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Shield,
    Car,
    CheckCircle2,
    ArrowLeft,
    Download,
    AlertCircle,
    Mail,
    Printer,
    FileText,
} from 'lucide-react';
import { Button, Spinner, Badge, Alert } from '../../components/common';
import policyService from '../../services/policyService';
import moment from 'moment';
import toast from 'react-hot-toast';

const PremiumReceiptPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const data = await policyService.getPaymentReceipt(id);
                setReceipt(data.data.premium);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load receipt');
                toast.error('Could not load receipt');
            } finally {
                setLoading(false);
            }
        };
        fetchReceipt();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="max-w-md mx-auto mt-10 space-y-4">
                <Alert type="error" message={error || 'Receipt not found'} />
                <Button variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => navigate('/premiums')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    My Premiums
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                        Print
                    </Button>
                    <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-border-light overflow-hidden print:shadow-none print:border-none">
                {/* Header */}
                <div className="bg-primary-900 text-white p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-8 h-8 text-primary-300" />
                                <h1 className="text-2xl font-bold tracking-tight">VIMS Insurance</h1>
                            </div>
                            <p className="text-primary-200 text-sm">Protecting what matters most</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-primary-300 mb-1">Receipt</h2>
                            <p className="font-mono text-sm opacity-80">#{receipt.transactionID}</p>
                            <Badge variant="success" className="mt-2 text-xs">Payment Successful</Badge>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-8 pb-8 border-b border-border-light">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Billed To</h3>
                            <div className="space-y-1">
                                <p className="font-bold text-text-primary text-lg">{receipt.customerID.name}</p>
                                <p className="text-text-secondary text-sm">{receipt.customerID.email}</p>
                                <p className="text-text-secondary text-sm">{receipt.customerID.contactNumber}</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-right">
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Payment Details</h3>
                            <div className="space-y-1">
                                <p className="text-text-secondary text-sm">
                                    Date: <span className="font-medium text-text-primary ml-2">{moment(receipt.paymentDate).format('DD MMM YYYY')}</span>
                                </p>
                                <p className="text-text-secondary text-sm">
                                    Time: <span className="font-medium text-text-primary ml-2">{moment(receipt.paymentDate).format('hh:mm A')}</span>
                                </p>
                                <p className="text-text-secondary text-sm">
                                    Method: <span className="font-medium text-text-primary ml-2">Online Transfer</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-bg-primary rounded-xl p-6 border border-border-light">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg border border-border-light text-primary-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-primary text-lg mb-1">{receipt.policyID.policyName}</h4>
                                    <p className="text-sm text-text-secondary mb-3">{receipt.policyID.description}</p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline">{receipt.policyID.coverageType}</Badge>
                                        <Badge variant="outline">{receipt.policyID.policyDuration} Months</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-bg-primary rounded-xl p-6 border border-border-light">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg border border-border-light text-primary-600">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-primary text-lg mb-1">{receipt.vehicleID.vehicleNumber}</h4>
                                    <p className="text-sm text-text-secondary">{receipt.vehicleID.model} ({receipt.vehicleID.registrationYear})</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end pt-4">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-sm text-text-secondary">
                                <span>Base Amount</span>
                                <span>₹{receipt.calculationBreakdown.baseAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-text-secondary">
                                <span>Adjustments (Age/Type)</span>
                                <span>Included</span>
                            </div>
                            <div className="pt-3 border-t border-border-light flex justify-between items-center">
                                <span className="font-bold text-text-primary text-lg">Total Paid</span>
                                <span className="font-bold text-primary-600 text-2xl">₹{receipt.calculatedAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-bg-secondary p-6 text-center text-xs text-text-tertiary border-t border-border-light">
                    <p className="mb-2">Thank you for choosing VIMS Insurance.</p>
                    <p>This is a computer-generated receipt and does not require a physical signature.</p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-primary-500 font-medium">
                        <Mail className="w-3 h-3" /> support@vims.com
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumReceiptPage;
