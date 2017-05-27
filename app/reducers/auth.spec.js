import auth from './auth';


describe('auth reducer', () => {
  it('should handle Login', () => {
    expect(
      auth({ isLoggedIn: false }, { type: 'Login' }),
    ).toEqual(
      { isLoggedIn: true },
    );

    expect(
      auth({ isLoggedIn: true }, { type: 'Login' }),
    ).toEqual(
      { isLoggedIn: true },
    );
  });

  it('should handle Logout', () => {
    expect(
      auth({ isLoggedIn: false }, { type: 'Logout' }),
    ).toEqual(
      { isLoggedIn: false },
    );

    expect(
      auth({ isLoggedIn: true }, { type: 'Logout' }),
    ).toEqual(
      { isLoggedIn: false },
    );
  });
});
