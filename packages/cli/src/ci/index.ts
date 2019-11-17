import githubProvider from './providers/github';
import { CIProvider, RequiredCIVariables } from './types';

const CI_PROVIDERS = [githubProvider];

export function isCI(ciProviders: CIProvider[] = CI_PROVIDERS): boolean {
  return Boolean(process.env.CI) || ciProviders.some(provider => provider.detect(process.env));
}

export function getCiVariables(ciProviders: CIProvider[] = CI_PROVIDERS): RequiredCIVariables {
  const provider = ciProviders.find(provider => provider.detect(process.env));

  if (!provider) {
    throw new Error(`Unrecognized CI Provider.
  
  You can read about the configuration options here:
  https://github.com/Meemaw/bundlecheck#configuration`);
  }

  return provider.configuration(process.env);
}