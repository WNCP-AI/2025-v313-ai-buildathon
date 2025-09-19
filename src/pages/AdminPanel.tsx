import { useAuth } from "@/contexts/SimpleAuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Settings, Camera, List, Users, MessageSquare } from "lucide-react";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";
import { LoadingSpinner } from "@/components/shared/LoadingState";
import { AdminGeneratorBox } from "@/components/shared/AdminGeneratorBox";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminModals } from "@/components/admin/AdminModals";
import { useAdminData } from "@/hooks/useAdminData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPanel = () => {
  const { user } = useAuth();
  const {
    // Data state
    adminData,
    loading,
    
    // AI Generation state
    userCount,
    setUserCount,
    listingCount,
    setListingCount,
    imageCount,
    setImageCount,
    loadingUsers,
    loadingListings,
    loadingImages,
    imageGuidance,
    setImageGuidance,
    imageType,
    setImageType,
    imageModel,
    setImageModel,
    listingGuidance,
    setListingGuidance,
    listingModel,
    setListingModel,
    userGuidance,
    setUserGuidance,
    userModel,
    setUserModel,
    availableModels,
    modelsLoading,
    
    // Bulk operations state
    selectedUsers,
    loadingDeleteUsers,
    selectedListings,
    loadingDeleteListings,
    
    // Modal state
    testEmail,
    setTestEmail,
    loadingTestEmail,
    testEmailDialogOpen,
    setTestEmailDialogOpen,
    showIntegrityModal,
    setShowIntegrityModal,
    integrityResults,
    loadingIntegrityCheck,
    
    // Functions
    generateImages,
    generateListings,
    generateUsers,
    handleDeleteListing,
    handleDeleteUser,
    handleBulkDeleteUsers,
    handleBulkDeleteListings,
    toggleUserSelection,
    toggleAllUsers,
    toggleListingSelection,
    toggleAllListings,
    sendTestEmail,
    runIntegrityCheck,
  } = useAdminData();

  // Check if user has admin access
  const isAdmin = user?.email?.endsWith('@wncp.ai') || false;

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2 text-sm lg:text-base">
              Manage platform data and generate AI content
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={runIntegrityCheck}
              disabled={loadingIntegrityCheck}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {loadingIntegrityCheck ? 'Checking...' : 'Database Health Check'}
            </Button>
            <AdminModals
              testEmailDialogOpen={testEmailDialogOpen}
              setTestEmailDialogOpen={setTestEmailDialogOpen}
              testEmail={testEmail}
              setTestEmail={setTestEmail}
              sendTestEmail={sendTestEmail}
              loadingTestEmail={loadingTestEmail}
              showIntegrityModal={showIntegrityModal}
              setShowIntegrityModal={setShowIntegrityModal}
              integrityResults={integrityResults}
            />
          </div>
        </div>

        {/* AI Generators */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {/* Generate Images */}
          <AdminGeneratorBox
            title="Generate Images"
            description="Generate AI images for listings or profiles missing visuals."
            icon={Camera}
            model={imageModel}
            onModelChange={setImageModel}
            modelOptions={modelsLoading ? [{ value: "loading", label: "Loading models..." }] : availableModels.imageModels}
            count={imageCount}
            onCountChange={setImageCount}
            maxCount={20}
            guidance={imageGuidance}
            onGuidanceChange={setImageGuidance}
            guidancePlaceholder={imageType === 'listings' ? "e.g. photorealistic, vibrant colors" : "e.g. professional headshots, diverse"}
            onGenerate={generateImages}
            loading={loadingImages}
            additionalFields={
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Image Type
                </label>
                <Select value={imageType} onValueChange={(value: 'listings' | 'profiles') => setImageType(value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listings">Service Listings</SelectItem>
                    <SelectItem value="profiles">User Profiles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />

          {/* Generate Listings */}
          <AdminGeneratorBox
            title="Generate Listings"
            description="Create AI-generated service listings."
            icon={List}
            model={listingModel}
            onModelChange={setListingModel}
            modelOptions={modelsLoading ? [{ value: "loading", label: "Loading models..." }] : availableModels.chatModels}
            count={listingCount}
            onCountChange={setListingCount}
            maxCount={50}
            guidance={listingGuidance}
            onGuidanceChange={setListingGuidance}
            guidancePlaceholder="e.g. Detroit local food delivery"
            onGenerate={generateListings}
            loading={loadingListings}
          />

          {/* Generate Users */}
          <AdminGeneratorBox
            title="Generate Users"
            description="Create AI-generated platform users."
            icon={Users}
            model={userModel}
            onModelChange={setUserModel}
            modelOptions={modelsLoading ? [{ value: "loading", label: "Loading models..." }] : availableModels.chatModels}
            count={userCount}
            onCountChange={setUserCount}
            maxCount={20}
            guidance={userGuidance}
            onGuidanceChange={setUserGuidance}
            guidancePlaceholder="e.g. diverse Detroit residents"
            onGenerate={generateUsers}
            loading={loadingUsers}
          />
        </div>

        {/* Data Tables */}
        <div className="grid gap-6">
          {/* Listings Table */}
          <AdminDataTable
            type="listings"
            data={adminData.listings}
            selectedItems={selectedListings}
            onToggleItem={toggleListingSelection}
            onToggleAll={toggleAllListings}
            onDelete={handleDeleteListing}
            onBulkDelete={handleBulkDeleteListings}
            loadingBulkDelete={loadingDeleteListings}
          />

          {/* Users Table */}
          <AdminDataTable
            type="users"
            data={adminData.users}
            selectedItems={selectedUsers}
            onToggleItem={toggleUserSelection}
            onToggleAll={toggleAllUsers}
            onDelete={handleDeleteUser}
            onBulkDelete={handleBulkDeleteUsers}
            loadingBulkDelete={loadingDeleteUsers}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminPanel;