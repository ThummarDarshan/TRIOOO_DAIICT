import { Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const createIncidentReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      incident_type,
      incident_title,
      description,
      severity,
      location,
      coordinates,
      sector,
      nearest_landmark,
      date_time,
      weather_conditions,
      tide_level,
      wind_speed,
      affected_area,
      marine_life_impact,
      water_quality_impact,
      public_health_risk,
      immediate_actions,
      authorities_notified,
      emergency_services_called,
      reporter_name,
      reporter_phone,
      reporter_email,
      organization,
      relationship_to_incident,
      photos,
      videos,
      additional_notes,
      consent_to_contact,
      consent_to_share
    } = req.body;

    // Validate required fields
    if (!incident_type || !incident_title || !description || !severity || !location || !date_time) {
      return res.status(400).json({
        error: 'Missing required fields: incident_type, incident_title, description, severity, location, date_time'
      });
    }

    // Create incident report
    const { data: incident, error } = await supabase
      .from('incident_reports')
      .insert({
        reporter_id: userId,
        incident_type,
        incident_title,
        description,
        severity,
        location,
        coordinates: coordinates || null,
        sector: sector || null,
        nearest_landmark: nearest_landmark || null,
        date_time,
        weather_conditions: weather_conditions || null,
        tide_level: tide_level || null,
        wind_speed: wind_speed || null,
        affected_area: affected_area || null,
        marine_life_impact: marine_life_impact || null,
        water_quality_impact: water_quality_impact || null,
        public_health_risk: public_health_risk || false,
        immediate_actions: immediate_actions || null,
        authorities_notified: authorities_notified || false,
        emergency_services_called: emergency_services_called || false,
        reporter_name: reporter_name || req.user!.full_name,
        reporter_phone: reporter_phone || req.user!.phone,
        reporter_email: reporter_email || req.user!.email,
        organization: organization || req.user!.organization,
        relationship_to_incident: relationship_to_incident || null,
        photos: photos || [],
        videos: videos || [],
        additional_notes: additional_notes || null,
        consent_to_contact: consent_to_contact || false,
        consent_to_share: consent_to_share || false
      })
      .select()
      .single();

    if (error) {
      console.error('Create incident error:', error);
      return res.status(500).json({ error: 'Failed to create incident report' });
    }

    res.status(201).json({
      message: 'Incident report created successfully',
      incident
    });

  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIncidentReports = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, type, severity, location, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('incident_reports')
      .select(`
        *,
        users!incident_reports_reporter_id_fkey (
          id,
          full_name,
          email,
          organization,
          role
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) query = query.eq('status', status);
    if (type) query = query.eq('incident_type', type);
    if (severity) query = query.eq('severity', severity);
    if (location) query = query.ilike('location', `%${location}%`);

    // Apply pagination
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: incidents, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch incident reports' });
    }

    res.json({
      incidents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0
      }
    });

  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIncidentReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { data: incident, error } = await supabase
      .from('incident_reports')
      .select(`
        *,
        users!incident_reports_reporter_id_fkey (
          id,
          full_name,
          email,
          organization,
          role
        )
      `)
      .eq('id', id)
      .single();

    if (error || !incident) {
      return res.status(404).json({ error: 'Incident report not found' });
    }

    // Check if user can view this report
    if (incident.reporter_id !== userId && !['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ incident });

  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateIncidentReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    // Get current incident
    const { data: currentIncident, error: fetchError } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentIncident) {
      return res.status(404).json({ error: 'Incident report not found' });
    }

    // Check permissions
    if (currentIncident.reporter_id !== userId && !['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Regular users can only update pending reports
    if (currentIncident.reporter_id === userId && currentIncident.status !== 'pending') {
      return res.status(400).json({ error: 'Can only update pending reports' });
    }

    // Update incident
    const { data: updatedIncident, error } = await supabase
      .from('incident_reports')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update incident report' });
    }

    res.json({
      message: 'Incident report updated successfully',
      incident: updatedIncident
    });

  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyIncidentReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.user!.id;

    // Check if user is admin/authority
    if (!['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { data: incident, error } = await supabase
      .from('incident_reports')
      .update({
        status: 'verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !incident) {
      return res.status(404).json({ error: 'Incident report not found' });
    }

    res.json({
      message: 'Incident report verified successfully',
      incident
    });

  } catch (error) {
    console.error('Verify incident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resolveIncidentReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;
    const adminId = req.user!.id;

    // Check if user is admin/authority
    if (!['super_admin', 'admin', 'authority', 'operational'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { data: incident, error } = await supabase
      .from('incident_reports')
      .update({
        status: 'resolved',
        resolved_by: adminId,
        resolved_at: new Date().toISOString(),
        additional_notes: resolution_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !incident) {
      return res.status(404).json({ error: 'Incident report not found' });
    }

    res.json({
      message: 'Incident report resolved successfully',
      incident
    });

  } catch (error) {
    console.error('Resolve incident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
