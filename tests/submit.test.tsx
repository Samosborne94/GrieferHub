import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubmitReportPage from '@/app/submit/page'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, prefetch: jest.fn() }),
  usePathname: () => '/submit',
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { name: 'Test' } }, status: 'authenticated' }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}))
jest.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

describe('SubmitReportPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the report form heading', () => {
    render(<SubmitReportPage />)
    expect(screen.getByText('Betrayal')).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<SubmitReportPage />)
    expect(screen.getByPlaceholderText('e.g. TrustMeBro')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Arc Raiders')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. EU West / London')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Describe what happened/)).toBeInTheDocument()
  })

  it('renders all game options', () => {
    render(<SubmitReportPage />)
    const select = screen.getByDisplayValue('Arc Raiders')
    expect(select).toBeInTheDocument()

    const options = select.querySelectorAll('option')
    const gameNames = Array.from(options).map(o => o.textContent)
    expect(gameNames).toEqual(['Arc Raiders', 'Escape from Tarkov', 'Rust', 'DayZ'])
  })

  it('renders severity level buttons', () => {
    render(<SubmitReportPage />)
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('allows changing severity level', async () => {
    jest.useRealTimers()
    const user = userEvent.setup()

    render(<SubmitReportPage />)

    const criticalBtn = screen.getByText('Critical')
    await user.click(criticalBtn)

    // The Critical button should now have the active styling
    expect(criticalBtn.className).toContain('bg-accent-primary')
  })

  it('renders submit button', () => {
    render(<SubmitReportPage />)
    expect(screen.getByRole('button', { name: /submit intelligence/i })).toBeInTheDocument()
  })

  it('allows filling in all form fields', async () => {
    jest.useRealTimers()
    const user = userEvent.setup()

    render(<SubmitReportPage />)

    await user.type(screen.getByPlaceholderText('e.g. TrustMeBro'), 'BadPlayer123')
    await user.type(screen.getByPlaceholderText('e.g. EU West / London'), 'US East')
    await user.type(screen.getByPlaceholderText(/Describe what happened/), 'Betrayed in extraction zone')

    expect(screen.getByPlaceholderText('e.g. TrustMeBro')).toHaveValue('BadPlayer123')
    expect(screen.getByPlaceholderText('e.g. EU West / London')).toHaveValue('US East')
    expect(screen.getByPlaceholderText(/Describe what happened/)).toHaveValue('Betrayed in extraction zone')
  })
})
