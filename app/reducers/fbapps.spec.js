import fbapps from './fbapps';

describe('fbapps reducer', () => {
  it('should handle RECEIVE_FBAPP', () => {
    expect(
      fbapps([], {
        type: 'RECEIVE_FBAPP',
        fbapps: [{
          id: 0,
          name: 'Run the tests',
          category: 'Life Style',
          logo_url: 'https://image.url',
        }],
      }),
    ).toEqual([{
      id: 0,
      name: 'Run the tests',
      category: 'Life Style',
      logo_url: 'https://image.url',
    }]);

    expect(
      fbapps([], {
        type: 'RECEIVE_FBAPP',
        fbapps: [{
          id: 0,
          name: 'Run the tests',
          category: 'Life Style',
          logo_url: 'https://image.url',
        }, {
          id: 1,
          name: 'Run the tests',
          category: 'Life Style',
          logo_url: 'https://image.url',
        }],
      }),
    ).toEqual([
      {
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }, {
        id: 1,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      },
    ]);
  });

  it('should handle ADD_TODO', () => {
    expect(
      fbapps([], {
        type: 'ADD_FBAPP',
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }),
    ).toEqual([
      {
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      },
    ]);

    expect(
      fbapps([{
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }], {
        type: 'ADD_FBAPP',
        id: 1,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }),
    ).toEqual([
      {
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }, {
        id: 1,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      },
    ]);
  });

  it('should handle DELETE_FBAPP', () => {
    expect(
      fbapps([{
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }], {
        type: 'DELETE_FBAPP',
        id: 0,
      }),
    ).toEqual([]);

    expect(
      fbapps([{
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }, {
        id: 1,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      }], {
        type: 'DELETE_FBAPP',
        id: 1,
      }),
    ).toEqual([
      {
        id: 0,
        name: 'Run the tests',
        category: 'Life Style',
        logo_url: 'https://image.url',
      },
    ]);
  });
});
