import { main } from './app'

function bootstrap() {
  try {
    main()
  } catch (error) {
    console.error(error)
  }
}

bootstrap()
