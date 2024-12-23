import * as f from './user.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabaseClient';

const testUser = {
  name: 'User Test',
  nip: 8126387,
  pass: 'userpass',
  role: 'student',
  organization_id: 1
};

let userId;

describe('User API Tests', () => {
  beforeAll(async () => {
    // Intenta eliminar el usuario de prueba si existe
    await supabase
      .from('users')
      .delete()
      .eq('nip', testUser.nip)
      .eq('organization_id', testUser.organization_id);

    const result = await f.registerUser(testUser.name, testUser.nip, testUser.pass, testUser.role, testUser.organization_id);
    expect(result.error).toBeNull();

    const userIdResult = await f.getUserIdByNIP(testUser.nip, testUser.organization_id);
    expect(userIdResult.error).toBeNull();
    userId = userIdResult.data;
    expect(userId).not.toBeNull();
  });

  it('should register a new user', async () => {
    const result = await f.registerUser('User Test 2', 111111110, 'password2', 'student', 1);
    expect(result.error).toBeNull();

    const localUserIdResult = await f.getUserIdByNIP(111111110, 1);
    expect(localUserIdResult.error).toBeNull();
    const localUserId = localUserIdResult.data;
    expect(localUserId).not.toBeNull();

    await supabase
      .from('users')
      .delete()
      .eq('nip', 111111110)
      .eq('organization_id', 1);
  });

  it('should login user successfully', async () => {
    const result = await f.loginUser(testUser.nip, testUser.pass, testUser.role, testUser.organization_id);
    expect(result.error).toBeNull();
    expect(result.data).toBe(true);
  });

  it('should get user info by ID', async () => {
    const result = await f.getUserInfoById(userId);
    expect(result.error).toBeNull();
    expect(result.data.nip).toBe(testUser.nip);
  });

  afterAll(async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', testUser.nip)
      .eq('organization_id', testUser.organization_id);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 111111110)
      .eq('organization_id', 1);
  });
});
