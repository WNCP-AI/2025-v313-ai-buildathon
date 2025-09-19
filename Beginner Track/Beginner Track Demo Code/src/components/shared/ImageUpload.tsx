import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, onRemove, className, disabled }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(data.path);

      onChange(publicUrl);
      
      toast({
        title: "Image uploaded successfully!",
        description: "Your image has been uploaded and is ready to use.",
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong while uploading your image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        // Extract filename from URL to delete from storage
        const url = new URL(value);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        // Delete from storage
        await supabase.storage
          .from('listing-images')
          .remove([fileName]);
          
        onRemove();
        
        toast({
          title: "Image removed",
          description: "The image has been removed from your listing.",
        });
      } catch (error) {
        console.error('Error removing image:', error);
        // Still remove from UI even if storage deletion fails
        onRemove();
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
      />

      {value ? (
        <div className="relative group">
          <div className="aspect-video w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden border">
            <img
              src={value}
              alt="Listing image"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="aspect-video w-full max-w-md mx-auto border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center p-6 hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={disabled}>
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;