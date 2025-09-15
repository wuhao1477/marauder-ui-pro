# marauder-ui

![Marauder Web Interface Screenshot](docs/homepage.png)

A modern web interface for the [ESP32 Marauder](https://github.com/justcallmekoko/ESP32Marauder) firmware. This project provides a user-friendly way to interact with your Marauder device through a web browser.

🌐 **[Live Demo](https://mikystars.github.io/marauder-ui-pro/)**

> ~~This entire project~~ Part of this project, including the code and this README, has been written by Claude AI assistant. There is algo a bunch of code made by hand and/or with the help of GitHub Copilot.

## Features

- 🔌 Serial connection management
- 📡 Real-time AP and Bluetooth scanning and monitoring
- 👥 Station detection and tracking
- 📊 Dynamic AP and station list with sorting and filtering
- 🖥️ Interactive terminal output
- 🎨 Modern neobrutalist design
- 📱 Responsive layout
- ⌨️ Command history
- 🔍 Advanced filtering and sorting options

## Technical Details

- Built with Vue 3 and Tailwind CSS
- Uses Web Serial API for device communication
- Reactive state management
- Real-time data processing
- Modular component architecture

## Requirements

- A browser supporting the Web Serial API (Chrome, Edge)
- An ESP32 device running the [Marauder firmware](https://github.com/justcallmekoko/ESP32Marauder)

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/marauder-ui-pro.git
cd marauder-ui
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

1. Connect your Marauder device to your computer
2. Open the web interface
3. Click "Connect" and select your device from the serial port list
4. Use the command builder or enter custom commands
5. Monitor results in the AP list and terminal output

## Commands

The interface supports all Marauder commands, including:

- `scanap` - Scan for access points
- `scansta` - Scan for stations
- `stopscan` - Stop any ongoing scan
- `list -a` - List detected access points
- `sniffbeacon` - Sniff beacon frames
- `sniffdeauth` - Sniff deauth frames
- `sniffpmkid` - Sniff PMKID
- And many more...

## Features

### Access Point Monitoring
- Real-time AP detection
- Signal strength indicators
- Channel information
- Connected stations tracking
- Last seen timestamps

### Station Tracking
- Station-AP relationships
- MAC address display
- Station IDs
- Last seen information

### Interface Features
- Command history
- Terminal output
- Compact and detailed views
- Search and filter capabilities
- Sorting options

### Bluetooth Monitoring
- Real-time BT detection
- Signal strength indicators
- MAC address display
- BT name display
- Flipper detection
- Airtag detection
- Wardrive

### Bluetooth Attacking
- BLE Spam Apple Sour
- BLE Spam Switpair
- BLE Spam Samsung
- BLE Spam Flipper
- BLE Spam All

## Contributing

Feel free to submit issues and enhancement requests!

## Credits

- ESP32 Marauder firmware by [justcallmekoko](https://github.com/justcallmekoko)
- Interface design and implementation by Claude AI
- Project maintenance by: [michelangelomo](https://github.com/michelangelomo) and [Mikystars](https://github.com/Mikystars)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
