# Project 2: Flack
---
### CS50x: Web Programming with Python and JavaScript
My version of Flack is modeled more towards the old-school IRC (Internet Relay Chat) rather than messaging app Slack. Users can join channels which are chatrooms to post messages. 

The app's layout was built from scratch, using Bootstrap and Materialize components. This one was a little challenging as I had some difficulties implementing web sockets (even though I understand how it works in principle). If I have more time in the future, I would optimize it more, as currently it only fulfills all the requirements, and thus is pretty bare-bones.

The personalization is incorporating a very old-school feel as modern messaging apps all look much slicker and less glaring to the eyes. I started off having an avatar beside each message (successfully implemented but deleted) but it was dropped after deciding that I wanted to go for an IRC-look stylistically.
---
## Improvements/bugs
These are the bugs and improvements that I know exist and might plan to fix in the future after finishing the course

1. Message container not snapping to bottom of viewport when new message comes
2. No user log-out -- once you are prompted at the start of session and logged in, you cannot log-out unless you open a new session
    2.1. No user credentials/registration system -- already demonstrated in CS50x Web Project and this courses' Project 1
    2.2. No checking if two concurrent users have the same username
    2.3. No way to change username
3. New channels added that starts with special characters have a "_" appended before them because of querySelector reasons in Javascript; there is probably a more elegant way of doing this which might be explored in future
    3.1. Optional: Did not switch to new channel upon channel creation although easily implemented
4. No way to delete/rename channels
5. Viewport only works for fullscreen -- very off for minimized/mobile apps; due to lack of time and experience
6. Color schemes changeability (light mode, dark mode, etc)?
---
## To use
1. In terminal, navigate to this project
2. Run `pip3 install -r requirements.txt` to make sure all necessary Python packages are installed
3. Run `python3 application.py`
4. Navigate to the URL provided by `flask`
5. Note: for changes to application to take place, restart the flask application and session (browser)
6. Best to use Incognito or dedicated browser window because of sessioning