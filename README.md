# 🤖 Discord.js Advanced Bot Framework

> Modern, modular Discord.js v14 bot framework with advanced features

[![Discord.js](https://img.shields.io/badge/discord.js-v14.21.0-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-16.9.0+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Features

### 🛠️ Developer Tools
- **🎛️ Interactive Developer Panel**: Button-based bot management interface
- **⚡ Live Code Execution**: Execute JavaScript code directly in Discord
- **🔄 Hot Reload**: Reload commands/events without restarting the bot
- **🖤 Advanced Blacklist**: User blacklisting with reasons and history tracking
- **🔁 Try Again**: Re-execute previous code with one click

### 🏗️ Modular Architecture
- **📝 Multi-Command Support**: Slash, Prefix, and Context Menu commands
- **🎯 Event System**: Organized event management with automatic loading
- **⚙️ Function Loader**: Reusable modular functions
- **💾 Database Integration**: JSON-based easy data management
- **⏱️ Cooldown System**: Built-in command cooldown management

### 🔒 Security & Management
- **🛡️ User Blacklist**: Comprehensive blacklisting with timestamps and reasons
- **👮 Permission Control**: Role-based access control
- **🚨 Error Handling**: Robust error catching and logging
- **✅ Input Validation**: Secure input processing and validation

## 📂 Project Structure

```
example-bot/
├── 📁 src/
│   ├── 📁 commands/
│   │   ├── 📁 contextMenu/     # Right-click menu commands
│   │   ├── 📁 prefix/          # Traditional prefix commands
│   │   └── 📁 slash/           # Slash commands (/command)
│   ├── 📁 events/
│   │   ├── 📁 command/         # Command-related events
│   │   ├── 📁 developer/       # Developer panel events
│   │   └── 📄 ready.js         # Bot ready event
│   ├── 📁 functions/
│   │   ├── 📄 button.js        # Button utilities
│   │   ├── 📄 command.js       # Command utilities
│   │   ├── 📄 cooldown.js      # Cooldown management
│   │   ├── 📄 database.js      # Database initialization
│   │   ├── 📄 embed.js         # Embed utilities
│   │   ├── 📄 emoji.js         # Emoji management
│   │   ├── 📄 json.js          # JSON database class
│   │   ├── 📄 log.js           # Logging utilities
│   │   └── 📄 utils.js         # General utilities
│   ├── 📁 databases/
│   │   ├── 📄 bot.json         # Bot data (blacklist, etc.)
│   │   └── 📄 cooldown.json    # Cooldown data
│   └── 📁 helpers/
│       └── 📄 topgg.js         # Top.gg integration
├── 📁 starter/
│   ├── 📄 bot.js               # Bot initialization
│   └── 📁 loader/
│       ├── 📄 command.js       # Command loader
│       ├── 📄 event.js         # Event loader
│       └── 📄 function.js      # Function loader
├── 📄 config.js                # Bot configuration
├── 📄 main.js                  # Entry point
├── 📄 start.bat               # Windows startup script
└── 📄 .env                     # Environment variables
```

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js 16.9.0 or higher
- Discord Bot Token
- Basic Discord.js knowledge

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/discord-bot-framework.git
   cd discord-bot-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   BOT_TOKEN=your_discord_bot_token_here
   ```

4. **Start the bot**
   ```bash
   # Windows
   start.bat
   
   # or manually
   node main.js
   ```

## 🎮 Usage

### 🎛️ Developer Panel
The bot includes a comprehensive developer panel accessible through buttons:

- **🔧 Eval**: Execute JavaScript code with syntax highlighting
- **🖤 Blacklist**: Manage user blacklist with reasons and history
- **🔄 Restart**: Reload bot components without full restart
- **🔁 Try Again**: Re-execute previous code

## 🛠️ Advanced Features

### 🖤 Blacklist System
- ✅ Blacklist users with custom reasons
- ✅ Edit blacklist reasons with timestamp tracking
- ✅ Remove users from blacklist
- ✅ Full audit trail with user IDs and timestamps

### 🔄 Live Restart
- ✅ Reload commands without bot restart
- ✅ Reload events without bot restart
- ✅ Reload functions without bot restart
- ✅ Clear require cache for fresh code loading

### ⚡ Code Evaluation
- ✅ Execute JavaScript code in Discord
- ✅ Syntax highlighting for results
- ✅ Error handling and display
- ✅ Code history with "Try Again" functionality

## 📦 Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| discord.js | ^14.21.0 | Discord API wrapper |
| dotenv | ^17.2.0 | Environment variable management |
| chalk | ^5.4.1 | Terminal styling |
| axios | ^1.11.0 | HTTP client |
| lodash | ^4.17.21 | Utility library |
| ms | ^2.1.3 | Time parsing |
| sqlite3 | ^5.1.7 | SQLite database (optional) |

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Discord.js community for excellent documentation
- Contributors who helped improve this framework
- Everyone who uses and provides feedback

## 📞 Support

If you have any questions or need help:

- 🐛 Create an issue on GitHub
- 📚 Check the Discord.js documentation
- 💬 [Join the Discord.js community server](https://discord.gg/M88Yds6zTJ)

## 🔗 Links

- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Build powerful bots with Discord.js* 🚀

</div>