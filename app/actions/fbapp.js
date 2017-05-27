import store from 'react-native-simple-store';

export const addFbapp = fbapp => ({
  type: 'ADD_FBAPP',
  ...fbapp,
});

export const deleteFbapp = id => ({
  type: 'DELETE_FBAPP',
  id,
});

export const receiveFbapps = fbapps => ({
  type: 'RECEIVE_FBAPP',
  fbapps,
});

export function fetchFbapps() {
  console.log('fetchFbapps');
  return function dp(dispatch) {
    return store.get('APPS').then((apps) => {
      let tempApps = apps;
      if (!tempApps || !Array.isArray(tempApps)) {
        tempApps = [];
      }
      console.log('tempApps', tempApps);
      dispatch(receiveFbapps(tempApps));
    })
    .catch(err => console.log(err));
  };
}
