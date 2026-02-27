import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, prefetch: jest.fn() }),
  usePathname: () => '/dashboard',
}))

const mockUseSession = jest.fn()
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}))
jest.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))
jest.mock('@/components/common/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}))
jest.mock('@/components/reports/StatusBadge', () => ({
  StatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>,
}))

const mockReports = [
  {
    id: '1',
    grieferName: 'Betrayer1',
    game: 'Arc Raiders',
    server: 'EU West',
    description: 'Fake friendly betrayal',
    severity: 'High' as const,
    status: 'Verified' as const,
    tags: ['betrayal'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    reportedBy: 'user1',
  },
  {
    id: '2',
    grieferName: 'Griefer2',
    game: 'Rust',
    server: 'US East',
    description: 'Base raided while offline',
    severity: 'Medium' as const,
    status: 'Under Review' as const,
    tags: [],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    reportedBy: 'user1',
  },
]

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows loading spinner while session is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' })

    render(<DashboardPage />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('redirects to login when unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

    render(<DashboardPage />)
    expect(mockPush).toHaveBeenCalledWith('/login?redirect=/dashboard')
  })

  it('renders dashboard heading when authenticated', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'TestUser', email: 'test@example.com' } },
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('My Dashboard')).toBeInTheDocument()
    })
  })

  it('shows stats overview with correct counts', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'TestUser' } },
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('Total Reports')).toBeInTheDocument()
      expect(screen.getByText('Verified')).toBeInTheDocument()
      expect(screen.getByText('Under Review')).toBeInTheDocument()
      expect(screen.getByText('Resolved')).toBeInTheDocument()
    })
  })

  it('displays user reports list', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'TestUser' } },
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('Betrayer1')).toBeInTheDocument()
      expect(screen.getByText('Griefer2')).toBeInTheDocument()
    })
  })

  it('shows empty state when no reports exist', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'TestUser' } },
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('No reports yet')).toBeInTheDocument()
      expect(screen.getByText('Submit Report')).toBeInTheDocument()
    })
  })

  it('shows View, Edit, Delete buttons for each report', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'TestUser' } },
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockReports }),
    })

    render(<DashboardPage />)

    await waitFor(() => {
      const viewButtons = screen.getAllByText('View')
      const editButtons = screen.getAllByText('Edit')
      const deleteButtons = screen.getAllByText('Delete')
      expect(viewButtons).toHaveLength(2)
      expect(editButtons).toHaveLength(2)
      expect(deleteButtons).toHaveLength(2)
    })
  })

  it('fetches reports from /api/reports/me', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'TestUser' } },
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/reports/me')
    })
  })
})
