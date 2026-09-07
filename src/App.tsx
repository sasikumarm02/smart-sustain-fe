import './App.css';
import { GlobalRouter } from './Routes/GlobalRouter';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        components: {
          Tabs: {
            itemActiveColor: '#00338D !important',
            itemSelectedColor: '#00338D !important',
            horizontalItemGutter: 20,
            inkBarColor: '#00338D',
            padding: 10,
            fontFamily: 'Arial',
            fontSize: 18,
          },
        },
      }}
    >
      <GlobalRouter />
    </ConfigProvider>
  );
}

export default App;
