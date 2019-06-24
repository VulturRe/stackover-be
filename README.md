# stackover-be

This project was created by NodeJS.

## Development server

Run `npm run dev` for a dev api server. NOTE: run only after MongoDB starts.

Run `docker-compose -f docker-compose.dev.yml` for MongoDB & MongoExpress instances.

## Build

Run `docker-compose -f docker-compose.yml build && docker-compose -f docker-compose.yml up -d` after Angular App build for production build serve.
