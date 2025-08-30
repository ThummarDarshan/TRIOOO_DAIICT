import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { supabase, supabaseAdmin, UserRole, UserStatus } from '../config/supabase';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      full_name,
      organization,
      role,
      phone,
      location
    } = req.body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        error: 'Missing required fields: email, password, full_name, role'
      });
    }

    // Validate role selection
    const allowedSignupRoles = [UserRole.FISHERFOLK, UserRole.CONTRIBUTOR];
    if (!allowedSignupRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role for self-registration',
        allowed: allowedSignupRoles
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Determine initial status based on role
    let initialStatus = UserStatus.PENDING;
    if (role === UserRole.FISHERFOLK) {
      initialStatus = UserStatus.APPROVED; // Fisherfolk get auto-approved
    }

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: {
        data: {
          full_name,
          role,
          status: initialStatus
        }
      }
    });

    if (authError || !authUser.user) {
      return res.status(400).json({ error: authError?.message || 'Registration failed' });
    }

    // Create user profile in database
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        organization: organization || null,
        role,
        status: initialStatus,
        phone: phone || null,
        location: location || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return res.status(500).json({ error: 'Profile creation failed' });
    }

    // Create user profile details
    await supabase
      .from('user_profiles')
      .insert({
        user_id: authUser.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        full_name: userProfile.full_name,
        role: userProfile.role,
        status: userProfile.status
      },
      requiresApproval: initialStatus === UserStatus.PENDING
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is approved
    if (user.status !== UserStatus.APPROVED) {
      return res.status(403).json({
        error: 'Account not approved',
        status: user.status,
        message: user.status === UserStatus.PENDING 
          ? 'Your account is pending approval from an administrator'
          : 'Your account has been rejected or suspended'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwtOptions: SignOptions = { 
      expiresIn: (process.env.JWT_EXPIRES_IN as string) || '24h' 
    };
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        status: user.status
      },
      process.env.JWT_SECRET || 'fallback-secret',
      jwtOptions
    );
    // import jwt, { StringValue, SignOptions } from "jsonwebtoken";
    //  const generateToken = (user: any) => {
    //     const options: SignOptions = {
    //       expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || "24h",
    //     };
      
    //     return jwt.sign(
    //       { id: user.id, role: user.role },
    //       process.env.JWT_SECRET as string,
    //       options
    //     );
    //   };


    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status,
        organization: user.organization
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        organization: user.organization,
        role: user.role,
        status: user.status,
        phone: user.phone,
        location: user.location,
        created_at: user.created_at,
        profile: user.user_profiles?.[0] || null
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { full_name, organization, phone, location, bio, expertise, emergency_contact } = req.body;

    // Update user table
    const { data: updatedUser, error: userError } = await supabase
      .from('users')
      .update({
        full_name: full_name || req.user.full_name,
        organization: organization || req.user.organization,
        phone: phone || req.user.phone,
        location: location || req.user.location,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (userError) {
      return res.status(500).json({ error: 'Failed to update user profile' });
    }

    // Update user_profiles table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        bio: bio || null,
        expertise: expertise || null,
        emergency_contact: emergency_contact || null,
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
