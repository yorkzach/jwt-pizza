import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('about page', async ({ page }) => {
    await page.goto('http://localhost:5173/');


    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByText('The secret sauce')).toBeVisible();
  });

test('History page', async ({ page }) => {
    await page.goto('http://localhost:5173/');


    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
});

test('not found page', async ({ page }) => {
    await page.goto('http://localhost:5173/notfound');


    await expect(page.getByText('It looks like we have dropped')).toBeVisible();
});

test('purchase with login', async ({ page }) => {
    await page.route('*/**/api/order/menu', async (route) => {
      const menuRes = [
        { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
        { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: menuRes });
    });
  
    await page.route('*/**/api/franchise', async (route) => {
      const franchiseRes = [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    });
  
    await page.route('*/**/api/auth', async (route) => {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    });
  
    await page.route('*/**/api/order', async (route) => {
      const orderReq = {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
      };
      const orderRes = {
        order: {
          items: [
            { menuId: 1, description: 'Veggie', price: 0.0038 },
            { menuId: 2, description: 'Pepperoni', price: 0.0042 },
          ],
          storeId: '4',
          franchiseId: 2,
          id: 23,
        },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(orderReq);
      await route.fulfill({ json: orderRes });
    });
  
    await page.goto('/');
  
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();
  
    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();
  
    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();
  
    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
  });

  test('diner dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'pd' }).click();
    await expect(page.getByText('Your pizza kitchen')).toBeVisible();
    });

  test('login with incorrect credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('fake@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('unknown user').isVisible();
  });

  test('logout', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});

    test('register', async ({ page }) => {
      await page.goto('http://localhost:5173/');

      await page.getByRole('link', { name: 'Register' }).click();

      await page.getByRole('textbox', { name: 'Full name' }).click();
      await page.getByRole('textbox', { name: 'Full name' }).fill('a');
      await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('a');
      await page.getByRole('button', { name: 'Register' }).click();
      
      await page.getByText('The web\'s best pizza', { exact: true }).click();

    });

    test('admin login', async ({ page }) => {
      await page.goto('http://localhost:5173/');

      await page.getByRole('link', { name: 'Login' }).click();
      await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
      await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
      await page.getByRole('textbox', { name: 'Password' }).fill('admin');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.getByRole('link', { name: 'Admin' }).click();
      await page.getByText('Mama Ricci\'s kitchen').click();
        
        await page.getByRole('button', { name: 'Add Franchise' }).click();
        await page.getByRole('textbox', { name: 'franchise name' }).click();
        await page.getByRole('textbox', { name: 'franchise name' }).fill('BYU');
        await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
        await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByRole('cell', { name: 'BYU' })).toBeVisible();

        
        await page.getByRole('row', { name: 'BYU 常用名字 Close' }).getByRole('button').click();
        await expect(page.getByText('Sorry to see you go')).toBeVisible();
        await page.getByRole('button', { name: 'Close' }).click();
        await expect(page.getByRole('cell', { name: 'BYU' })).not.toBeVisible();
    });

test('admin add franchisee', async ({ page }) => {
    await page.goto('http://localhost:5173/');


    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();

    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('SLC');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('cell', { name: 'SLC' })).toBeVisible();
    
});

test('create/delete store', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('So you want a piece of the')).toBeVisible();
    await page.getByRole('link', { name: 'login', exact: true }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('SLC')).toBeVisible();

    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('BYU');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('cell', { name: 'BYU' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Sorry to see you go')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('cell', { name: 'BYU'})).not.toBeVisible();
});