import { Avatar } from '@lobehub/ui';
import { FC } from 'react';
import { Flexbox } from 'react-layout-kit';

import { FormAction } from '@/features/Conversation/Error/style';

interface WeatherMessageProps {
  content: Record<string, any>;
}

const WeatherMessage: FC<WeatherMessageProps> = ({ content }) => {
  const openURL = () => {
    window.parent.postMessage({ payload: content.infoLink, type: 'open-url' }, '*');
  };

  return (
    <FormAction
      avatar={
        <Avatar avatar="https://openai-collections.chat-plugin.lobehub.com/weather-gpt/logo.webp" />
      }
      description=""
      title="WeatherGPT"
    >
      <Flexbox style={{ width: 300 }}>
        <Flexbox align="center">
          <Flexbox>Location</Flexbox>
          <Flexbox style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {content.location?.name}, {content.location?.region}
          </Flexbox>
        </Flexbox>
        <Flexbox align="center" style={{ marginTop: 10 }}>
          <Flexbox>Temperature</Flexbox>
          <Flexbox style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {content.current?.temp_c}°C / {content.current?.temp_f}°F
          </Flexbox>
        </Flexbox>
        <a onClick={openURL} style={{ marginTop: 20, textAlign: 'center' }}>
          Visit this link for more details
        </a>
      </Flexbox>
    </FormAction>
  );
};

export default WeatherMessage;
