import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminData {
  users: any[];
  listings: any[];
}

interface AvailableModels {
  chatModels: Array<{ value: string; label: string; created?: number }>;
  imageModels: Array<{ value: string; label: string; created?: number }>;
}

export const useAdminData = () => {
  const { toast } = useToast();
  
  // Data state
  const [adminData, setAdminData] = useState<AdminData>({ users: [], listings: [] });
  const [loading, setLoading] = useState(true);
  
  // AI Generation state
  const [userCount, setUserCount] = useState(3);
  const [listingCount, setListingCount] = useState(5);
  const [imageCount, setImageCount] = useState(5);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageGuidance, setImageGuidance] = useState('');
  const [imageType, setImageType] = useState<'listings' | 'profiles'>('listings');
  const [imageModel, setImageModel] = useState('dall-e-3');
  const [listingGuidance, setListingGuidance] = useState('');
  const [listingModel, setListingModel] = useState('gpt-5-2025-08-07');
  const [userGuidance, setUserGuidance] = useState('');
  const [userModel, setUserModel] = useState('gpt-5-2025-08-07');
  const [availableModels, setAvailableModels] = useState<AvailableModels>({
    chatModels: [],
    imageModels: []
  });
  const [modelsLoading, setModelsLoading] = useState(true);
  
  // Bulk operations state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingDeleteUsers, setLoadingDeleteUsers] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [loadingDeleteListings, setLoadingDeleteListings] = useState(false);
  
  // Modal state
  const [testEmail, setTestEmail] = useState('');
  const [loadingTestEmail, setLoadingTestEmail] = useState(false);
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);
  const [integrityResults, setIntegrityResults] = useState<{
    orphanedListings: number;
    orphanedImages: number;
  } | null>(null);
  const [loadingIntegrityCheck, setLoadingIntegrityCheck] = useState(false);

  const fetchAdminData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'get-all-data' }
      });

      if (error) throw error;
      setAdminData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-available-models');

      if (error) throw error;

      setAvailableModels(data);
      
      // Update default models if they exist
      if (data.chatModels.length > 0) {
        const defaultChatModel = data.chatModels.find((m: any) => m.value === 'gpt-5-2025-08-07') || data.chatModels[0];
        setListingModel(defaultChatModel.value);
        setUserModel(defaultChatModel.value);
      }
      
      if (data.imageModels.length > 0) {
        const defaultImageModel = data.imageModels.find((m: any) => m.value === 'dall-e-3') || data.imageModels[0];
        setImageModel(defaultImageModel.value);
      }

      if (data.fallback) {
        toast({
          title: "Using Fallback Models",
          description: "Unable to fetch latest models from OpenAI. Using fallback list.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Set fallback models
      setAvailableModels({
        chatModels: [
          { value: "gpt-5-2025-08-07", label: "GPT-5 (Latest)" },
          { value: "gpt-5-mini-2025-08-07", label: "GPT-5 Mini (Fast)" },
          { value: "gpt-4.1-2025-04-14", label: "GPT-4.1 (Reliable)" },
          { value: "gpt-4o", label: "GPT-4 Turbo" },
          { value: "gpt-4o-mini", label: "GPT-4 Mini" }
        ],
        imageModels: [
          { value: "dall-e-3", label: "DALL-E 3" },
          { value: "dall-e-2", label: "DALL-E 2" }
        ]
      });
    } finally {
      setModelsLoading(false);
    }
  };

  const generateImages = async () => {
    if (loadingImages) return;
    
    setLoadingImages(true);
    try {
      const functionName = imageType === 'listings' ? 'generate-listing-images' : 'generate-profile-images';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { count: imageCount, guidance: imageGuidance, model: imageModel }
      });

      if (error) throw error;

      if (data.success) {
        const itemType = imageType === 'listings' ? 'listings' : 'profiles';
        const fallbackUsed = data.results?.some((r: any) => r.usedFallback) || false;
        
        toast({
          title: "Images Generated Successfully!",
          description: `Generated ${data.generated} images for ${itemType}. ${data.failed > 0 ? `${data.failed} failed.` : ''} ${fallbackUsed ? '⚠️ Some used fallback model (DALL-E 3).' : ''}`,
        });

        if (fallbackUsed) {
          toast({
            title: "Fallback Model Used",
            description: "Some images were generated using DALL-E 3 as fallback. Latest GPT-Image-1 model may be temporarily unavailable.",
            variant: "destructive",
          });
        }
        
        fetchAdminData();
      } else {
        throw new Error(data.error || 'Failed to generate images');
      }
    } catch (error) {
      console.error('Error generating images:', error);
      toast({
        title: "Error",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingImages(false);
    }
  };

  const generateListings = async () => {
    if (loadingListings) return;
    
    setLoadingListings(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { 
          type: 'listing', 
          count: listingCount,
          guidance: listingGuidance,
          model: listingModel
        }
      });

      if (error) throw error;

      toast({
        title: "Listings Generated Successfully!",
        description: `Generated ${listingCount} new listings.`,
      });
      
      fetchAdminData();
    } catch (error) {
      console.error('Error generating listings:', error);
      toast({
        title: "Error",
        description: "Failed to generate listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingListings(false);
    }
  };

  const generateUsers = async () => {
    if (loadingUsers) return;
    
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { type: 'users', count: userCount, guidance: userGuidance, model: userModel }
      });

      if (error) throw error;

      toast({
        title: "Users Generated Successfully!",
        description: `Generated ${userCount} new users.`,
      });
      
      fetchAdminData();
    } catch (error) {
      console.error('Error generating users:', error);
      toast({
        title: "Error",
        description: "Failed to generate users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'delete-listing', listingId }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Listing deleted successfully",
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'delete-user', userId }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User deleted successfully",
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    setLoadingDeleteUsers(true);
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'bulk-delete-users', userIds: selectedUsers }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Deleted ${selectedUsers.length} users successfully`,
      });

      setSelectedUsers([]);
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: "Error",
        description: "Failed to delete users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDeleteUsers(false);
    }
  };

  const handleBulkDeleteListings = async () => {
    if (selectedListings.length === 0) return;
    
    setLoadingDeleteListings(true);
    try {
      for (const listingId of selectedListings) {
        const { error } = await supabase.functions.invoke('admin-data', {
          body: { action: 'delete-listing', listingId }
        });
        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Deleted ${selectedListings.length} listings successfully`,
      });

      setSelectedListings([]);
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting listings:', error);
      toast({
        title: "Error",
        description: "Failed to delete listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDeleteListings(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === adminData.users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(adminData.users.map(user => user.id));
    }
  };

  const toggleListingSelection = (listingId: string) => {
    setSelectedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const toggleAllListings = () => {
    if (selectedListings.length === adminData.listings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(adminData.listings.map(listing => listing.id));
    }
  };

  const sendTestEmail = async () => {
    if (loadingTestEmail || !testEmail.trim()) return;
    
    setLoadingTestEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: { email: testEmail.trim() }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Test Email Sent! 🎉",
          description: `Successfully sent a cute test email to ${testEmail}`,
        });
        setTestEmail('');
        setTestEmailDialogOpen(false);
      } else {
        throw new Error(data.error || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTestEmail(false);
    }
  };

  const runIntegrityCheck = async () => {
    setLoadingIntegrityCheck(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'database-integrity-check' }
      });

      if (error) throw error;

      setIntegrityResults(data);
      setShowIntegrityModal(true);
    } catch (error) {
      console.error('Error running integrity check:', error);
      toast({
        title: "Error",
        description: "Failed to run database integrity check",
        variant: "destructive",
      });
    } finally {
      setLoadingIntegrityCheck(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchAvailableModels();
  }, []);

  return {
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
    fetchAdminData,
  };
};