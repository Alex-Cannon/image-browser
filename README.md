Welcome to my simple Image-browser!
==========================

This project is a simple, server-side project for Freecodecamp. Clients can send a GET request to the server and get a list of images. This code has an MIT liscense, so feel free to use it as long as you follow the liscense.

**Get started**

To get started, follow these steps:
1. Make a API account on imgur.
2. Clone this repo to your machine.
3. Navigate to this repo with your cmd.
4. Add your Auth. CLIENT_ID="" in your .env file (IMPORTANT)
5. Run "npm start" to start the server

**API**

*/api/search?titles=""&offset=""&count=""*

Returns a list of images.
* *titles* - search query. (Required)
* *offset* - # of offset pages. Use to query through pages of results. (Optional, 0 by default)
* *count* - # of results per page. (Optional, 10 by default)

*/api/search/recent*

Returns a list of recent searches.
Warning: uses temporary storage on server. Remove/Modify for production.


Made by [Alex Cannon](https://www.linkedin.com/in/alexander-cannon-2a5b0513b/)
-------------------

\ ゜o゜)ノ
