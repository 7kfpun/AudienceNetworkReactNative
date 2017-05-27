import * as actions from './fbapp';

describe('Fbapp actions', () => {
  it('.addFbapp should create ADD_FBAPP action', () => {
    expect(actions.addFbapp({ a: 1, b: 2 })).toEqual({
      type: 'ADD_FBAPP',
      a: 1,
      b: 2,
    });
  });

  it('.deleteFbapp should create DELETE_FBAPP action', () => {
    expect(actions.deleteFbapp('id11111111')).toEqual({
      type: 'DELETE_FBAPP',
      id: 'id11111111',
    });
  });

  it('.receiveFbapps should create RECEIVE_FBAPP action', () => {
    expect(actions.receiveFbapps([{ a: 1, b: 2 }])).toEqual({
      type: 'RECEIVE_FBAPP',
      fbapps: [{ a: 1, b: 2 }],
    });
  });
});
