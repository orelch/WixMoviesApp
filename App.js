import { Provider } from 'react-redux';
import { store } from './store/store';

import Main from './screens/Main';

export default function App() {


    return (
        // React-Redux wrapper to distribute the redux store to all components in the app
        <Provider store={store} >
            <Main />
        </Provider>
  );
}