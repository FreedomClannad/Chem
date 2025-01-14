import { PageContainer } from '@ant-design/pro-components';
import { Viewer } from 'chem3dview';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <Viewer />
    </PageContainer>
  );
};

export default HomePage;
