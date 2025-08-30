import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PredictionTimeline } from '@/components/predictions/PredictionTimeline';
import { DynamicPredictionCard } from '@/components/predictions/DynamicPredictionCard';
import { 
  Brain, 
  TrendingUp, 
  Waves, 
  Wind, 
  Droplets,
  AlertTriangle,
  Activity
} from 'lucide-react';





const Predictions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Predictions</h1>
          <p className="text-muted-foreground">Machine learning powered coastal predictions and risk analysis</p>
        </div>

        {/* Dynamic Prediction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DynamicPredictionCard 
            parameter="sst"
            title="Sea Surface Temperature"
            icon={Waves}
          />
          <DynamicPredictionCard 
            parameter="seaLevel"
            title="Sea Level Rise"
            icon={TrendingUp}
          />
          <DynamicPredictionCard 
            parameter="chlorophyll"
            title="Water Quality"
            icon={Droplets}
          />
          <DynamicPredictionCard 
            parameter="wind"
            title="Cyclone Formation"
            icon={Wind}
          />
        </div>

        {/* Prediction Timeline */}
        <PredictionTimeline className="mb-6" />

        {/* AI Model Information */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Model Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">94.7%</div>
                <div className="text-sm text-muted-foreground">Overall Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-2">1,247</div>
                <div className="text-sm text-muted-foreground">Predictions Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-safe mb-2">87.3%</div>
                <div className="text-sm text-muted-foreground">Early Warning Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Predictions;