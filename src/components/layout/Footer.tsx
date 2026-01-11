import Link from 'next/link'

export const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-gray-800 bg-bg-secondary mt-auto">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold text-accent-primary mb-3">GrieferHub</h3>
                        <p className="text-sm text-text-secondary">
                            A community-driven platform for tracking and reporting griefers in gaming communities.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <Link href="/" className="hover:text-text-primary transition-colors">
                                    Intel Board
                                </Link>
                            </li>
                            <li>
                                <Link href="/submit" className="hover:text-text-primary transition-colors">
                                    Submit Report
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <a href="#" className="hover:text-text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-text-primary transition-colors">
                                    Community Guidelines
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-text-tertiary">
                    © {currentYear} GrieferHub. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
