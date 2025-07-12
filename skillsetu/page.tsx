"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Briefcase,
  Target,
} from "lucide-react";
import { getUsers } from "@/lib/data";
import type { User } from "@/lib/types";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const users = getUsers();

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsOffered.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.skillsWanted.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, users]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Find Your Next Skill Swap
        </h1>
        <p className="mt-3 max-w-md mx-auto text-lg text-foreground/80 sm:text-xl md:mt-5 md:max-w-3xl">
          Browse profiles, discover new talents, and connect with people to
          exchange skills.
        </p>
      </header>

      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for skills or people..."
            className="pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for skills or people"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {filteredUsers.length === 0 && (
         <div className="text-center col-span-full py-16">
            <p className="text-lg text-muted-foreground">No users found matching your search.</p>
         </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4 p-4 bg-secondary/50">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {user.location}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Skills Offered
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {user.skillsOffered.length > 3 && <Badge variant="outline">...</Badge>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Skills Wanted
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
               {user.skillsWanted.length > 3 && <Badge variant="outline">...</Badge>}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/50 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
          <span>
            {user.rating.toFixed(1)} ({user.reviews} reviews)
          </span>
        </div>
        <Button asChild size="sm">
          <Link href="/swaps">
            Request Swap <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
