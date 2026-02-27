import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/register/page'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, prefetch: jest.fn() }),
  usePathname: () => '/register',
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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the create account heading', () => {
    render(<RegisterPage />)
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<RegisterPage />)
    expect(screen.getByPlaceholderText('JohnDoe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    // Two password fields
    const passwordFields = screen.getAllByPlaceholderText('••••••••')
    expect(passwordFields).toHaveLength(2)
  })

  it('renders register button and login link', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    expect(screen.getByText('Sign in here')).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('JohnDoe'), 'testuser')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')

    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'password123')
    await user.type(confirmField, 'differentpassword')

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows error when password is too short', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('JohnDoe'), 'testuser')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')

    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'short')
    await user.type(confirmField, 'short')

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('submits form and redirects to login on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('JohnDoe'), 'newuser')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'new@example.com')

    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'securepass123')
    await user.type(confirmField, 'securepass123')

    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'newuser',
          email: 'new@example.com',
          password: 'securepass123',
        }),
      })
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?registered=true')
    })
  })

  it('shows server error message on failed registration', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Email already in use' }),
    })

    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('JohnDoe'), 'existinguser')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'existing@example.com')

    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'securepass123')
    await user.type(confirmField, 'securepass123')

    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    })
  })
})
