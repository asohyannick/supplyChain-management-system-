import express from 'express'; 
import authenticationToken from '../../middleware/authentication/authenToken'; 
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { droneSchema, updateDroneSchema, } from '../../utils/validator'; 
import droneWeatherMapOptimization from '../../services/droneService/droneWeatherDataOptimization/droneWeatherDataOptimization';
import createDroneService from '../../services/droneService/createDroneService/createDroneService';
import showDroneServices from '../../services/droneService/showDroneServices/showDroneServices';
import showDroneService from '../../services/droneService/showDroneService/showDroneService';
import updateDroneService from '../../services/droneService/updateDroneService/updateDroneService';
import deleteDroneService from '../../services/droneService/deleteDroneService/deleteDroneService';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';
const router = express.Router(); 
/**
 * @swagger
 * /api/v1/drone/create-drone:
 *   post:
 *     summary: Create a new drone delivery request
 *     description: Endpoint to create a new drone delivery request with user information and package details.
 *     tags: [Drone Management Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *                 description: Unique identifier for the user
 *               pickupTime:
 *                 type: string
 *                 format: date-time
 *                 description: The time when the package should be picked up
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Street address
 *                   city:
 *                     type: string
 *                     description: City of the address
 *                   state:
 *                     type: string
 *                     example: "IL"
 *                     description: State abbreviation
 *                   zipCode:
 *                     type: string
 *                     description: ZIP or postal code
 *                   country:
 *                     type: string
 *                     description: Country name
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zipCode
 *                   - country
 *               notes:
 *                 type: string
 *                 example: "Leave at front door."
 *                 description: Additional notes for the delivery
 *               packageDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     weight:
 *                       type: number
 *                       description: Weight of the package in kilograms
 *                     dimensions:
 *                       type: object
 *                       properties:
 *                         length:
 *                           type: number
 *                           description: Length of the package in centimeters
 *                         width:
 *                           type: number
 *                           description: Width of the package in centimeters
 *                         height:
 *                           type: number
 *                           description: Height of the package in centimeters
 *                       required:
 *                         - length
 *                         - width
 *                         - height
 *                     description:
 *                       type: string
 *                       description: Description of the package
 *                   required:
 *                     - weight
 *                     - dimensions
 *                     - description
 *             required:
 *               - userId
 *               - pickupTime
 *               - address
 *               - packageDetails
 *     responses:
 *       '201':
 *         description: Drone delivery request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Drone delivery request created."
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
 */
