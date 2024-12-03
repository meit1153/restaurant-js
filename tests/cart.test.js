const request = require('supertest');
const app = require('../src/app'); // Your Express app
const pool = require('../src/loaders/postgres'); // Database pool

jest.mock('../src/loaders/postgres'); // Mocking the database pool

describe('GET /cart-details', () => {
    let mockUser;

    beforeEach(() => {
        // Mock authenticated user
        mockUser = {
            user_id: 'db14eb18-4e34-422e-9f01-aacb8e60672d'
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return cart details with total amount and tax', async () => {
        // Mock DB query result
        const mockRows = [
            {
                "menu_item_id": "71c4279d-3a4b-484f-a460-d115f8760860",
                "quantity": 2,
                "price": "25.98"
            },
            {
                "menu_item_id": "71c4279d-3a4b-484f-a460-d115f8760860",
                "quantity": 2,
                "price": "25.98"
            },
            {
                "menu_item_id": "09cec27e-26df-4324-bf19-0b149bb37fe3",
                "quantity": 1,
                "price": "14.99"
            }
        ];
        pool.getConnection.mockResolvedValue({
            query: jest.fn().mockResolvedValueOnce({ rows: mockRows }),
            release: jest.fn(),
        });

        const mockToken = "valid-auth-token"; // Mock token for authenticated user

        const response = await request(app)
            .get('/cart-details')
            .set('Authorization', `Bearer ${mockToken}`)
            .set('user', JSON.stringify(mockUser)); // Mock user

        expect(response.status).toBe(200); // Expect successful response

        const expectedResponse = {
            "items": [
                {
                    "menu_item_id": "71c4279d-3a4b-484f-a460-d115f8760860",
                    "quantity": 2,
                    "price": "25.98"
                },
                {
                    "menu_item_id": "71c4279d-3a4b-484f-a460-d115f8760860",
                    "quantity": 2,
                    "price": "25.98"
                },
                {
                    "menu_item_id": "09cec27e-26df-4324-bf19-0b149bb37fe3",
                    "quantity": 1,
                    "price": "14.99"
                }
            ],
            "total_amount": 66.95,
            "tax": 12.05,
            "grand_total": 79
        };

        expect(response.body).toEqual(expectedResponse);
    });

    it('should return unauthorized if user is not authenticated', async () => {
        const response = await request(app).get('/cart-details');

        expect(response.status).toBe(401); // Expect unauthorized response
        expect(response.body).toEqual({ error: 'User not authenticated' });
    });

    it('should return an error if the database query fails', async () => {
        pool.getConnection.mockResolvedValue({
            query: jest.fn().mockRejectedValueOnce(new Error('Database error')),
            release: jest.fn(),
        });

        const mockToken = "valid-auth-token";

        const response = await request(app)
            .get('/cart-details')
            .set('Authorization', `Bearer ${mockToken}`)
            .set('user', JSON.stringify(mockUser)); // Mock user

        expect(response.status).toBe(500); // Internal server error
        expect(response.body.error).toContain('Internal Server Error');
    });
});
