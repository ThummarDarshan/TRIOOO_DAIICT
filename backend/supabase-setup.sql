-- Supabase Database Setup Script for Coastal Monitoring System
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create custom types for enums
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin', 
  'authority',
  'contributor',
  'operational',
  'fisherfolk'
);

CREATE TYPE user_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

CREATE TYPE incident_type AS ENUM (
  'oil-spill',
  'water-pollution',
  'dead-marine-life',
  'unusual-tides',
  'coastal-erosion',
  'algal-bloom',
  'marine-debris',
  'vessel-incident',
  'sewage-discharge',
  'chemical-release',
  'other'
);

CREATE TYPE incident_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE incident_status AS ENUM (
  'pending',
  'verified',
  'investigating',
  'resolved'
);

CREATE TYPE alert_type AS ENUM (
  'safe',
  'advisory',
  'warning',
  'emergency'
);

CREATE TYPE alert_category AS ENUM (
  'tsunami',
  'cyclone',
  'tidal',
  'weather',
  'environmental',
  'pollution',
  'marine-life',
  'other'
);

CREATE TYPE sensor_type AS ENUM (
  'tide_gauge',
  'weather_station',
  'water_quality',
  'wave_buoy',
  'current_meter',
  'ph_sensor',
  'oxygen_sensor',
  'turbidity_sensor'
);

CREATE TYPE sensor_status AS ENUM (
  'active',
  'inactive',
  'maintenance',
  'error',
  'offline'
);

CREATE TYPE prediction_parameter AS ENUM (
  'sst',
  'seaLevel',
  'chlorophyll',
  'wind',
  'tide',
  'current',
  'temperature',
  'salinity'
);

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT,
  role user_role NOT NULL DEFAULT 'fisherfolk',
  status user_status NOT NULL DEFAULT 'pending',
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  expertise TEXT[],
  certifications TEXT[],
  emergency_contact TEXT,
  notification_preferences JSONB DEFAULT '{"sms": true, "email": true, "push": true, "tsunami": true, "cyclone": true, "pollution": false, "tidal": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incident_reports table
CREATE TABLE public.incident_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Basic Information
  incident_type incident_type NOT NULL,
  incident_title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity incident_severity NOT NULL,
  status incident_status DEFAULT 'pending',
  
  -- Location Details
  location TEXT NOT NULL,
  coordinates TEXT,
  sector TEXT,
  nearest_landmark TEXT,
  
  -- Incident Details
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  weather_conditions TEXT,
  tide_level TEXT,
  wind_speed TEXT,
  
  -- Environmental Impact
  affected_area TEXT,
  marine_life_impact TEXT,
  water_quality_impact TEXT,
  public_health_risk BOOLEAN DEFAULT FALSE,
  
  -- Response Actions
  immediate_actions TEXT,
  authorities_notified BOOLEAN DEFAULT FALSE,
  emergency_services_called BOOLEAN DEFAULT FALSE,
  
  -- Reporter Information
  reporter_name TEXT,
  reporter_phone TEXT,
  reporter_email TEXT,
  organization TEXT,
  relationship_to_incident TEXT,
  
  -- Evidence & Documentation
  photos TEXT[], -- Array of photo URLs
  videos TEXT[], -- Array of video URLs
  additional_notes TEXT,
  
  -- Privacy & Consent
  consent_to_contact BOOLEAN DEFAULT FALSE,
  consent_to_share BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type alert_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category alert_category NOT NULL,
  location TEXT NOT NULL,
  sector TEXT,
  coordinates TEXT,
  
  -- Alert Details
  severity incident_severity NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  acknowledged_by UUID REFERENCES public.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Create sensors table
CREATE TABLE public.sensors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type sensor_type NOT NULL,
  location TEXT NOT NULL,
  coordinates TEXT,
  sector TEXT,
  status sensor_status DEFAULT 'active',
  
  -- Sensor Details
  manufacturer TEXT,
  model TEXT,
  installation_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  
  -- Configuration
  unit TEXT,
  range_min NUMERIC,
  range_max NUMERIC,
  accuracy NUMERIC,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

