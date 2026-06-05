import * as FoodSpotController from '../api/food_spots/fs.controller'
import  { Router } from 'express'
import { limiter } from '../middleware/rateLimit';
import { authMiddleware } from '../middleware/authMiddleware';
import { GenerateOtpController, VerifyOtpController } from '../api/auth/auth.controller';



export const router = Router();

//All GET routes
router.get('/app/get-food-spots',authMiddleware,FoodSpotController.getAllFoodSpotsController);
router.get('/app/get-food-spot/:id',authMiddleware,FoodSpotController.getFoodSpotById)
router.get('/app/my-food-spots',authMiddleware,limiter,FoodSpotController.getFoodSpotsByUserIdController);

//All POST routes
router.post('/app/food-spot',authMiddleware,limiter,FoodSpotController.AddFoodSpotController);
router.put('/app/add-food-rating',authMiddleware,limiter,FoodSpotController.assignRatingController);
router.post('/otp/generate', GenerateOtpController);
router.post('/otp/verify', VerifyOtpController)
