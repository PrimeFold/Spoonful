# Spoonfull

## Devlog..
- I'll document stuff about my journey during developing this project and debugging till proper functioning..

## Day-1 (25/05/2026)

- Created reposistory and did the basic stuff such as : 

* Added a README.MD
* Implemented basic express server.


## Day-2 (26/05/2026)

- Spent a lot of time adding & refining ui and fixing package dependency bugs , and added helper functions + necessary types. 

## Day-3 (28/05/2026)

- Today's goal is to sort of get the dashboard working barebones - For that I need to Get some backend stuff done such as:

   - api end-points
   - getting food-spot by id
   - Adding OTP verification system through email ( probably gonna use nodemailer since I don't have a domain yet ).
   - Added axios instance to hit OTP verification end-point
   - Verification will be in the form of POST-LOGIN.
   
- Was working on 27th May as well but didn't commit as such , anyways , wrote some functions for food spot controller.
- It was a little complex for me to implement the search filter and just overall feed-like fetch ( which is easy but due to filter logic I was confused ).
- Fixed some migration issues , had to reset the db and migrate again , took a fair toll of time.

# Day-4 (29/05/2026)

- Today's goal is to 
 * Fix bugs of last day.
 * Get the filtering logic done on the frontend so its seamless with the backend. 
 * Make sure data flows into the home page nicely , then we'll focus on 'adding food spots' aspect.

## Questions that I had and Answers that I got : 

- There was a question that "Why should I not just filter data on the frontend ? , just retrieve everything and filter based on user filter params ". Then I realised that large amoutn of JS sent over the network will produce issues like - 
   * Larger hydration cost
   * More JS memory usage
   * More React work
   * Slower mobile performance
   * Worse Core Web Vitals
- So I had to add the filter logic on the backend , so the app only retrieves what's asked. And ofcourse pagination will be implemented soon .

## Bugs : 

- Fixed some bugs today:

   * Session hook should've been on the top 
   * Added dependency array to the useEffect or it would re-run on ever render.
   * Added proper checks for the data , making sure its in the form of an array.
   * setMeal() and setTimeOfDay() were called during render, causing infinite re-renders.
   * Date.now() was used incorrectly. It returns milliseconds, not current hour.
   * user?.name.charAt(0) could still throw if name is undefined.
   * No loading state handling before rendering fetched data.
   * No proper error UI for failed queries.
   * useState<User>() || null is invalid logic and unnecessary.
   * Query response shape was assumed blindly instead of safely handled.
   * isLoading from React Query existed but wasn’t actually used.
   * activeFilter exists but filter pills UI doesn’t yet update it. The section was decorative cardboard pretending to be functionality.

## Extras : 
- Added QueryClientProvider and wrapped it around the app.
- Added ONE global instance for the useQueryClient hook.


# Day-6 (30/05/2026)

- Today I'll be making optimizations in my code : 
   * Duplicated where clause , unified them.
   * Preparing pagination on the backend and frontend ( maybe not today ).
   * Improving redis caching logic so that pagination don't mess up the cache stored. As of now it only stores the search metadata , but what if the user does the same search on being other than the page he was on? The backend should return THAT page's content . 
   * Improved data shape from backend and making sure the same shape is received on the frontend as well.
   * Added GET route for getting all food spots.
   * Some fixes in pagination on the frontend , implemented ui for that as well.

# Day-7 (01/06/2026)

- Debugging the food spot feed request and request validation:
   * Cleaned frontend GET params so blank `search` is not sent as `search=`.
   * Updated backend query validation to ignore empty search strings and handle optional filters correctly.
   * Confirmed the route is protected, so proper session/auth headers are required for `/app/get-food-spots`.
   * Solution found ! : 'skip' calculation was correct but when `skip=0` , it returns an error but `skip=0` is correct for `page=1`. Removed that validation in order to fix the issue.

- Built the logic to get user's own submissions i.e Food-spots that he submitted.
   * Added an endpoint `/app/get-my-food-spots`.
   * Added a controller and service function for the same.
   * Prepared a helper function on the frontend.
   * Added function calling and proper data flow. 
- Added ui adjustments to make site responsive for both large and small screens


# Day-8 (05/06/2026)

- Prepared `spot-card` or the spot details interface.
   * Added querys & helper functions for the same.
## Bugs : 
- Had a bug where adding food spot just throws `added foot spot` success message but actually it didn't.
- Some React rendering issue faced.
- I added a ton of logs to see what was the actual bottleneck , turns out it was 2 things :
   1. Maybe the data coming from the frontend was not type-safe so it was undefined.
   2. I was sending the data from frontend but it wasn't an object `data` , and on the backend I was destructuring it . 
   3. ( For react rendering issue ) - 
## Fixes : 
   1. Added a zod validation schema so that data coming from the frontend is type safe and in proper shape.
   2. Removed that destructrig , resulting in success.
