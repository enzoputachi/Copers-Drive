// MaintenancePage.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Mail, Phone } from 'lucide-react';

interface MaintenancePageProps {
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({
  companyName,
  contactEmail,
  contactPhone,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-orange-100 p-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Under Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {companyName} is currently undergoing scheduled maintenance. 
            We'll be back online shortly.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Expected downtime: 1hour</span>
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
            <div className="flex items-center justify-center gap-1 text-sm">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${contactEmail}`} className="text-green-600 hover:underline">
                {contactEmail}
              </a>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm">
              <Phone className="h-4 w-4" />
              <a href={`tel:${contactPhone}`} className="text-green-600 hover:underline">
                {contactPhone}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;