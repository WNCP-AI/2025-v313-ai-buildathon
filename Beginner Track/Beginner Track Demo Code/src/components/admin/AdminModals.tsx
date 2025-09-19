import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StandardCard, CardContent } from "@/components/shared/StandardCard";
import { Mail, MessageSquare, X } from "lucide-react";

interface AdminModalsProps {
  // Test Email Modal
  testEmailDialogOpen: boolean;
  setTestEmailDialogOpen: (open: boolean) => void;
  testEmail: string;
  setTestEmail: (email: string) => void;
  sendTestEmail: () => void;
  loadingTestEmail: boolean;
  
  // Integrity Check Modal
  showIntegrityModal: boolean;
  setShowIntegrityModal: (show: boolean) => void;
  integrityResults: {
    orphanedListings: number;
    orphanedImages: number;
  } | null;
}

export const AdminModals = ({
  testEmailDialogOpen,
  setTestEmailDialogOpen,
  testEmail,
  setTestEmail,
  sendTestEmail,
  loadingTestEmail,
  showIntegrityModal,
  setShowIntegrityModal,
  integrityResults,
}: AdminModalsProps) => {
  return (
    <>
      {/* Test Email Modal */}
      <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Test Email
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test Email Functionality</DialogTitle>
            <DialogDescription>
              Send a test email to verify the email system is working correctly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loadingTestEmail && testEmail.trim()) {
                    sendTestEmail();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setTestEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={sendTestEmail}
                disabled={loadingTestEmail || !testEmail.trim()}
              >
                {loadingTestEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Database Integrity Check Results Modal */}
      <Dialog open={showIntegrityModal} onOpenChange={setShowIntegrityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Database Integrity Check Results
            </DialogTitle>
            <DialogDescription>
              Review the health status of your database.
            </DialogDescription>
          </DialogHeader>
          
          {integrityResults ? (
            <div className="space-y-4">
              <StandardCard variant="stats">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {integrityResults.orphanedListings}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Orphaned Listings
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {integrityResults.orphanedImages}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Orphaned Images
                      </div>
                    </div>
                  </div>
                </CardContent>
              </StandardCard>

              {integrityResults.orphanedListings === 0 && integrityResults.orphanedImages === 0 ? (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-green-800 font-medium">
                    ✅ Database is healthy!
                  </div>
                  <div className="text-green-600 text-sm mt-1">
                    No orphaned data found.
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-yellow-800 font-medium">
                    ⚠️ Issues found
                  </div>
                  <div className="text-yellow-600 text-sm mt-1">
                    Some orphaned data needs attention.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
              <div className="text-muted-foreground">Running integrity check...</div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowIntegrityModal(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};