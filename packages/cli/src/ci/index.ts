import githubProvider from './providers/github';
import { CIProvider, RequiredCIVariables } from './types';

const CI_PROVIDERS = [githubProvider];

export function getCiVariables(ciProviders: CIProvider[] = CI_PROVIDERS): RequiredCIVariables {
  ciProviders.forEach(provider => {
    const variables = provider(process.env);
    if (variables) {
      return variables;
    }
  });

  throw new Error(`Unrecognized CI Provider.
  
  You can read about the configuration options here:
  https://github.com/Meemaw/bundlecheck#configuration`);
}
