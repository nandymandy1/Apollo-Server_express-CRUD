import {
    config
} from 'dotenv';

const {
    parsed
} = config();

export const {
    PORT,
    MODE,
    SECRET,
    BASE_URL,
    IN_PROD = MODE !== 'prod',
    URL = `${BASE_URL}${PORT}`,
    DB,
} = parsed