import { Env } from '../enums/env';
import { Config } from '../enums/config';

/**
 * Get the API endpoint URL based on environment
 */
export function getEndpoint(env: Env): string {
  return env === Env.PROD ? Config.ENDPOINTS.prod : Config.ENDPOINTS.sandbox;
}
