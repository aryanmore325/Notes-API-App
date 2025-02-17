/*
  # Update profiles table RLS policies

  1. Changes
    - Add INSERT policy for profiles table to allow new user registration
    - Keep existing policies for SELECT and UPDATE

  2. Security
    - Only allow users to insert their own profile
    - Maintain existing row-level security
*/

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);