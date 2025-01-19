import { displayUsers } from '../src/index';

describe('displayUsers', () => {
  it('should log user details', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const users = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];

    displayUsers(users);

    expect(consoleSpy).toHaveBeenCalledWith('ID: 1, Name: Alice, Email: alice@example.com');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 2, Name: Bob, Email: bob@example.com');

    consoleSpy.mockRestore();
  });
});
