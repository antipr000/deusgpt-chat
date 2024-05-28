import { JWTPayload, LOBE_CHAT_AUTH_HEADER } from '@/const/auth';
import { ModelProvider } from '@/libs/agent-runtime';
import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { useUserStore } from '@/store/user';
import { modelConfigSelectors, settingsSelectors } from '@/store/user/selectors';
import { createJWT } from '@/utils/jwt';

export const getProviderAuthPayload = (provider: string) => {
  switch (provider) {
    case ModelProvider.Bedrock: {
      const { accessKeyId, region, secretAccessKey } = modelConfigSelectors.bedrockConfig(
        useUserStore.getState(),
      );
      const awsSecretAccessKey = secretAccessKey;
      const awsAccessKeyId = accessKeyId;

      const apiKey = (awsSecretAccessKey || '') + (awsAccessKeyId || '');

      return { apiKey, awsAccessKeyId, awsRegion: region, awsSecretAccessKey };
    }

    case ModelProvider.Azure: {
      const azure = modelConfigSelectors.azureConfig(useUserStore.getState());

      return {
        apiKey: azure.apiKey,
        azureApiVersion: azure.apiVersion,
        endpoint: azure.endpoint,
      };
    }

    case ModelProvider.Ollama: {
      const config = modelConfigSelectors.ollamaConfig(useUserStore.getState());

      return { endpoint: config?.endpoint };
    }

    default: {
      const config = settingsSelectors.providerConfig(provider)(useUserStore.getState());

      return { apiKey: config?.apiKey, endpoint: config?.endpoint };
    }
  }
};

const createAuthTokenWithPayload = async (payload = {}) => {
  const accessCode = settingsSelectors.password(useUserStore.getState());

  return await createJWT<JWTPayload>({ accessCode, ...payload });
};

interface AuthParams {
  // eslint-disable-next-line no-undef
  headers?: HeadersInit;
  payload?: Record<string, any>;
  provider?: string;
}

// eslint-disable-next-line no-undef
export const createHeaderWithAuth = (params?: AuthParams): HeadersInit => {
  let payload = params?.payload || {};
  const idToken = store.get(idTokenAtom);

  // eslint-disable-next-line no-undef
  return { ...params?.headers, [LOBE_CHAT_AUTH_HEADER]: idToken!! };
};
