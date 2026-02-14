import { Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-border-light py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-xs text-text-tertiary">
                    © {currentYear}{' '}
                    <span className="font-semibold text-primary-500">SecureInsure</span>.
                    All rights reserved.
                </p>

                <div className="flex items-center gap-4">
                    <a
                        href="#"
                        className="text-xs text-text-tertiary hover:text-primary-500 transition-colors"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="text-xs text-text-tertiary hover:text-primary-500 transition-colors"
                    >
                        Terms of Service
                    </a>
                    <p className="text-xs text-text-tertiary flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-danger fill-danger" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;