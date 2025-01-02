import random
from Position import Position

def get_random_route():
    return routes[int(len(routes)*(random.random()))]

def create_route_from_positions(positions, points_per_segment = 50):
    route = []
    for i in range(len(positions) - 1):
        start = positions[i]
        end = positions[i + 1]
        lat_diff = end["lat"] - start["lat"]
        lng_diff = end["lng"] - start["lng"]
        for j in range(points_per_segment):
            point = Position(start["lng"] + (lng_diff / points_per_segment) * j, start["lat"] + (lat_diff / points_per_segment) * j)
            route.append(point)
    route.append(Position(positions[-1]["lng"], positions[-1]["lat"]))
    return route

goteborg_route = create_route_from_positions([
    # Byalagsgatan 1 / Kyrkbytorget,
    {"lat": 57.711885, "lng": 11.907913},
    # Lundbyvassen
    {"lat": 57.720049, "lng": 11.955415},
    # Götaplatsen
    {"lat": 57.697447, "lng": 11.979825},
    # Linnéplatsen?
    {"lat": 57.696271, "lng": 11.986638},
    # Götaplatsen
    {"lat": 57.697447, "lng": 11.979825},
    # Lundbyvassen
    {"lat": 57.720049, "lng": 11.955415},
    # Byalagsgatan 1 / Kyrkbytorget,
    {"lat": 57.711885, "lng": 11.907}
])
liseberg_route = create_route_from_positions([
    # Near Liseberg
    {"lat": 57.70887, "lng": 11.97456},
    # Near Korsvägen
    {"lat": 57.71087, "lng": 11.98456},
    # Near Södra Vägen
    {"lat": 57.71587, "lng": 11.99456},
    # Near Scandinavium
    {"lat": 57.72087, "lng": 11.98456},
    # Back to Liseberg
    {"lat": 57.70887, "lng": 11.97456}
])

hisingen_route = create_route_from_positions([
    # Near Hisingen
    {"lat": 57.69087, "lng": 11.95056},
    # Near Ramberget
    {"lat": 57.69587, "lng": 11.96056},
    # Near Kvillebäcken
    {"lat": 57.70087, "lng": 11.97056},
    # Near Backaplan
    {"lat": 57.70587, "lng": 11.96056},
    # Back to Hisingen
    {"lat": 57.69087, "lng": 11.95056}
])

majorna_route = create_route_from_positions([
    # Near Majorna
    {"lat": 57.68087, "lng": 11.93056},
    # Near Slottskogen
    {"lat": 57.68587, "lng": 11.94056},
    # Near Linnéplatsen
    {"lat": 57.69087, "lng": 11.95056},
    # Near Järntorget
    {"lat": 57.69587, "lng": 11.94056},
    # Back to Majorna
    {"lat": 57.68087, "lng": 11.93056}
])

frolunda_route = create_route_from_positions([
    # Near Frölunda
    {"lat": 57.67087, "lng": 11.91056},
    # Near Ruddalen
    {"lat": 57.67587, "lng": 11.92056},
    # Near Högsbo
    {"lat": 57.68087, "lng": 11.93056},
    # Near Flatås
    {"lat": 57.68587, "lng": 11.92056},
    # Back to Frölunda
    {"lat": 57.67087, "lng": 11.91056}
])

molndal_route = create_route_from_positions([
    # Near Mölndal
    {"lat": 57.66087, "lng": 11.89056},
    # Near Åby
    {"lat": 57.66587, "lng": 11.90056},
    # Near Krokslätt
    {"lat": 57.67087, "lng": 11.91056},
    # Near Lackarebäck
    {"lat": 57.67587, "lng": 11.90056},
    # Back to Mölndal
    {"lat": 57.66087, "lng": 11.89056}
])

kalltorp_route = create_route_from_positions([
    # Near Kålltorp
    {"lat": 57.65087, "lng": 11.87056},
    # Near Delsjön
    {"lat": 57.65587, "lng": 11.88056},
    # Near Örgryte
    {"lat": 57.66087, "lng": 11.89056},
    # Near Skatås
    {"lat": 57.66587, "lng": 11.88056},
    # Back to Kålltorp
    {"lat": 57.65087, "lng": 11.87056}
])

partille_route = create_route_from_positions([
    # Near Partille
    {"lat": 57.64087, "lng": 11.85056},
    # Near Sävedalen
    {"lat": 57.64587, "lng": 11.86056},
    # Near Utby
    {"lat": 57.65087, "lng": 11.87056},
    # Near Kviberg
    {"lat": 57.65587, "lng": 11.86056},
    # Back to Partille
    {"lat": 57.64087, "lng": 11.85056}
])

angered_route = create_route_from_positions([
    # Near Angered
    {"lat": 57.63087, "lng": 11.83056},
    # Near Hjällbo
    {"lat": 57.63587, "lng": 11.84056},
    # Near Gårdsten
    {"lat": 57.64087, "lng": 11.85056},
    # Near Hammarkullen
    {"lat": 57.64587, "lng": 11.84056},
    # Back to Angered
    {"lat": 57.63087, "lng": 11.83056}
])

bergsjon_route = create_route_from_positions([
    # Near Bergsjön
    {"lat": 57.62087, "lng": 11.81056},
    # Near Kortedala
    {"lat": 57.62587, "lng": 11.82056},
    # Near Gamlestaden
    {"lat": 57.63087, "lng": 11.83056},
    # Near Kviberg
    {"lat": 57.63587, "lng": 11.82056},
    # Back to Bergsjön
    {"lat": 57.62087, "lng": 11.81056}
])

save_route = create_route_from_positions([
    # Near Säve
    {"lat": 57.61087, "lng": 11.79056},
    # Near Tuve
    {"lat": 57.61587, "lng": 11.80056},
    # Near Backa
    {"lat": 57.62087, "lng": 11.81056},
    # Near Brunnsbo
    {"lat": 57.62587, "lng": 11.80056},
    # Back to Säve
    {"lat": 57.61087, "lng": 11.79056}
])

routes = [
    goteborg_route,
    liseberg_route,
    hisingen_route,
    majorna_route,
    frolunda_route,
    molndal_route,
    kalltorp_route,
    partille_route,
    angered_route,
    bergsjon_route,
    save_route
]