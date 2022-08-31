import { Snowflake } from '@sapphire/snowflake';

/**
 * Twitter's Snowflake algorithm implemented for this app.
 */
export default new (class SnoflakeUtil extends Snowflake {
    constructor() {
        super(1661784083620);
    }

    generate() {
        return String(super.generate());
    }
})();
