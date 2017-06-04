// {
//   id: 'xxxx',
//   name: 'F.A.N Report',
//   category: 'Apps for page',
//   logo_url: 'https://scontent.xx.fbcdn.net/v/t39.2081-0/p75x75/15730314_317368221991386_7858005536933937152_n.png?oh=afae53c882914fcec4ddd199fdb11bb0&oe=59E976EE'
// }
import store from 'react-native-simple-store';

const initialAuthState = [];

const fbapp = (state, action) => {
  let app;
  let newState;
  switch (action.type) {
    case 'ADD_FBAPP':
      app = {
        id: action.id,
        name: action.name,
        category: action.category,
        logo_url: action.logo_url,
      };
      store.get('APPS').then((apps) => {
        let tempApps = apps;
        if (!tempApps || !Array.isArray(tempApps)) {
          tempApps = [];
        }

        if (!tempApps.find(item => item.id === app.id)) {
          tempApps.push(app);
          store.save('APPS', tempApps);
        }
      });
      return app;
    case 'DELETE_FBAPP':
      newState = state.filter(item => item.id !== action.id);
      store.save('APPS', newState);
      return newState;
    default:
      return state;
  }
};

const fbapps = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'RECEIVE_FBAPP':
      return [
        ...action.fbapps,
      ];
    case 'ADD_FBAPP':
      return [
        ...state,
        fbapp(undefined, action),
      ];
    case 'DELETE_FBAPP':
      return fbapp(state, action);
    default:
      return state;
  }
};

export default fbapps;
