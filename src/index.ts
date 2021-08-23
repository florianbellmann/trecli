import { CliHost } from './cli-host'

async function bootstrap() {
  const cliHost = new CliHost()
  await cliHost.init()
  await cliHost.loadList()
}

bootstrap()
