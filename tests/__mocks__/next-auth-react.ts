const useSession = jest.fn(() => ({
  data: null,
  status: 'unauthenticated',
}))

const signIn = jest.fn()
const signOut = jest.fn()
const SessionProvider = ({ children }: { children: React.ReactNode }) => children

export { useSession, signIn, signOut, SessionProvider }
