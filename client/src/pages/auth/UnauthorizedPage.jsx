import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldX className="w-10 h-10 text-danger" />
                </div>

                <h1 className="text-3xl font-bold text-text-primary mb-3">
                    Access Denied
                </h1>
                <p className="text-text-secondary mb-8">
                    You don't have permission to access this page. Please contact your
                    administrator if you believe this is an error.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/">
                        <Button
                            variant="primary"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                        >
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="outline">Sign in with another account</Button>
                    </Link>
                </div>

                <div className="mt-12">
                    <Logo size="sm" className="justify-center opacity-50" />
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;