router.post(
    '/create-drone',
    globalValidator(droneSchema),
    authenticationToken,
    authorizeRoles(UserStatus.DRONE_OPERATOR),
    createDroneService
);
/**
 * @swagger
 * /api/v1/drone/show-drones:
 *   get:
 *     summary: Retrieve a list of drones
 *     description: Endpoint to fetch all drones available for delivery.
 *     tags: [Drone Management Endpoints]
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     responses:
 *       '200':
 *         description: A list of drones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     format: objectId
 *                     description: Unique identifier for the user
 *                   pickupTime:
 *                     type: string
 *                     format: date-time
 *                     description: The time when the package should be picked up
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                         description: Street address
 *                       city:
 *                         type: string
 *                         description: City of the address
 *                       state:
 *                         type: string
 *                         example: "IL"
 *                         description: State abbreviation
 *                       zipCode:
 *                         type: string
 *                         description: ZIP or postal code
 *                       country:
 *                         type: string
 *                         description: Country name
 *                   notes:
 *                     type: string
 *                     description: Additional notes for the delivery
 *                   packageDetails:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         weight:
 *                           type: number
 *                           description: Weight of the package in kilograms
 *                         dimensions:
 *                           type: object
 *                           properties:
 *                             length:
 *                               type: number
 *                               description: Length of the package in centimeters
 *                             width:
 *                               type: number
 *                               description: Width of the package in centimeters
 *                             height:
 *                               type: number
 *                               description: Height of the package in centimeters
 *                         description:
 *                           type: string
 *                           description: Description of the package
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
router.get('/show-drones', 
    authenticationToken,   
    authorizeRoles(UserStatus.DRONE_OPERATOR),
    showDroneServices
);
/**
 * @swagger
 * /api/v1/drone/show-drone/{id}:
 *   get:
 *     summary: Retrieve details of a specific drone
 *     description: Endpoint to fetch details of a drone by its unique identifier.
 *     tags: [Drone Management Endpoints]
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the drone
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       '200':
 *         description: Details of the specified drone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: objectId
 *                   description: Unique identifier for the user
 *                 pickupTime:
 *                   type: string
 *                   format: date-time
 *                   description: The time when the package should be picked up
 *                 address:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                       description: Street address
 *                     city:
 *                       type: string
 *                       description: City of the address
 *                     state:
 *                       type: string
 *                       example: "IL"
 *                       description: State abbreviation
 *                     zipCode:
 *                       type: string
 *                       description: ZIP or postal code
 *                     country:
 *                       type: string
 *                       description: Country name
 *                 notes:
 *                   type: string
 *                   description: Additional notes for the delivery
 *                 packageDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       weight:
 *                         type: number
 *                         description: Weight of the package in kilograms
 *                       dimensions:
 *                         type: object
 *                         properties:
 *                           length:
 *                             type: number
 *                             description: Length of the package in centimeters
 *                           width:
 *                             type: number
 *                             description: Width of the package in centimeters
 *                           height:
 *                             type: number
 *                             description: Height of the package in centimeters
 *                       description:
 *                         type: string
 *                         description: Description of the package
 *       '404':
 *         description: Drone not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Drone not found."
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

router.get('/show-drone/:id', 
    authenticationToken,
    authorizeRoles(UserStatus.DRONE_OPERATOR),
    showDroneService
);
/**
 * @swagger
 * /api/v1/drone/ai-drone-optimization:
 *   get:
 *     summary: Optimize drone routes using AI and weather data
 *     description: Endpoint to fetch optimized drone routes based on AI algorithms and current weather conditions.
 *     tags: [Drone Management Endpoints]
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully retrieved optimized drone routes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 optimizedRoutes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       routeId:
 *                         type: string
 *                         description: Unique identifier for the optimized route
 *                       waypoints:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             latitude:
 *                               type: number
 *                               description: Latitude of the waypoint
 *                             longitude:
 *                               type: number
 *                               description: Longitude of the waypoint
 *                       estimatedTime:
 *                         type: string
 *                         format: date-time
 *                         description: Estimated time to complete the route
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
router.get('/ai-drone-optimization', 
    authenticationToken, 
    authorizeRoles(UserStatus.DRONE_OPERATOR),    
    droneWeatherMapOptimization
);
/**
 * @swagger
 * /api/v1/drone/update-drone/{id}:
 *   put:
 *     summary: Update details of a specific drone
 *     description: Endpoint to update the information of a drone by its unique identifier.
 *     tags: [ Drone Management Endpoints]
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the drone to be updated
 *         schema:
 *           type: string
 *           format: objectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *                 description: Unique identifier for the user
 *               pickupTime:
 *                 type: string
 *                 format: date-time
 *                 description: The time when the package should be picked up
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Street address
 *                   city:
 *                     type: string
 *                     description: City of the address
 *                   state:
 *                     type: string
 *                     example: "IL"
 *                     description: State abbreviation
 *                   zipCode:
 *                     type: string
 *                     description: ZIP or postal code
 *                   country:
 *                     type: string
 *                     description: Country name
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zipCode
 *                   - country
 *               notes:
 *                 type: string
 *                 description: Additional notes for the delivery
 *               packageDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     weight:
 *                       type: number
 *                       description: Weight of the package in kilograms
 *                     dimensions:
 *                       type: object
 *                       properties:
 *                         length:
 *                           type: number
 *                           description: Length of the package in centimeters
 *                         width:
 *                           type: number
 *                           description: Width of the package in centimeters
 *                         height:
 *                           type: number
 *                           description: Height of the package in centimeters
 *                     description:
 *                       type: string
 *                       description: Description of the package
 *     responses:
 *       '200':
 *         description: Drone details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Drone updated successfully."
 *       '404':
 *         description: Drone not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Drone not found."
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
router.put('/update-drone/:id',
    authenticationToken, 
    authorizeRoles(UserStatus.DRONE_OPERATOR),
    globalValidator(updateDroneSchema), 
    updateDroneService
);
/**
 * @swagger
 * /api/v1/drone/delete-drone/{id}:
 *   delete:
 *     summary: Delete a specific drone
 *     description: Endpoint to delete a drone by its unique identifier.
 *     tags: [Drone Management Endpoints]
 *     security:
 *       - Bearer: []  # Assuming you are using Bearer token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the drone to be deleted
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       '200':
 *         description: Drone deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Drone deleted successfully."
 *       '404':
 *         description: Drone not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Drone not found."
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
router.delete('/delete-drone/:id',
 authenticationToken, 
 authorizeRoles(UserStatus.DRONE_OPERATOR),
 deleteDroneService
);
export default router;