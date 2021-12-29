import 'reflect-metadata'

import { Container } from 'inversify'
import { TYPES } from './types'
import { CliWrapper } from './cli/cli.wrapper'
import { ActionHandler } from './actions/action.handler'
import { App } from './app'
import { GlobalStateContext } from './data/storage.provider'
import { TrelloConnector } from './api/trello.connector'

const container = new Container()

container.bind(TYPES.IApp).to(App).inSingletonScope()
container.bind(TYPES.ITrelloConnector).to(TrelloConnector).inSingletonScope()
container.bind(TYPES.ICliWrapper).to(CliWrapper).inSingletonScope()
container.bind(TYPES.IActionProvider).to(ActionHandler).inSingletonScope()
container.bind(TYPES.IStorageProvider).to(GlobalStateContext).inSingletonScope()

export { container }
