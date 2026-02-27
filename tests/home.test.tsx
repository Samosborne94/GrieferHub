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
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('One')).toBeInTheDocument()
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
    expect(screen.getByText('View Intel Board')).toBeInTheDocument()
  })

  it('renders How It Works section', () => {
    render(<HomePage />)
    expect(screen.getByText('How It Works')).toBeInTheDocument()
    expect(screen.getByText('Create an Account')).toBeInTheDocument()
    expect(screen.getByText('Browse Intel Board')).toBeInTheDocument()
    expect(screen.getByText('Submit Reports')).toBeInTheDocument()
  })

  it('renders Why Choose GrieferHub section', () => {
    render(<HomePage />)
    expect(screen.getByText('Verified Reports Only')).toBeInTheDocument()
    expect(screen.getByText('Cross-Platform Tracking')).toBeInTheDocument()
    expect(screen.getByText('Community-Driven')).toBeInTheDocument()
  })

  it('renders Ready to Get Started CTA', () => {
    render(<HomePage />)
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument()
    expect(screen.getByText('Create Free Account')).toBeInTheDocument()
  })
})
