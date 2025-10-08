-- =====================================================
-- AUTH0 MIGRATION SCRIPT
-- Updates database schema to work with Auth0 authentication
-- =====================================================

-- Drop password_hash column since Auth0 handles authentication
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Add Auth0 specific columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth0_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'auth0';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Update users table to make email verification more flexible
ALTER TABLE users ALTER COLUMN is_verified SET DEFAULT TRUE;

-- Create index for Auth0 ID lookups
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- Update RLS policies to work with Auth0
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create new RLS policies for Auth0
CREATE POLICY "Users can view their own profile" ON users 
  FOR SELECT 
  USING (auth0_id = current_setting('app.current_user_auth0_id', true));

CREATE POLICY "Users can update their own profile" ON users 
  FOR UPDATE 
  USING (auth0_id = current_setting('app.current_user_auth0_id', true));

-- Function to get or create user from Auth0
CREATE OR REPLACE FUNCTION get_or_create_auth0_user(
  p_auth0_id VARCHAR(255),
  p_email VARCHAR(255),
  p_first_name VARCHAR(100),
  p_last_name VARCHAR(100),
  p_role VARCHAR(20),
  p_profile_image_url TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  email VARCHAR(255),
  role VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  is_verified BOOLEAN,
  is_active BOOLEAN
) AS $$
BEGIN
  -- Try to find existing user by Auth0 ID
  RETURN QUERY
  SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.profile_image_url, u.is_verified, u.is_active
  FROM users u
  WHERE u.auth0_id = p_auth0_id;
  
  -- If user doesn't exist, create new user
  IF NOT FOUND THEN
    RETURN QUERY
    INSERT INTO users (auth0_id, email, first_name, last_name, role, profile_image_url, is_verified, is_active, last_login)
    VALUES (p_auth0_id, p_email, p_first_name, p_last_name, p_role, p_profile_image_url, TRUE, TRUE, NOW())
    RETURNING users.id, users.email, users.role, users.first_name, users.last_name, users.profile_image_url, users.is_verified, users.is_active;
  ELSE
    -- Update last login time
    UPDATE users SET last_login = NOW() WHERE auth0_id = p_auth0_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing admin user with Auth0 ID (for testing)
UPDATE users 
SET auth0_id = 'auth0|admin-test-id', 
    auth_provider = 'auth0',
    is_verified = TRUE
WHERE email = 'admin@dentalplatform.com';

-- Add comments
COMMENT ON COLUMN users.auth0_id IS 'Auth0 user identifier (sub claim from JWT)';
COMMENT ON COLUMN users.auth_provider IS 'Authentication provider (auth0, google-oauth2, facebook, etc.)';
COMMENT ON COLUMN users.last_login IS 'Timestamp of last successful login';
COMMENT ON FUNCTION get_or_create_auth0_user IS 'Gets existing user or creates new user from Auth0 authentication';

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- This script:
-- ✅ Removes password_hash column (Auth0 handles authentication)
-- ✅ Adds Auth0 ID and provider tracking
-- ✅ Updates RLS policies for Auth0 integration
-- ✅ Creates helper function for user management
-- ✅ Maintains all existing relationships and data
