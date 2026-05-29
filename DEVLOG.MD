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
 * Get the pagination working properly.
 * Make sure data flows into the home page nicely , then we'll focus on 'adding food spots' aspect.

## Questions that I had and Answers that I got : 

- There was a question that " why should I not just filter data on the frontend ? , just retrieve everything and filter based on user filter params ". Then I realised the more JS sent   over the network , the poorer perfomance + security at that moment on those queries . So I had to add the filter logic on the backend , so the app only retrieves what's asked. And ofcourse pagination will be there.

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

