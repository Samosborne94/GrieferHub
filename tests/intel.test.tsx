import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IntelBoardPage from '@/app/intel/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/intel',
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}))
jest.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))
jest.mock('@/components/reports/ReportCard', () => ({
  ReportCard: ({ report }: { report: { grieferName: string } }) => (
    <div data-testid="report-card">{report.grieferName}</div>
  ),
}))
jest.mock('@/components/common/SkeletonCard', () => ({
  SkeletonGrid: () => <div data-testid="skeleton-grid">Loading...</div>,
}))
jest.mock('@/components/common/EmptyState', () => ({
  NoReportsFound: ({ onClear }: { onClear: () => void }) => (
    <div data-testid="no-reports-found">
      No reports found <button onClick={onClear}>Clear filters</button>
    </div>
  ),
  NoReportsYet: () => <div data-testid="no-reports-yet">No reports yet</div>,
  ErrorState: ({ message }: { message: string }) => (
    <div data-testid="error-state">{message}</div>
  ),
}))

const mockReports = [
  {
    id: '1',
    grieferName: 'BadGuy1',
    game: 'Arc Raiders',
    server: 'EU West',
    description: 'Betrayed at extraction',
    severity: 'High',
    status: 'Verified',
    tags: ['betrayal'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    reportedBy: 'user1',
  },
  {
    id: '2',
    grieferName: 'ToxicPlayer',
    game: 'Rust',
    server: 'US East',
    description: 'Team killed',
    severity: 'Critical',
    status: 'Under Review',
    tags: ['teamkill'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-04',
    reportedBy: 'user2',
  },
]

describe('IntelBoardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the page heading', () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    })

    render(<IntelBoardPage />)
    expect(screen.getByText('Intel Board')).toBeInTheDocument()
    expect(screen.getByText('Browse verified reports of griefers across different games')).toBeInTheDocument()
  })

  it('shows loading skeleton while fetching', () => {
    ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})) // never resolves

    render(<IntelBoardPage />)
    expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument()
  })

  it('renders reports after successful fetch', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<IntelBoardPage />)

    await waitFor(() => {
      expect(screen.getByText('BadGuy1')).toBeInTheDocument()
      expect(screen.getByText('ToxicPlayer')).toBeInTheDocument()
    })
  })

  it('shows empty state when no reports exist', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    })

    render(<IntelBoardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('no-reports-yet')).toBeInTheDocument()
    })
  })

  it('shows error state on fetch failure', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: 'Server error' }),
    })

    render(<IntelBoardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('renders filter controls', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<IntelBoardPage />)

    expect(screen.getByText('Filter Reports')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by name or description...')).toBeInTheDocument()
    expect(screen.getByText('All Statuses')).toBeInTheDocument()
    expect(screen.getByText('All Severities')).toBeInTheDocument()
  })

  it('shows results count after loading', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<IntelBoardPage />)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // total count
    })
  })
})
