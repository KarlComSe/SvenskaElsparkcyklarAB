import asyncio
import datetime
import random
from ftplib import print_line

import aiohttp
from flask_socketio import SocketIO

import RouteGenerator
from Position import Position
from config import Config


class Bike:

    print_count = 0

    def __init__(self, bike_id, longitude, latitude, session: aiohttp.ClientSession, bike_route = None, bike_route_index_position = None, socket : SocketIO = None):
        self._id = bike_id
        self._position = Position(longitude, latitude)
        self.bike_route = bike_route
        self.bike_route_index_position = bike_route_index_position
        self._session = session
        self._socket = socket
        self.count = 0

    def __str__(self):
        return "Bike id: " + str(self._id) + " at " + str(self._position)

    @property
    def id(self):
        return self._id

    @property
    def position(self):
        return self._position

    def move(self, longitude, latitude):
        self._position.longitude = longitude + random.randint(-1, 1)*0.0003
        self._position.latitude = latitude + random.randint(-1, 1)*0.0003
        if self._socket:
            # Emit only when position changes
            self._socket.emit('bike_update', {
                'bike_id': self._id,
                'latitude': latitude,
                'longitude': longitude
            })
        self.count = self.count + 1
        Bike.print_count = (Bike.print_count + 1) % 150
        if Bike.print_count == 0:
            print()


    @property
    def route(self):
        return self.bike_route

    @route.setter
    def route(self, new_route):
        self.bike_route = new_route

    async def simulate(self, end_time, speed_factor = 1):
        self.route = RouteGenerator.get_random_route()
        self.bike_route_index_position = random.randint(0, len(self.bike_route) - 1)
        while  datetime.datetime.now() < end_time:
            current_route_point = self.bike_route[self.bike_route_index_position]
            self.move(current_route_point.longitude, current_route_point.latitude)
            self.bike_route_index_position = (self.bike_route_index_position + 1) % len(self.bike_route)
            await self.update_bike_position()
            await asyncio.sleep(random.randint(1, 6)/speed_factor)

    async def update_bike_position(self):
        url = f"{Config.API_BASE_URL}/bike/{self._id}"
        payload = {
            "latitude": self._position.latitude,
            "longitude": self._position.longitude
        }
        try:
            async with self._session.patch(url, json=payload) as response:
                if response.status == 200:
                    print(f".", end="")
                else:
                    print(f"Failed to update bike position. Status: {response.status}, Body: {await response.text()}")
        except Exception as e:
            print(f"Error while updating bike position: {e}")