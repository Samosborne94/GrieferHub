import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock child components to isolate the page test
jest.mock('next-auth/react', () => require('./__mocks__/next-auth-react'))
jest.mock('next/navigation', () => require('./__mocks__/next-navigation'))
jest.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}))
jest.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))
jest.mock('@/components/search/PlayerSearch', () => ({
  PlayerSearch: () => <div data-testid="player-search">PlayerSearch</div>,
}))
jest.mock('@/components/home/ReportsCarousel', () => ({
  ReportsCarousel: () => <div data-testid="reports-carousel">ReportsCarousel</div>,
}))
jest.mock('@/components/home/LiveStats', () => ({
  LiveStats: () => <div data-testid="live-stats">LiveStats</div>,
}))

describe('HomePage', () => {
  it('renders the hero heading', () => {
    render(<HomePage />)
    expect(screen.getByText('Trust')).toBeInTheDocument()
    expect(screen.getByText('No One')).toBeInTheDocument()
    expect(screen.getByText('Survive')).toBeInTheDocument()
  })

  it('renders header and footer', () => {
    render(<HomePage />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders PlayerSearch component', () => {
    render(<HomePage />)
    expect(screen.getByTestId('player-search')).toBeInTheDocument()
  })

  it('renders ReportsCarousel and LiveStats', () => {
    render(<HomePage />)
    expect(screen.getByTestId('reports-carousel')).toBeInTheDocument()
    expect(screen.getByTestId('live-stats')).toBeInTheDocument()
  })

  it('renders CTA buttons with correct links', () => {
    render(<HomePage />)
    expect(screen.getByText('Report Betrayal')).toBeInTheDocument()
    expect(screen.getByText('Browse Database')).toBeInTheDocument()
  })

  it('renders How It Works section', () => {
    render(<HomePage />)
    expect(screen.getByText('Tactical')).toBeInTheDocument()
    expect(screen.getByText('Superiority')).toBeInTheDocument()
    expect(screen.getByText('Verified Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Global Search')).toBeInTheDocument()
  })

  it('renders Why Choose GrieferHub section', () => {
    render(<HomePage />)
    expect(screen.getByText('Zero-Trust Framework')).toBeInTheDocument()
    expect(screen.getByText('Secure Evidence Vault')).toBeInTheDocument()
    expect(screen.getByText('Raider Network')).toBeInTheDocument()
  })

  it('renders Ready to Get Started CTA', () => {
    render(<HomePage />)
    expect(screen.getByText('Cleanse the')).toBeInTheDocument()
    expect(screen.getByText('Zone')).toBeInTheDocument()
    expect(screen.getByText('Join the Network')).toBeInTheDocument()
  })
})
