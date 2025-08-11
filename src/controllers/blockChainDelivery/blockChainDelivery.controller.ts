import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import createBlockChainDeliveryLog from '../../services/blockChainDelivery/createBlockChainDelivery/createBlockChainDeliveryLog';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { BlockChainDeliverySchema, updateBlockChainDeliverySchema } from '../../utils/validator';
import showBlockChainDeliveryLogs from '../../services/blockChainDelivery/showBlockChainDeliveryLogs/showBlockChainDeliveryLogs';
import showBlockChainDeliveryLog from '../../services/blockChainDelivery/showBlockChainDelivery/showBlockChainDeliveryLog';
import updateBlockChainDeliveryLog from '../../services/blockChainDelivery/updateBlockChainDeliveryLog/updateBlockChainDeliveryLog';
import deleteBlockChainDeliveryLog from '../../services/blockChainDelivery/deleteBlockChainDeliveryLog/deleteBlockChainDeliveryLog';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';
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
 *             $ref: '#/components/schemas/BlockChainDelivery'
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
    authorizeRoles(UserStatus.USER),
    globalValidator(BlockChainDeliverySchema), 
    createBlockChainDeliveryLog
);

router.get('/show-delivery-logs', authenticationToken, authorizeRoles(UserStatus.USER), showBlockChainDeliveryLogs);
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
router.get('/show-delivery-log/:id', authenticationToken, authorizeRoles(UserStatus.USER), showBlockChainDeliveryLog);
/**
 * @swagger
 * /api/v1/block-chain/update-delivery-log/{id}:
 *   put:
 *     summary: Update a specific delivery log in the blockchain
 *     description: Endpoint to update delivery log details by its unique identifier.
 *     tags: [BlockChainDelivery]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier for the delivery log
 *         type: string
 *         format: objectId
 *       - name: body
 *         in: body
 *         required: true
 *         description: Delivery log details to be updated
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               format: objectId
 *               description: Unique identifier for the user
 *             deliveryDetails:
 *               type: string
 *               description: Updated details of the delivery
 *             timestamp:
 *               type: string
 *               format: date-time
 *               description: Updated time when the delivery was logged
 *             blockchainHash:
 *               type: string
 *               description: Updated hash of the blockchain entry for the delivery
 *           required:
 *             - userId
 *             - deliveryDetails
 *             - timestamp
 *             - blockchainHash
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully updated the delivery log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery log updated successfully."
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
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data."
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
router.put('/update-delivery-log/:id', authenticationToken, authorizeRoles(UserStatus.USER), globalValidator(updateBlockChainDeliverySchema), updateBlockChainDeliveryLog);
/**
 * @swagger
 * /api/v1/block-chain/delete-delivery-log/{id}:
 *   delete:
 *     summary: Delete a specific delivery log from the blockchain
 *     description: Endpoint to delete a delivery log by its unique identifier.
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
 *         description: Successfully deleted the delivery log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery log deleted successfully."
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
router.delete('/delete-delivery-log/:id', authenticationToken, authorizeRoles(UserStatus.USER), deleteBlockChainDeliveryLog);
export default router;