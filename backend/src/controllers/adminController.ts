import { Response } from 'express';
import { supabaseAdmin, UserRole, UserStatus } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_profiles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPendingUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('status', UserStatus.PENDING)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch pending users' });
    }

    res.json({ users });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approveUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role, notes } = req.body;
    const adminId = req.user!.id;

    // Validate role assignment
    const allowedRoles = [UserRole.AUTHORITY, UserRole.CONTRIBUTOR, UserRole.OPERATIONAL];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role for approval',
        allowed: allowedRoles
      });
    }

    // Get user to approve
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== UserStatus.PENDING) {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    // Update user status and role
    const updateData: any = {
      status: UserStatus.APPROVED,
      approved_by: adminId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (role) {
      updateData.role = role;
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to approve user' });
    }

    // Log the approval action
    console.log(`User ${userId} approved by admin ${adminId} with role ${role || user.role}`);

    res.json({
      message: 'User approved successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const rejectUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;

    // Get user to reject
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== UserStatus.PENDING) {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    // Update user status
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        status: UserStatus.REJECTED,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to reject user' });
    }

    // Log the rejection
    console.log(`User ${userId} rejected by admin ${adminId}. Reason: ${reason}`);

    res.json({
      message: 'User rejected successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const suspendUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;

    // Get user to suspend
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === UserStatus.SUSPENDED) {
      return res.status(400).json({ error: 'User is already suspended' });
    }

    // Update user status
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        status: UserStatus.SUSPENDED,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to suspend user' });
    }

    // Log the suspension
    console.log(`User ${userId} suspended by admin ${adminId}. Reason: ${reason}`);

    res.json({
      message: 'User suspended successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reactivateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const adminId = req.user!.id;

    // Get user to reactivate
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== UserStatus.SUSPENDED) {
      return res.status(400).json({ error: 'User is not suspended' });
    }

    // Update user status
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        status: UserStatus.APPROVED,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to reactivate user' });
    }

    // Log the reactivation
    console.log(`User ${userId} reactivated by admin ${adminId}`);

    res.json({
      message: 'User reactivated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const adminId = req.user!.id;

    // Validate role
    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        valid: validRoles
      });
    }

    // Prevent changing super admin role
    if (role === UserRole.SUPER_ADMIN) {
      return res.status(403).json({ error: 'Cannot assign super admin role' });
    }

    // Get user to update
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    // Log the role change
    console.log(`User ${userId} role changed from ${user.role} to ${role} by admin ${adminId}`);

    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
