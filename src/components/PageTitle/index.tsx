import { memo, useEffect } from 'react';

const PageTitle = memo<{ title: string }>(({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} · DeusGPT Chat` : 'DeusGPT Chat';
  }, [title]);

  return null;
});

export default PageTitle;
