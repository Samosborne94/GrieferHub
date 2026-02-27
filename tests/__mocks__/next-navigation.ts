const push = jest.fn()
const refresh = jest.fn()
const back = jest.fn()
const replace = jest.fn()

const useRouter = jest.fn(() => ({
  push,
  refresh,
  back,
  replace,
  prefetch: jest.fn(),
}))

const usePathname = jest.fn(() => '/')
const useSearchParams = jest.fn(() => new URLSearchParams())

export { useRouter, usePathname, useSearchParams }
