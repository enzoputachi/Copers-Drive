// MaintenancePage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Mail, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from "@/hooks/useApi";

const MaintenancePage: React.FC = () => {
  const { data, isLoading, error } = useSettings();
  const settings = data?.data?.data;
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);

  console.log("Settings Data:", settings);

  const handleJoinWhatsApp = () => {
    const whatsAppUrl = settings?.whatsAppGroupUrl;
    const whatsappGroupLink = whatsAppUrl || '#';
    window.open(whatsappGroupLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
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
            Corpers Drive is currently undergoing scheduled maintenance. 
            We'll be back online shortly.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Expected downtime: 1 hour</span>
          </div>

          {/* WhatsApp Community Section */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">Stay connected while we're down!</p>
            <button
              onClick={() => setShowWhatsAppDialog(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 font-medium mx-auto"
            >
              <MessageCircle size={18} />
              <span>Join WhatsApp Community</span>
            </button>
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
            {settings?.contactEmail && (
              <div className="flex items-center justify-center gap-1 text-sm">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${settings?.contactEmail}`} className="text-green-600 hover:underline">
                  {settings?.contactEmail}
                </a>
              </div>
            )}
            {settings?.contactPhone && (
              <div className="flex items-center justify-center gap-1 text-sm">
                <Phone className="h-4 w-4" />
                <a href={`tel:${settings?.contactPhone}`} className="text-green-600 hover:underline">
                  {settings?.contactPhone}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Join Our Travel Community
            </DialogTitle>
            <DialogDescription>
              Stay updated even during maintenance! Connect with other travelers and get exclusive updates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800 mb-3">
                🚌 Get real-time maintenance updates
                <br />
                💬 Connect with fellow travelers
                <br />
                🎁 Access exclusive offers & discounts
                <br />
                📍 Receive important service announcements
                <br />
                ⚡ Be the first to know when we're back online
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  handleJoinWhatsApp();
                  setShowWhatsAppDialog(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join WhatsApp Community
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWhatsAppDialog(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenancePage;