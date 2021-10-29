export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'stripe-mock-id' }),
  },
}
