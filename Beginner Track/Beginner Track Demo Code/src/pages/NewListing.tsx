import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SimpleAuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, DollarSign, FileText, Tag, Camera } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";

const listingSchema = z.object({
  title: z.string().min(1, "Service title is required").max(100, "Title must be less than 100 characters"),
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

const categoryLabels = {
  food_delivery: "Food Delivery",
  courier_parcel: "Courier & Parcel",
  aerial_imaging: "Aerial Imaging",
  site_mapping: "Site Mapping",
};

const NewListing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      price: "",
      service_area_text: "",
      image_url: "",
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a listing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("listings")
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          price: Number(data.price),
          service_area_text: data.service_area_text,
          operator_id: user.id,
          is_active: true,
          image_url: data.image_url || null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Service created successfully!",
        description: "Your new service listing is now active",
      });

      navigate("/operator-dashboard/listings");
    } catch (error: any) {
      console.error("Create listing error:", error);
      toast({
        title: "Failed to create service",
        description: error.message || "An error occurred while creating your service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Service</h1>
          <p className="text-muted-foreground">Create a new service listing to connect with customers in your area</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-accent" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Basic Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Professional Drone Photography Services"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Give your service a clear, descriptive title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(categoryLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best describes your service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your service in detail. Include what makes your service unique, your experience, equipment used, and any special features you offer..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description to help customers understand your service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

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
                          <FormLabel>Upload an image for your service</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              onRemove={() => field.onChange("")}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            Add a high-quality image that showcases your service (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                {/* Pricing & Location Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing & Location
                  </h3>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Price (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set your starting price or base rate for this service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service_area_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Area</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="e.g., Detroit Metro Area, Downtown Detroit, 15-mile radius from Detroit"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Specify the geographic area where you provide this service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/operator-dashboard/listings")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Service...
                      </>
                    ) : (
                      "Create Service"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NewListing;