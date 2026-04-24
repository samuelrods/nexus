import { test, expect } from '@playwright/test';
import { ORG_SLUG, uniqueId } from './helpers/test-utils';

test.describe('Invitations', () => {
  test('complete journey: send and accept invitation', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    
    const uid = uniqueId('inv');
    const newUser = {
      username: `user_${uid}`,
      firstName: 'Invitee',
      lastName: 'Accept',
      email: `${uid}@invite.test`,
      password: 'password123',
    };

    // 1. Register a new user
    await page.goto('/register');
    await page.getByTestId('register-username').fill(newUser.username);
    await page.getByTestId('register-first-name').fill(newUser.firstName);
    await page.getByTestId('register-last-name').fill(newUser.lastName);
    await page.getByTestId('register-email').fill(newUser.email);
    await page.getByTestId('register-password').fill(newUser.password);
    await page.getByTestId('register-password-confirmation').fill(newUser.password);
    await page.getByTestId('register-submit').click();

    // After registration, user is logged in and on /organizations
    await page.waitForURL('/organizations');
    await expect(page.getByText('No organizations yet')).toBeVisible();

    // Logout to login as admin
    await page.getByTestId('logout-button').click();
    await page.waitForURL('/');
    await page.goto('/login');

    // 2. Login as admin and invite the new user
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();
    
    await page.waitForURL('/organizations');
    const enterBtn = page.getByTestId(`enter-org-${ORG_SLUG}`);
    if (await enterBtn.isEnabled()) {
      await enterBtn.click();
    }
    await page.waitForURL(`/${ORG_SLUG}/dashboard`);

    await page.goto(`/${ORG_SLUG}/members/create`);
    await page.getByTestId('invitation-member-info').fill(newUser.email);
    await page.getByTestId('invitation-submit').click();

    await expect(page.getByText(/Invitation sent successfully/i)).toBeVisible();

    // Logout admin
    await page.getByTestId('user-profile-button').click();
    await page.getByRole('menuitem', { name: /Sign out/i }).click();
    await page.waitForURL('/');
    await page.goto('/login');

    // 3. Login as new user and accept invitation
    await page.goto('/login');
    await page.getByTestId('login-email').fill(newUser.email);
    await page.getByTestId('login-password').fill(newUser.password);
    await page.getByTestId('login-submit').click();

    await page.waitForURL('/organizations');
    await expect(page.getByText('Pending Invitations')).toBeVisible();
    await expect(page.getByText('Nexus Corp')).toBeVisible();

    // Find the invitation and its ID to use the data-testid
    const acceptBtn = page.locator('button[data-testid^="invitation-accept-"]').first();
    await acceptBtn.click();

    await expect(page.getByText(/Invitation accepted successfully/i)).toBeVisible();
    await expect(page.getByTestId(`enter-org-${ORG_SLUG}`)).toBeVisible();

    // 4. Verify user can enter the organization
    await page.getByTestId(`enter-org-${ORG_SLUG}`).click();
    await page.waitForURL(`/${ORG_SLUG}/dashboard`);
    await expect(page.getByRole('heading', { name: 'Nexus Corp' })).toBeVisible();
    
    await context.close();
  });

  test('journey: send and decline invitation', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    const uid = uniqueId('dec');
    const newUser = {
      username: `dec_${uid}`,
      firstName: 'Invitee',
      lastName: 'Decline',
      email: `${uid}@decline.test`,
      password: 'password123',
    };

    // 1. Register a new user
    await page.goto('/register');
    await page.getByTestId('register-username').fill(newUser.username);
    await page.getByTestId('register-first-name').fill(newUser.firstName);
    await page.getByTestId('register-last-name').fill(newUser.lastName);
    await page.getByTestId('register-email').fill(newUser.email);
    await page.getByTestId('register-password').fill(newUser.password);
    await page.getByTestId('register-password-confirmation').fill(newUser.password);
    await page.getByTestId('register-submit').click();

    // Logout
    await page.waitForURL('/organizations');
    await page.getByTestId('logout-button').click();
    await page.waitForURL('/');
    await page.goto('/login');

    // 2. Login as admin and invite
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/organizations');
    const enterBtn = page.getByTestId(`enter-org-${ORG_SLUG}`);
    if (await enterBtn.isEnabled()) {
      await enterBtn.click();
    }
    await page.waitForURL(`/${ORG_SLUG}/dashboard`);

    await page.goto(`/${ORG_SLUG}/members/create`);
    await page.getByTestId('invitation-member-info').fill(newUser.email);
    await page.getByTestId('invitation-submit').click();
    await expect(page.getByText(/Invitation sent successfully/i)).toBeVisible();

    // Logout admin
    await page.getByTestId('user-profile-button').click();
    await page.getByRole('menuitem', { name: /Sign out/i }).click();
    await page.waitForURL('/');
    await page.goto('/login');

    // 3. Login as new user and decline
    await page.getByTestId('login-email').fill(newUser.email);
    await page.getByTestId('login-password').fill(newUser.password);
    await page.getByTestId('login-submit').click();

    await page.waitForURL('/organizations');
    const declineBtn = page.locator('button[data-testid^="invitation-decline-"]').first();
    await declineBtn.click();

    await expect(page.getByText(/Invitation declined successfully/i)).toBeVisible();
    await expect(page.getByText('Pending Invitations')).not.toBeVisible();
    
    await context.close();
  });

  test.describe.serial('Validation', () => {
    test('user does not exist', async ({ page }) => {
      await page.goto('/organizations');
      const enterBtn = page.getByTestId(`enter-org-${ORG_SLUG}`);
      if (await enterBtn.isEnabled()) {
        await enterBtn.click();
      }
      
      await page.goto(`/${ORG_SLUG}/members/create`);
      await page.getByTestId('invitation-member-info').fill('truly-non-existent-user-12345@example.com');
      await page.getByTestId('invitation-submit').click();

      // Wait for the error message to appear
      await expect(page.getByTestId('input-error')).toBeVisible();
      await expect(page.getByTestId('input-error')).toContainText(/does not exist/i);
    });

    test('user already member', async ({ page }) => {
      await page.goto('/organizations');
      const enterBtn = page.getByTestId(`enter-org-${ORG_SLUG}`);
      if (await enterBtn.isEnabled()) {
        await enterBtn.click();
      }

      await page.goto(`/${ORG_SLUG}/members/create`);
      // admin is already a member (using username this time)
      await page.getByTestId('invitation-member-info').fill('admin');
      await page.getByTestId('invitation-submit').click();

      // Wait for the error message to appear
      await expect(page.getByTestId('input-error')).toBeVisible();
      await expect(page.getByTestId('input-error')).toContainText(/already a member/i);
    });
  });
});
