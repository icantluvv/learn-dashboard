// Test-only stand-in for the `server-only` package: importing it is a no-op here,
// unlike the real package which throws when bundled into client code.
export const isServerOnlyTestStub = true
