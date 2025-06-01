"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATOR_NICHES, SOCIAL_PLATFORMS } from "@/lib/constants";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { User, UserRole } from "@/lib/supabase";

// Define types for our database responses
interface BaseProfile {
  id: string;
  role: UserRole;
  email: string;
}

interface BrandProfile extends BaseProfile {
  role: "brand";
  company_name: string;
  industry: string;
  brand_profiles?: {
    company_description?: string;
    website?: string;
    logo_url?: string;
    social_links?: Record<string, any>;
    contact_info?: Record<string, any>;
  }[];
}

interface CreatorProfile extends BaseProfile {
  role: "creator";
  username: string;
  niche: string;
  creator_profiles?: {
    bio?: string;
    profile_picture_url?: string;
    portfolio_url?: string;
    skills?: string[];
    social_links?: Record<string, any>;
  }[];
}

interface AgencyProfile extends BaseProfile {
  role: "agency";
  agency_name: string;
  specialization: string;
  agency_profiles?: {
    agency_description?: string;
    website?: string;
    logo_url?: string;
    social_links?: Record<string, any>;
    contact_info?: Record<string, any>;
  }[];
}

type ProfileData = BrandProfile | CreatorProfile | AgencyProfile;

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }),
  primaryNiche: z.string().optional(),
  mainPlatform: z.string().optional(),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      bio: "",
      primaryNiche: "",
      mainPlatform: "",
      location: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      // Fetch user role and basic info
      const { data: userData, error: userDataError } = await supabase
        .from("users_logins.users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userDataError) throw userDataError;

      // Fetch role-specific data
      let roleData: ProfileData | null = null;
      switch (userData.role as UserRole) {
        case "brand":
          const { data: brandData, error: brandError } = await supabase
            .from("users_logins.brands")
            .select("*, users_profiles.brand_profiles(*)")
            .eq("id", user.id)
            .single();
          if (brandError) throw brandError;
          if (brandData && typeof brandData === 'object' && !('error' in brandData)) {
            const typedBrandData = brandData as {
              id: string;
              company_name: string;
              industry: string;
              brand_profiles?: any[];
            };
            roleData = {
              id: typedBrandData.id,
              role: "brand",
              email: userData.email,
              company_name: typedBrandData.company_name,
              industry: typedBrandData.industry,
              brand_profiles: typedBrandData.brand_profiles,
            } as BrandProfile;
          }
          break;

        case "creator":
          const { data: creatorData, error: creatorError } = await supabase
            .from("users_logins.creators")
            .select("*, users_profiles.creator_profiles(*)")
            .eq("id", user.id)
            .single();
          if (creatorError) throw creatorError;
          if (creatorData && typeof creatorData === 'object' && !('error' in creatorData)) {
            const typedCreatorData = creatorData as {
              id: string;
              username: string;
              niche: string;
              creator_profiles?: any[];
            };
            roleData = {
              id: typedCreatorData.id,
              role: "creator",
              email: userData.email,
              username: typedCreatorData.username,
              niche: typedCreatorData.niche,
              creator_profiles: typedCreatorData.creator_profiles,
            } as CreatorProfile;
          }
          break;

        case "agency":
          const { data: agencyData, error: agencyError } = await supabase
            .from("users_logins.agencies")
            .select("*, users_profiles.agency_profiles(*)")
            .eq("id", user.id)
            .single();
          if (agencyError) throw agencyError;
          if (agencyData && typeof agencyData === 'object' && !('error' in agencyData)) {
            const typedAgencyData = agencyData as {
              id: string;
              agency_name: string;
              specialization: string;
              agency_profiles?: any[];
            };
            roleData = {
              id: typedAgencyData.id,
              role: "agency",
              email: userData.email,
              agency_name: typedAgencyData.agency_name,
              specialization: typedAgencyData.specialization,
              agency_profiles: typedAgencyData.agency_profiles,
            } as AgencyProfile;
          }
          break;
      }

      if (roleData) {
        setProfile(roleData);
        form.reset({
          name: roleData.role === "brand" ? roleData.company_name :
                roleData.role === "agency" ? roleData.agency_name : "",
          username: roleData.role === "creator" ? roleData.username : "",
          email: userData.email,
          bio: roleData.role === "brand" ? roleData.brand_profiles?.[0]?.company_description :
               roleData.role === "creator" ? roleData.creator_profiles?.[0]?.bio :
               roleData.role === "agency" ? roleData.agency_profiles?.[0]?.agency_description : "",
          primaryNiche: roleData.role === "creator" ? roleData.niche :
                       roleData.role === "brand" ? roleData.industry :
                       roleData.role === "agency" ? roleData.specialization : "",
          mainPlatform: "",
          location: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      if (!profile) throw new Error("No profile data found");

      // Update role-specific data
      switch (profile.role) {
        case "brand":
          await supabase
            .from("users_logins.brands")
            .update({
              company_name: data.name,
              industry: data.primaryNiche,
            })
            .eq("id", user.id);

          await supabase
            .from("users_profiles.brand_profiles")
            .upsert({
              id: user.id,
              company_description: data.bio,
              website: "",
              logo_url: "",
              social_links: {},
              contact_info: {},
            });
          break;

        case "creator":
          await supabase
            .from("users_logins.creators")
            .update({
              username: data.username,
              niche: data.primaryNiche,
            })
            .eq("id", user.id);

          await supabase
            .from("users_profiles.creator_profiles")
            .upsert({
              id: user.id,
              bio: data.bio,
              profile_picture_url: "",
              portfolio_url: "",
              skills: [],
              social_links: {},
            });
          break;

        case "agency":
          await supabase
            .from("users_logins.agencies")
            .update({
              agency_name: data.name,
              specialization: data.primaryNiche,
            })
            .eq("id", user.id);

          await supabase
            .from("users_profiles.agency_profiles")
            .upsert({
              id: user.id,
              agency_description: data.bio,
              website: "",
              logo_url: "",
              social_links: {},
              contact_info: {},
            });
          break;
      }

      toast.success("Profile updated successfully!");
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="primaryNiche"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Niche</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary niche" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CREATOR_NICHES.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
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
            name="mainPlatform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Platform</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your main platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Link href="/profile">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            type="submit"
            disabled={loading}
            className="bg-[#00FFFF] text-black hover:bg-[#00DDDD]"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}