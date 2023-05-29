# 📄 [Cardboard.ink](https://Cardboard.ink)

<h1>🐛 How to contribute.</h1>

<p align="left">Create a copy of this repository, then modify it as required and submit a request to merge your changes.</p>

<p align="left">You can also join our Guilded [server](https://guilded.gg/CardBoard) and chat with other contributors.</p>

#

<h1>🛠️ How to test the application.</h1>

<p align="left">Make sure ports 5555 and 5173 are free.</p>

<p align="left">Install Docker on your machine with compose and cd into the project dir and run `docker-compose up` or `docker compose up` depending on your docker + compose installation.</p>

<p align="left">Now open your web browser and go to url http://localhost:5555 (prisma studio). Here open the Roles model and add the roles USER and ADMIN. </p>

<p align="left">Now you can open http://localhost:5173 (svelte app) and make your user account and assign it ADMIN role from prisma studio.</p>

<p align="left">Congrats! Setup is complete, happy developing!</p>

#
