import { Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const createAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      type,
      title,
      message,
      category,
      location,
      sector,
      coordinates,
      severity,
      expires_at
    } = req.body;

    // Validate required fields
    if (!type || !title || !message || !category || !location || !severity) {
      return res.status(400).json({
        error: 'Missing required fields: type, title, message, category, location, severity'
      });
    }

    // Check if user is admin/authority
    if (!['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions to create alerts' });
    }

    // Create alert
    const { data: alert, error } = await supabase
      .from('alerts')
      .insert({
        type,
        title,
        message,
        category,
        location,
        sector: sector || null,
        coordinates: coordinates || null,
        severity,
        expires_at: expires_at || null,
        created_by: req.user!.id
      })
      .select()
      .single();

    if (error) {
      console.error('Create alert error:', error);
      return res.status(500).json({ error: 'Failed to create alert' });
    }

    res.status(201).json({
      message: 'Alert created successfully',
      alert
    });

  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAlerts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, category, location, sector, is_active = true, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('alerts')
      .select(`
        *,
        users!alerts_created_by_fkey (
          id,
          full_name,
          email,
          organization
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);
    if (location) query = query.ilike('location', `%${location}%`);
    if (sector) query = query.eq('sector', sector);
    if (is_active !== undefined) query = query.eq('is_active', is_active === 'true');

    // Apply pagination
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: alerts, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }

    res.json({
      alerts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActiveAlerts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { location, sector } = req.query;

    let query = supabase
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (location) query = query.ilike('location', `%${location}%`);
    if (sector) query = query.eq('sector', sector);

    const { data: alerts, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch active alerts' });
    }

    res.json({ alerts });

  } catch (error) {
    console.error('Get active alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: alert, error } = await supabase
      .from('alerts')
      .select(`
        *,
        users!alerts_created_by_fkey (
          id,
          full_name,
          email,
          organization
        )
      `)
      .eq('id', id)
      .single();

    if (error || !alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ alert });

  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user is admin/authority
    if (!['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions to update alerts' });
    }

    // Update alert
    const { data: alert, error } = await supabase
      .from('alerts')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      message: 'Alert updated successfully',
      alert
    });

  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deactivateAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is admin/authority
    if (!['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions to deactivate alerts' });
    }

    // Deactivate alert
    const { data: alert, error } = await supabase
      .from('alerts')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      message: 'Alert deactivated successfully',
      alert
    });

  } catch (error) {
    console.error('Deactivate alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const acknowledgeAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Acknowledge alert
    const { data: alert, error } = await supabase
      .from('alerts')
      .update({
        acknowledged_by: userId,
        acknowledged_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      message: 'Alert acknowledged successfully',
      alert
    });

  } catch (error) {
    console.error('Acknowledge alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserNotificationPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('notification_preferences')
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch notification preferences' });
    }

    res.json({
      preferences: profile?.notification_preferences || {
        sms: true,
        email: true,
        push: true,
        tsunami: true,
        cyclone: true,
        pollution: false,
        tidal: true
      }
    });

  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserNotificationPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ error: 'Notification preferences are required' });
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        notification_preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update notification preferences' });
    }

    res.json({
      message: 'Notification preferences updated successfully',
      preferences: profile.notification_preferences
    });

  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
