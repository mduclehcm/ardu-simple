# ArduPilot Ground Station Control

A modern web-based ground station control application specifically designed for ArduPilot autopilot systems. This application provides real-time monitoring, control, and mission planning capabilities through a responsive web interface.

## Features

- **Real-time Telemetry**: Monitor vehicle position, attitude, and system status
- **Mission Planning**: Create and upload flight missions to ArduPilot vehicles
- **Parameter Management**: View and modify vehicle parameters in real-time
- **Flight Data Logging**: Record and analyze flight data
- **Responsive Web Interface**: Works on desktop, tablet, and mobile devices
- **Cross-platform**: Runs in any modern web browser

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
