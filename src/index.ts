import { IApp } from './app'
import { container } from './container'
import { TYPES } from './types'
import { logger } from './logger'

process.on('uncaughtException', function (err) {
  if (err) {
    logger.error(`caughtException but no error msg${err.stack}`)
    process.exit(1)
  }
})

function bootstrap() {
  try {
    const app = container.get<IApp>(TYPES.IApp)
    app.main()
  } catch (error) {
    logger.error(error)
  }
}

bootstrap()
