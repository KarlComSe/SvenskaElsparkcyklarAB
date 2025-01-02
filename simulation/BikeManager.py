import asyncio
import datetime
from typing import List

import aiohttp
import requests
from flask_socketio import SocketIO

from Bike import Bike
from config import Config

async def main():
    async with BikeManager() as manager:
        await manager.setup()
        while True:
            print("Simulation Menu:")

            number_of_bikes = len(manager.bikes)
            print(f"Number of bikes: {number_of_bikes}")

            more_bikes = input("Would you like to add more bikes? (y/n): ").strip().lower()
            if more_bikes == "y":
                try:
                    quantity = int(input("Enter the number of bikes to add: "))
                except ValueError:
                    print("Invalid input. Please enter numerical values.")
                bikes = manager.create_bikes(quantity)
                for bike in bikes:
                    manager.bikes.append(Bike(bike.get('id'), bike.get('longitude'), bike.get('latitude'), manager.session))
                print(f"Added {len(bikes)} bikes")
                print(f"Bikes in simulation {len(manager.bikes)} bikes")

            try:
                duration = int(input("Enter simulation duration (seconds): "))
                speed_factor = int(input("Enter speed factor (1-50): "))
                await manager.run(duration=duration, speed_factor=speed_factor)
            except ValueError:
                print("Invalid input. Please enter numerical values.")

            repeat = input("Run another simulation? (y/n): ").strip().lower()
            if repeat != "y":
                break
        if manager.session:
            await manager.session.close()


class BikeManager:
    def __init__(self, socketio: SocketIO = None):
        self.bikes: List[Bike] = []
        self.session = None
        self.socket = socketio
        self.is_running = False

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.session.close()

    async def get_session(self):
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session

    async def setup(self):
        await self.get_session()
        await self.add_bikes()

    async def add_bikes(self):
        session = await self.get_session()
        url = f"{Config.API_BASE_URL}/bike/"
        try:
            async with self.session.get(url) as response:
                if response.status != 200:
                    raise aiohttp.ClientResponseError(
                        status=response.status,
                        message=f"Error while fetching bikes from {url}")

                bikes = await response.json()
                for bike in bikes:
                    self.bikes.append(Bike(bike.get('id'), bike.get('longitude'), bike.get('latitude'), self.session, self.socket))
        except aiohttp.ClientResponseError as e:
            # Handle HTTP response errors (e.g., bad status)
            print(f"HTTP error occurred: {e.status} - {e.message}")

    @staticmethod
    def create_bikes(quantity: int = 10):
        body = [
                   {'latitude': 57.70887, 'longitude': 11.97456}
               ] * quantity
        response = requests.post(
            f"{Config.API_BASE_URL}/bike/create-many",
            json=body
        )
        return response.json()

    def get_bike_by_id(self, bike_id) -> Bike or None:
        for bike in self.bikes:
            print(bike.id, bike_id)
            if bike.id == bike_id:
                return bike
        return None

    async def simulate(self, duration: int, speed_factor=25):
        if self.is_running:
            return
        self.is_running = True
        end_time = datetime.datetime.now() + datetime.timedelta(seconds=duration)
        print(f"Starting simulation for {duration} seconds")
        print(f"Speed factor: {speed_factor}")
        print(f"End time: {end_time}")
        print(f"Bikes in simulation {len(self.bikes)} bikes")
        tasks = [bike.simulate(end_time, speed_factor) for bike in self.bikes]
        try:
            await asyncio.gather(*tasks)
        finally:
            print()
            print(f"Simulation ended")
            self.is_running = False

    async def run(self, duration: int=30, speed_factor: int = 25):
        await self.simulate(duration, speed_factor)

if __name__ == "__main__":
    asyncio.run(main())