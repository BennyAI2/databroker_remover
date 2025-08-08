import { StartServer, createHandler, renderAsync } from 'solid-start/entry-server';

// Trigger database migrations at server startup. Importing this file has side effects
// that create tables if they do not exist. Without this import the database schema
// would not be initialised.
import '~/server/db/migrate';

export default createHandler(
  renderAsync(event => <StartServer event={event} />)
);
