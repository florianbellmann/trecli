import { IApp } from './app'
import { container } from './container'
import { TYPES } from './types'

function bootstrap() {
  try {
    const app = container.get<IApp>(TYPES.IApp)
    app.main()
  } catch (error) {
    console.error(error)
  }
}

bootstrap()
