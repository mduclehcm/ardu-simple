# ArduPilot Ground Station Control

A modern web-based ground station control application specifically designed for ArduPilot autopilot systems. This application provides real-time monitoring, control, and mission planning capabilities through a responsive web interface.

## Features

- **Real-time Telemetry**: Monitor vehicle position, attitude, and system status
- **Mission Planning**: Create and upload flight missions to ArduPilot vehicles
- **Parameter Management**: View and modify vehicle parameters in real-time
- **Flight Data Logging**: Record and analyze flight data
- **Responsive Web Interface**: Works on desktop, tablet, and mobile devices
- **Cross-platform**: Runs in any modern web browser

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Modern CSS with responsive design
- **Communication**: WebSocket/HTTP for real-time data exchange with ArduPilot

## Prerequisites

- Node.js 18+ and npm/pnpm
- ArduPilot-compatible vehicle (drone, rover, boat, etc.)
- Ground control station (Mission Planner, QGroundControl, or similar) for initial setup
- Web browser with WebSocket support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mduclehcm/ardu-simple.git
cd ardu-simple
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

### ArduPilot Setup

1. Ensure your ArduPilot vehicle is configured for telemetry output
2. Set up the appropriate communication protocol (MAVLink over UDP/TCP)
3. Configure the ground station to forward telemetry data to this web application

### Application Configuration

Create a configuration file to specify:
- Telemetry source (IP address and port)
- Vehicle type and capabilities
- Default mission parameters
- Logging preferences

## Usage

### Connecting to Vehicle

1. Ensure your ArduPilot vehicle is powered on and transmitting telemetry
2. Configure the connection settings in the web interface
3. Click "Connect" to establish communication

### Mission Planning

1. Use the map interface to create waypoints
2. Set mission parameters for each waypoint
3. Upload the mission to your vehicle
4. Monitor mission execution in real-time

### Parameter Management

1. Browse available parameters by category
2. Modify parameters as needed
3. Save changes to the vehicle
4. Monitor parameter changes in real-time

## Development

### Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── services/      # API and communication services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── assets/        # Static assets
```

### Building for Production

```bash
pnpm build
```

The built application will be in the `dist/` directory, ready for deployment to any web server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License

Copyright (c) 2024 ArduPilot Ground Station Control

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

For issues and questions:
- Check the [Issues](https://github.com/mduclehcm/ardu-simple/issues) page
- Review ArduPilot documentation for vehicle-specific questions
- Consult the [ArduPilot forums](https://discuss.ardupilot.org/)

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Designed for [ArduPilot](https://ardupilot.org/) autopilot systems
- Inspired by open-source ground station projects
