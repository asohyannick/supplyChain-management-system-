import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import createBlockChainDeliveryLog from '../../services/blockChainDelivery/createBlockChainDelivery/createBlockChainDeliveryLog';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { BlockChainDeliverySchema } from '../../utils/validator';
import showBlockChainDeliveryLogs from '../../services/blockChainDelivery/showBlockChainDeliveryLogs/showBlockChainDeliveryLogs';
import showBlockChainDeliveryLog from '../../services/blockChainDelivery/showBlockChainDelivery/showBlockChainDeliveryLog';
const router = express.Router();
/**
 * @swagger
 * /api/v1/block-chain/create-delivery-logs:
 *   post:
 *     summary: Create Delivery Log
 *     description: Creates a new delivery log in the blockchain.
 *     tags: [BlockChainDelivery]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/blockChainDelivery'
 *     responses:
 *       200:
 *         description: Delivery log created successfully.
 *       400:
 *         description: Bad request, validation errors.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */
router.post('/create-delivery-logs', 
    authenticationToken, 
    globalValidator(BlockChainDeliverySchema), 
    createBlockChainDeliveryLog
);
router.get('/show-delivery-logs', authenticationToken, showBlockChainDeliveryLogs);
/**
 * @swagger
 * /api/v1/block-chain/show-delivery-log/{id}:
 *   get:
 *     summary: Retrieve a specific delivery log from the blockchain
 *     description: Endpoint to fetch a delivery log by its unique identifier.
 *     tags: [BlockChainDelivery]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier for the delivery log
 *         type: string
 *         format: objectId
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully retrieved the delivery log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: objectId
 *                   description: Unique identifier for the user
 *                 deliveryDetails:
 *                   type: string
 *                   description: Details of the delivery
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: The time when the delivery was logged
 *                 blockchainHash:
 *                   type: string
 *                   description: Hash of the blockchain entry for the delivery
 *       '404':
 *         description: Delivery log not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Delivery log not found."
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access."
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/show-delivery-log/:id', authenticationToken, showBlockChainDeliveryLog);
export default router;