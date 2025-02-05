export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  supply: number;
}

// Mock function to simulate token creation
export const createToken = async (): Promise<{ transaction: string }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        transaction: `mock-tx-${Math.random().toString(36).substring(7)}`
      });
    }, 2000);
  });
};