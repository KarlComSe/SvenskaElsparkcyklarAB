# Bike Simulation System

This module simulates bike movements and behavior for the Svenska Elsparcyklar AB system, enabling dynamic management and simulation of bike-sharing systems.

---

## Prerequisites
- Python 3.12 or higher
- pip (Python package installer)

---

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:KarlComSe/SvenskaElsparkcyklarAB.git
   cd simulation
   ```

2. Create a virtual environment and activate it:

   **Unix/MacOS:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Project Structure
- **`BikeManager.py`** - Manages bike instances and their states, handles the simulation logic.
- **`Bike.py`** - Represents individual bikes with simulation methods.
- **`config.py`** - Configuration file (e.g., API base URL).
- **`Position.py`** - Handles geographical positioning.
- **`RouteGenerator.py`** - Generates routes for simulations.

---

## Usage

### Running the Simulation
1. Start the simulation:
   ```bash
   python BikeManager.py
   ```
2. Follow the interactive prompts to:
   - Add bikes in the system.
   - Set the simulation duration (seconds) and a speed factor.

3. The simulation will display "real-time" progress in the console.

4. Afterward, you can choose to run another simulation or exit.

### Example Output (somewhat representative)
```text
> Simulation Menu:
  Number of bikes: 5
  Add more bikes? (y/n): y
  Enter number of bikes to add: 3
  Simulation duration (seconds): 60
  Speed factor: 5
> Simulation Started
  Bikes in simulation: 8
  Simulation ended successfully
```

---
## Notes
- All API-based operations use the `Config.API_BASE_URL` value.
- The system is somewhat prepared for integration with WebSockets via Flask to facilitate real-time communication, with the idea of emitting each bike's state change through the WebSocket.
---

###