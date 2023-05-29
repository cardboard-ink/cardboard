# 📄 [Cardboard.ink](https://Cardboard.ink)

![GitHub](https://img.shields.io/github/license/sohamjaiswal/cardboard?style=flat-square)

### 🐛 How to contribute.

Create a copy of this repository, then modify it as required and submit a request to merge your changes.

You can also join our Guilded [server](https://guilded.gg/CardBoard) and chat with other contributors.

### 🛠️ How to test the application.

Install Docker on your machine with compose and cd into the project dir and run `docker-compose up` or `docker compose up` depending on your docker + compose installation.

Now open your web browser and go to url [localhost:5555](http://localhost:5555) (prisma studio). Here open the Roles model and add the roles USER and ADMIN.

Now you can open [localhost:5173](http://localhost:5173) (svelte app) and make your user account and assign it ADMIN role from prisma studio.
