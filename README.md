# Dofus data portal

This app serves the front-end display and data analysis services that can be leveraged from the data collection of Dofus-scanner.

## Installation 

To use this application, clone this repo, run `npm install` and add a PostgreSQL database connection (connecting to the same DB as Dofus-scanner) inside a file named `.env` at the root of the project folder. You must then push the prisma model to the database so as to have the corresponding tables. Then, running `npx prisma generate` will create the prisma client. Then, you're all set and can execute `npm run dev` to serve your app locally, connected to your DB (schema can be found in this project's schema.prisma file).
