# FreeBoardGames.org

FOSS platform for publishing your [boardgame.io](https://boardgame.io) games. We curate high quality implementations of board games and optimize your game for delivery so you can quickly reach [thousands of players](https://stats.freeboardgames.org).

Play now at [FreeBoardGames.org](https://FreeBoardGames.org/)

## 🆕 Modernization (December 2024)

FreeBoardGames has been modernized to run on **Node.js 24** with current, maintained dependencies including:
- **Next.js 14** (from 9.5)
- **React 18** (from 16)
- **MUI v6** (from Material-UI v4)
- **NestJS 10** (from 8)
- **TypeScript 5.7** (from 4.x)

See [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) for complete details on changes and migration steps.

## Contributing

Check out [**our documentation**](https://www.freeboardgames.org/docs/) and [**how to add your game**](https://www.freeboardgames.org/docs/?path=/docs/documentation-getting-started-adding-a-new-game--page).

Contributions are always welcome, even if just reporting bugs (check our [issue tracker](https://github.com/freeboardgames/FreeBoardGames.org/issues)). Feel free to ask for any help!

## Community

<a href="https://discord.gg/AaE6n3n" target="_blank"><img src="https://discordapp.com/assets/fc0b01fe10a0b8c602fb0106d8189d9b.png" alt="Discord Logo" width="240" height="80" /></a>

## Running locally

### With Docker (Recommended)

```bash
git clone https://github.com/freeboardgames/FreeBoardGames.org
cd FreeBoardGames.org

docker-compose up --build  # Builds and starts all services
# Access at http://localhost:3000
```

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed Docker instructions including production deployment with SSL.

### Without Docker

```bash
git clone https://github.com/freeboardgames/FreeBoardGames.org
cd FreeBoardGames.org

yarn install  # installs dependencies

yarn run dev  # runs the webserver and backend (for online multiplayer games)
```

## Important commands

`yarn run dev GAME` runs the **development** environment only for a given game.

`yarn run test GAME` runs unit tests and linter for given game.

`yarn run lint GAME` runs linter for given game.

`yarn run fix GAME` tries to automatically fix linter errors for given game.

`yarn run ci` on root runs everything CI will run (including e2e tests).

Omitting the GAME from any command above will run it for all the codebase.

##  Thanks to

[**Our amazing contributors**](https://www.FreeBoardGames.org/about)

##  Sponsors
<a href="https://www.digitalocean.com/?refcode=af34c68fe9d9&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
  <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" width="201px">
</a>
