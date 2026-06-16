import * as FoodSpotController from '../api/food_spots/fs.controller'
import  { Router } from 'express'
import { limiter } from '../middleware/rateLimit';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';
import * as AuthController from '../api/auth/auth.controller';
import * as RolesController from '../api/roles/roles.controller'



export const router = Router();

router.get('/app/get-food-spots',authMiddleware,FoodSpotController.getAllFoodSpotsController);
router.get('/app/get-food-spot/:id',authMiddleware,FoodSpotController.getFoodSpotById)
router.get('/app/my-food-spots',authMiddleware,limiter,FoodSpotController.getFoodSpotsByUserIdController);

//All POST routes
router.post('/app/food-spot',authMiddleware,limiter,FoodSpotController.AddFoodSpotController);
router.put('/app/add-food-rating',authMiddleware,limiter,FoodSpotController.assignRatingController);
router.post('/otp/generate', AuthController.GenerateOtpController);
router.post('/otp/verify', AuthController.VerifyOtpController)


//ROLE BASED ROUTING..

//For ADMINS

//Get all pending food spots..
router.get('/admin/food-spots/pending',authMiddleware,requireRole("ADMIN"),RolesController.GetPendingFoodSpotsController);

//Verify particular pending spot..
router.patch('/admin/food-spots/:id/verify',authMiddleware,requireRole("ADMIN"),RolesController.VerifyPendingSpotController);
router.get('/admin/food-spots/:id',authMiddleware,requireRole("ADMIN"),RolesController.GetPendingFoodSpotController)

//For OWNER..

//Get all admins
router.get('/owner/admins',authMiddleware,requireRole("OWNER"),RolesController.GetAllAdminsController);

router.get('/owner/students',authMiddleware,requireRole("OWNER"),RolesController.GetAllStudentsController);

router.get('/owner/food-spots/pending',authMiddleware,requireRole("OWNER"),RolesController.GetPendingFoodSpotsController);

//Promotion to admin..
router.post('/owner/admins',authMiddleware,requireRole("OWNER"),RolesController.PromoteToAdminController);

//Getting all admin queries.. probably in v2
//router.get('/owner/admins/query',requireRole("OWNER"));

//Demotion to a student..
router.patch('/owner/admins/:id',authMiddleware,requireRole("OWNER"),RolesController.DemoteToStudentController);
