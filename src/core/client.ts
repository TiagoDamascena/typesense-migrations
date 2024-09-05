import { Client } from 'typesense';
import config from '../core/config';

const client = new Client(config.client);

export default client;