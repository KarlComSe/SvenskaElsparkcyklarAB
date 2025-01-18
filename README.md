# Svenska Elsparkcyklar AB

This system is developed within the course [Software Development in Virtual Teams](https://dbwebb.se/kurser/vteam-v1/) at [BTH](https://www.bth.se/). The course aims at teaching 1) advanced programming within web technologies and 2) how to work in a software development team. 

Svenska Elsparkcyklar AB represents a company that targets to enter the electrical scooter rental market. The team has been tasked with developing the required system(s) for this. [The requirements are available here](https://docs.google.com/document/d/1zWksQNmkXJgM7Q66k3-mgcxrexO6eF9xqd0Z632BwlU/edit?tab=t.0#heading=h.8j8e6fp00oge)(and some contextual info [here](https://dbwebb.se/kurser/vteam-v1/proj/kravspecifikation)). 

In short, the team has interpreted the requirement and selected an architecture which lead to the following sub-systems:

* **Rest-API and backend**: Delivers the service (incl. all business rules, managing the data) (NestJS on Node.js + SQLite3)
* **Customer and administration web frontend**: Allows customers to access and manage their accounts, allows administrators to manage the servcice and customers (React)
* **Customer app (/mobile page)**: for renting and returning electrical scooter bikes (React) 
* **Bike simulator / electrical scooter control emulator (with ability to simulate complete system)**: Intended to represent the actual bike hardware (Svelte5) 

# Run and demo app

## Clone

This repo has submodules.  

**To clone including submodules:**
- git clone --recursive git@github.com:KarlComSe/SvenskaElsparkcyklarAB.git

**To update submodules:**
- git submodule update --remote

Please note that there is a .env-file in ./backend which is needed for the app to fully function with OAuth-flow. Copy the example and add needed secrets. If you don't have the secrets, you can generate needed secret by [creating a New OAuth App in your Github account](https://github.com/settings/developers). 

## Build images and start containers

Build images:
```
docker compose -f docker-compose-demo.yml build --no-cache 
# or
docker compose -f docker-compose-demo.yml build
```

Start containers:
```
docker compose -f docker-compose-demo.yml up'
```

## Demo the app

Once the containers are running, the different services should be available here:

- localhost:3535 : rest-API and backend
  - localhost:3535/api : API documentation
- localhost:5173 : customer and administration web frontend
- localhost:5174 : bike simulator
- localhost:1337 : customer app

### Simulate thousands of moving bikes

By visiting the bike simulator, and navigating to http://localhost:5174/map, it is possible to create bikes, make them all move and sync them to the API. All bikes can be individually monitored at http://localhost:5174/ by selecting the bike-id. Once a bike is selected, it is possible to alter its state in various different ways (e.g. try to start it, return it etc.). 

When the bike simulator is running, it is possible to login to the administration web frontend and see all bikes that moves on a map.

The system has been tested with more than 3000 bikes on a normal desktop computer without issues. 

Performance of bike simulator:
 - In case the bike simulator slows down, it will help to zoom in on fewer bikes on the map.
 - The simulator was originally built with the target to only simulate a couple of bikes. 


### Alternative simulator

A Python script also exists. See the /simulation/README.md.

## Code quality

Code quality is achieved in two ways: 

- Code coverage analytics
- Linting
- External static code analyzing service

All different parts of the system is linted according to various rules. Some parts of the system is analyzed through Scrutinizer. Most part of the system achieves 100 % compliance with the selected linting standards.

Code quality has primarily been a focus for the backend (incl. API). The reason for this is that it is more difficult to test frontend applications and that these are less critical in case of failure. The backend has a code coverage close to 100 %.

### Scrutinizer data for /backend and /frontend

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/KarlComSe/SvenskaElsparkcyklarAB/badges/quality-score.png?b=development)](https://scrutinizer-ci.com/g/KarlComSe/SvenskaElsparkcyklarAB/?branch=development)

[![Code Coverage](https://scrutinizer-ci.com/g/KarlComSe/SvenskaElsparkcyklarAB/badges/coverage.png?b=development)](https://scrutinizer-ci.com/g/KarlComSe/SvenskaElsparkcyklarAB/?branch=development)

[![Build Status](https://scrutinizer-ci.com/g/KarlComSe/SvenskaElsparkcyklarAB/badges/build.png?b=development)](https://scrutinizer-ci.com/g/KarlComSe/SvenskaElsparkcyklarAB/build-status/development)

# Other remarks

The API doesn't implement fully protected end points. Thus, please don't use it in a production environment. 