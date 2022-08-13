# Swtizerland Open Transport Data - Departure and Arrival API 
## Installation

Setup is very easy. First, clone the repository 

```shell script
git clone https://github.com/tomihbk/cff-departure-arrival-dashboard-api.git
cd cff-departure-arrival-dashboard-api
```

Copy file `.env.dev` to `.env`

```dotenv
OPEN_TRANSPORT_DATA_API_URL = https://api.opentransportdata.swiss/ojp2020
OPEN_TRANSPORT_DATA_API_TOKEN = TOKEN_GENERATED_FROM(https://opentransportdata.swiss/en/dev-dashboard/)
API_VERSION = API_VERSION(v1)
APP_PORT = APP_PORT_FOR_DEVELOPMENT
```

Your project is now ready. Start the project with docker-compose :

```shell script
docker-compose up -d
```

Or on your local node environment :
```sh
npm install; npm run dev
```

Your API path is ``http://localhost:APP_PORT/API_VERSION/transport``.
