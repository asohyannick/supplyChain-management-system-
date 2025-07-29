import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import createBlockChainDeliveryLog from '../../services/blockChainDelivery/createBlockChainDelivery/createBlockChainDeliveryLog';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { BlockChainDeliverySchema } from '../../utils/validator';
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
router.post('/create-delivery-logs', authenticationToken, globalValidator(BlockChainDeliverySchema), createBlockChainDeliveryLog);
export default router;