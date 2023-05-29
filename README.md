# [Cardboard.ink](https://Cardboard.ink)

### How to contribute.

<a align="Center">Create a copy of this repository, then modify it as required and submit a request to merge your changes.</a>

You can also join our Guilded [server](https://guilded.gg/CardBoard) and chat with other contributors.

#

### How to test the application.

Make sure ports 5555 and 5173 are free.

Install Docker on your machine with compose and cd into the project dir and run `docker-compose up` or `docker compose up` depending on your docker + compose installation.

Now open your web browser and go to url http://localhost:5555 (prisma studio). Here open the Roles model and add the roles USER and ADMIN. 

Now you can open http://localhost:5173 (svelte app) and make your user account and assign it ADMIN role from prisma studio.

Congrats! Setup is complete, happy developing!

#
