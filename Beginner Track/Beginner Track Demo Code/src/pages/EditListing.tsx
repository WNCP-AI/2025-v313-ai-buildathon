import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ArrowLeft, Copy, Camera } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ImageUpload from "@/components/shared/ImageUpload";

const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  category: z.enum(["food_delivery", "courier_parcel", "aerial_imaging", "site_mapping"], {
    required_error: "Please select a service category",
  }),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid positive number",
  }),
  service_area_text: z.string().min(1, "Service area is required").max(200, "Service area must be less than 200 characters"),
  image_url: z.string().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

const categories = [
  "food_delivery",
  "courier_parcel", 
  "aerial_imaging",
  "site_mapping",
];

const EditListing = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "food_delivery",
      price: "",
      service_area_text: "",
      image_url: "",
    },
  });

  const fetchListing = useCallback(async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('operator_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Error",
          description: "Listing not found or you don't have permission to edit it.",
          variant: "destructive",
        });
        navigate('/operator-dashboard/listings');
        return;
      }

      form.reset({
        title: data.title,
        description: data.description || "",
        category: data.category,
        price: data.price.toString(),
        service_area_text: data.service_area_text || "",
        image_url: data.image_url || "",
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast({
        title: "Error",
        description: "Failed to load listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, id, toast, navigate, form]);

  const onSubmit = async (data: ListingFormData) => {
    if (!user || !id) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: data.title,
          description: data.description,
          category: data.category,
          price: parseFloat(data.price),
          service_area_text: data.service_area_text,
          image_url: data.image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('operator_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing updated successfully!",
      });

      navigate('/operator-dashboard/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicate = async () => {
    if (!user || !id) return;

    try {
      const { data: originalListing, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('operator_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!originalListing) return;

      const { error: insertError } = await supabase
        .from('listings')
        .insert({
          operator_id: user.id,
          title: `${originalListing.title} (Copy)`,
          description: originalListing.description,
          category: originalListing.category,
          price: originalListing.price,
          service_area_text: originalListing.service_area_text,
          is_active: false, // Start as inactive
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Listing duplicated successfully! The copy has been created as inactive.",
      });

      navigate('/operator-dashboard/listings');
    } catch (error) {
      console.error('Error duplicating listing:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/operator-dashboard/listings')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit Service</h1>
              <p className="text-muted-foreground mt-2">
                Update your service details and pricing.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDuplicate}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Professional Drone Photography"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your service, experience, and what makes you unique..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="service_area_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Area</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Downtown Detroit, Within 10 miles of Detroit Metro"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload Section */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Service Image
                </h3>
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Update service image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => field.onChange("")}
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a high-quality image that showcases your service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/operator-dashboard/listings')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
              className="flex-1"
              style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            >
              {submitting ? "Updating..." : "Update Service"}
            </Button>
          </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditListing;