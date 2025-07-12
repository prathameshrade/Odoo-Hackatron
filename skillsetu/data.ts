"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Mail,
  Star,
  Pencil,
  Save,
  X,
  Briefcase,
  Target,
  Clock,
  MessageSquare,
} from "lucide-react";
import { getCurrentUser, getReviewsForUser } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, Review as ReviewType } from "@/lib/types";

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserType>(getCurrentUser());
  const reviews = getReviewsForUser(user.id);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsChange = (field: 'skillsOffered' | 'skillsWanted', value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(Boolean);
    setUser(prev => ({...prev, [field]: skills}));
  }

  const handleSave = () => {
    // Here you would typically save the user data to a backend.
    // We'll just simulate it.
    console.log("Saving user data:", user);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary/50 p-6 border-b">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary shadow-md">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold"
                  />
                ) : (
                  <CardTitle className="text-3xl font-bold text-primary">
                    {user.name}
                  </CardTitle>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                     {isEditing ? (
                      <Input
                        name="location"
                        value={user.location}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{user.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setUser(getCurrentUser()); // Reset changes
                  }}
                  size="sm"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <ProfileSection icon={Briefcase} title="Skills Offered">
              {isEditing ? (
                <Input name="skillsOffered" defaultValue={user.skillsOffered.join(', ')} onChange={e => handleSkillsChange('skillsOffered', e.target.value)} placeholder="Comma-separated skills"/>
              ) : (
                <SkillBadges skills={user.skillsOffered} />
              )}
            </ProfileSection>
            
            <ProfileSection icon={Target} title="Skills Wanted">
              {isEditing ? (
                <Input name="skillsWanted" defaultValue={user.skillsWanted.join(', ')} onChange={e => handleSkillsChange('skillsWanted', e.target.value)} placeholder="Comma-separated skills"/>
              ) : (
                <SkillBadges skills={user.skillsWanted} />
              )}
            </ProfileSection>

            <ProfileSection icon={Clock} title="Availability">
              {isEditing ? (
                <Textarea
                  name="availability"
                  value={user.availability}
                  onChange={handleInputChange}
                  placeholder="Describe your availability"
                />
              ) : (
                <p className="text-foreground/80">{user.availability}</p>
              )}
            </ProfileSection>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Ratings & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-4xl font-bold text-primary">{user.rating.toFixed(1)}</p>
                  <div className="flex flex-col">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-5 w-5", i < Math.round(user.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}/>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">Based on {user.reviews} reviews</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {reviews.map(review => <ReviewItem key={review.id} review={review}/>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const ProfileSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 mb-3">
            <Icon className="h-5 w-5"/>
            {title}
        </h3>
        {children}
    </div>
);

const SkillBadges = ({ skills }: { skills: string[] }) => (
    <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? skills.map(skill => (
            <Badge key={skill} variant="secondary" className="text-base py-1 px-3">
                {skill}
            </Badge>
        )) : <p className="text-muted-foreground text-sm">No skills listed.</p>}
    </div>
);

const ReviewItem = ({ review }: {review: ReviewType}) => {
    const author = getCurrentUser(); // In a real app, you'd fetch this
    return (
        <div className="p-3 rounded-lg border bg-background">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                         <AvatarImage src={author.avatarUrl} />
                         <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">{author.name}</span>
                </div>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}/>
                    ))}
                </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
        </div>
    )
}
