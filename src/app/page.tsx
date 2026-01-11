import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                        Welcome to <span className="text-accent-primary">GrieferHub</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        A community-driven platform for tracking and reporting griefers in gaming communities.
                        Help make gaming safer and more enjoyable for everyone.
                    </p>
                </div>

                <div className="glass rounded-lg p-8 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Getting Started</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary mb-1">Create an Account</h3>
                                <p className="text-sm text-text-secondary">
                                    Register to submit reports and track griefers in your favorite games.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary mb-1">Browse Intel Board</h3>
                                <p className="text-sm text-text-secondary">
                                    Search and filter through verified reports of griefers across different games.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary mb-1">Submit Reports</h3>
                                <p className="text-sm text-text-secondary">
                                    Report griefers with evidence. All submissions are reviewed by moderators.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <p className="text-center text-sm text-text-tertiary">
                            <span className="text-accent-primary font-bold">Note:</span> This platform is currently in Phase 1 development.
                            To view reports, you'll need to set up your Airtable database and configuration.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
