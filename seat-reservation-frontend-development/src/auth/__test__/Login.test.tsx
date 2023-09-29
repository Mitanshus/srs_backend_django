import { render } from '@testing-library/react';
import Login from '../Login'
test('Renders main page correctly', () => {
    render(<Login />)
    expect(true).toBeTruthy();
  });