-- Create sensor_readings table
CREATE TABLE public.sensor_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE CASCADE NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status sensor_status DEFAULT 'active',
  
  -- Additional Data
  quality_score NUMERIC,
  flags TEXT[],
  metadata JSONB
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parameter prediction_parameter NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 100),
  
  -- Prediction Details
  prediction_horizon_hours INTEGER NOT NULL,
  prediction_type TEXT DEFAULT 'forecast',
  model_version TEXT,
  
  -- Location
  location TEXT,
  coordinates TEXT,
  sector TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.users(id)
);

-- Create prediction_models table
CREATE TABLE public.prediction_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  parameter prediction_parameter NOT NULL,
  
  -- Model Details
  description TEXT,
  accuracy NUMERIC,
  training_data_size INTEGER,
  last_trained TIMESTAMP WITH TIME ZONE,
  
  -- Configuration
  hyperparameters JSONB,
  features TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create risk_assessments table
CREATE TABLE public.risk_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  sector TEXT,
  coordinates TEXT,
  
  -- Risk Details
  risk_type TEXT NOT NULL,
  risk_level incident_severity NOT NULL,
  probability NUMERIC CHECK (probability >= 0 AND probability <= 1),
  impact_score NUMERIC CHECK (impact_score >= 0 AND impact_score <= 10),
  
  -- Assessment Details
  factors TEXT[],
  mitigation_strategies TEXT[],
  recommendations TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.users(id),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create notification_logs table
CREATE TABLE public.notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
  
  -- Notification Details
  type TEXT NOT NULL, -- 'sms', 'email', 'push'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  delivery_attempts INTEGER DEFAULT 1,
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_organization ON public.users(organization);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

CREATE INDEX idx_incident_reports_reporter_id ON public.incident_reports(reporter_id);
CREATE INDEX idx_incident_reports_type ON public.incident_reports(incident_type);
CREATE INDEX idx_incident_reports_severity ON public.incident_reports(severity);
CREATE INDEX idx_incident_reports_status ON public.incident_reports(status);
CREATE INDEX idx_incident_reports_location ON public.incident_reports(location);
CREATE INDEX idx_incident_reports_date_time ON public.incident_reports(date_time);

CREATE INDEX idx_alerts_type ON public.alerts(type);
CREATE INDEX idx_alerts_category ON public.alerts(category);
CREATE INDEX idx_alerts_location ON public.alerts(location);
CREATE INDEX idx_alerts_is_active ON public.alerts(is_active);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);

CREATE INDEX idx_sensors_type ON public.sensors(type);
CREATE INDEX idx_sensors_location ON public.sensors(location);
CREATE INDEX idx_sensors_status ON public.sensors(status);

CREATE INDEX idx_sensor_readings_sensor_id ON public.sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp);

CREATE INDEX idx_predictions_parameter ON public.predictions(parameter);
CREATE INDEX idx_predictions_location ON public.predictions(location);
CREATE INDEX idx_predictions_valid_from ON public.predictions(valid_from);

CREATE INDEX idx_risk_assessments_location ON public.risk_assessments(location);
CREATE INDEX idx_risk_assessments_risk_type ON public.risk_assessments(risk_type);
CREATE INDEX idx_risk_assessments_risk_level ON public.risk_assessments(risk_level);

-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Create RLS policies for user_profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile details" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile details" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile details" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profile details" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Create RLS policies for incident_reports table
-- Users can view their own reports
CREATE POLICY "Users can view own incident reports" ON public.incident_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Users can create incident reports
CREATE POLICY "Users can create incident reports" ON public.incident_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can update their own reports (if pending)
CREATE POLICY "Users can update own pending reports" ON public.incident_reports
  FOR UPDATE USING (auth.uid() = reporter_id AND status = 'pending')
  WITH CHECK (auth.uid() = reporter_id AND status = 'pending');

-- Admins and authorities can view all reports
CREATE POLICY "Admins can view all incident reports" ON public.incident_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Admins and authorities can update all reports
CREATE POLICY "Admins can update all incident reports" ON public.incident_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Create RLS policies for alerts table
-- All authenticated users can view active alerts
CREATE POLICY "Users can view active alerts" ON public.alerts
  FOR SELECT USING (is_active = true);

-- Admins and authorities can create alerts
CREATE POLICY "Admins can create alerts" ON public.alerts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Admins and authorities can update alerts
CREATE POLICY "Admins can update alerts" ON public.alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Create RLS policies for sensors table
-- All authenticated users can view sensors
CREATE POLICY "Users can view sensors" ON public.sensors
  FOR SELECT USING (true);

