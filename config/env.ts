
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.ENV}` });

export const ENV = {
    TEST_ENV: process.env.TEST_ENV!,
    BASE_URL: process.env.BASE_URL!,
    TIMEOUTS: {
        DEFAULT: process.env.TIMEOUTS_DEFAULT!,
        SHORT: process.env.TIMEOUTS_SHORT!,
        LONG: process.env.TIMEOUTS_LONG!,
    },
    RETRIES: process.env.RETRIES!,
    HEADLESS: process.env.HEADLESS!,
    SLOWMO: process.env.SLOWMO!,
    VIEWPORT: {
        WIDTH: process.env.VIEWPORT_WIDTH!,
        HEIGHT: process.env.VIEWPORT_HEIGHT!,
    },
}