-- Admins and authorities can manage sensors
CREATE POLICY "Admins can manage sensors" ON public.sensors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Create RLS policies for sensor_readings table
-- All authenticated users can view sensor readings
CREATE POLICY "Users can view sensor readings" ON public.sensor_readings
  FOR SELECT USING (true);

-- Admins and authorities can insert sensor readings
CREATE POLICY "Admins can insert sensor readings" ON public.sensor_readings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Create RLS policies for predictions table
-- All authenticated users can view predictions
CREATE POLICY "Users can view predictions" ON public.predictions
  FOR SELECT USING (true);

-- Admins and authorities can create predictions
CREATE POLICY "Admins can create predictions" ON public.predictions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Create RLS policies for risk_assessments table
-- All authenticated users can view risk assessments
CREATE POLICY "Users can view risk assessments" ON public.risk_assessments
  FOR SELECT USING (true);

-- Admins and authorities can create risk assessments
CREATE POLICY "Admins can create risk assessments" ON public.risk_assessments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'authority', 'operational')
    )
  );

-- Create RLS policies for notification_logs table
-- Users can view their own notification logs
CREATE POLICY "Users can view own notification logs" ON public.notification_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at 
  BEFORE UPDATE ON public.incident_reports 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at 
  BEFORE UPDATE ON public.alerts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at 
  BEFORE UPDATE ON public.sensors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at 
  BEFORE UPDATE ON public.predictions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prediction_models_updated_at 
  BEFORE UPDATE ON public.prediction_models 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at 
  BEFORE UPDATE ON public.risk_assessments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'fisherfolk')::user_role,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'fisherfolk' THEN 'approved'::user_status
      ELSE 'pending'::user_status
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to calculate risk score
CREATE OR REPLACE FUNCTION calculate_risk_score(
  probability NUMERIC,
  impact_score NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  RETURN probability * impact_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to get active alerts for location
CREATE OR REPLACE FUNCTION get_active_alerts_for_location(
  target_location TEXT,
  target_sector TEXT DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  type alert_type,
  title TEXT,
  message TEXT,
  category alert_category,
  severity incident_severity,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.type,
    a.title,
    a.message,
    a.category,
    a.severity,
    a.created_at
  FROM public.alerts a
  WHERE a.is_active = true
    AND (a.location = target_location OR target_location IS NULL)
    AND (a.sector = target_sector OR target_sector IS NULL)
    AND (a.expires_at IS NULL OR a.expires_at > NOW())
  ORDER BY 
    CASE a.type
      WHEN 'emergency' THEN 1
      WHEN 'warning' THEN 2
      WHEN 'advisory' THEN 3
      WHEN 'safe' THEN 4
    END,
    a.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.incident_reports TO anon, authenticated;
GRANT ALL ON public.alerts TO anon, authenticated;
GRANT ALL ON public.sensors TO anon, authenticated;
GRANT ALL ON public.sensor_readings TO anon, authenticated;
GRANT ALL ON public.predictions TO anon, authenticated;
GRANT ALL ON public.prediction_models TO anon, authenticated;
GRANT ALL ON public.risk_assessments TO anon, authenticated;
GRANT ALL ON public.notification_logs TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert sample data for testing (optional)
-- INSERT INTO public.sensors (name, type, location, sector, unit, range_min, range_max) VALUES
--   ('Tide Gauge Alpha', 'tide_gauge', 'Mumbai Harbor', 'A-1', 'm', -5, 10),
--   ('Weather Station Beta', 'weather_station', 'Mumbai Harbor', 'A-1', '°C', -10, 50),
--   ('Water Quality Gamma', 'water_quality', 'Mumbai Harbor', 'A-1', 'mg/L', 0, 20);

-- INSERT INTO public.alerts (type, title, message, category, location, sector, severity) VALUES
--   ('warning', 'High Tide Alert', 'Exceptional tide levels expected. Risk of coastal flooding in low-lying areas.', 'tidal', 'Mumbai Harbor', 'A-1', 'medium'),
--   ('advisory', 'Cyclone Watch', 'Tropical cyclone forming 200km offshore. Monitor weather conditions.', 'cyclone', 'Mumbai Coast', 'A-2', 'low');
