"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowRightLeft,
  Check,
  X,
  Trash2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  CircleCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSwapsForUser, getUser, getCurrentUser } from "@/lib/data";
import type { Swap, User } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function SwapsPage() {
  const currentUser = getCurrentUser();
  // In a real app, you'd fetch and manage state with a library like React Query
  const [swaps, setSwaps] = useState(() => getSwapsForUser(currentUser.id));
  const { toast } = useToast();

  const handleAction = (swapId: string, status: Swap["status"]) => {
    setSwaps((prevSwaps) =>
      prevSwaps.map((s) => (s.id === swapId ? { ...s, status } : s))
    );
    toast({
      title: "Swap Updated",
      description: `The swap request has been ${status}.`,
    });
  };

  const handleDelete = (swapId: string) => {
    setSwaps((prevSwaps) => prevSwaps.filter((s) => s.id !== swapId));
    toast({
      title: "Swap Canceled",
      description: "You have canceled the swap request.",
      variant: "destructive",
    });
  };

  const incoming = swaps.filter(s => s.toUserId === currentUser.id && s.status === 'pending');
  const sent = swaps.filter(s => s.fromUserId === currentUser.id && s.status === 'pending');
  const history = swaps.filter(s => s.status !== 'pending');


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Manage Your Swaps
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          Track your skill exchanges and respond to new requests.
        </p>
      </header>

      <Tabs defaultValue="incoming">
        <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
          <TabsTrigger value="incoming">
            Incoming ({incoming.length})
          </TabsTrigger>
          <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="incoming">
          <SwapList swaps={incoming} currentUser={currentUser} onAction={handleAction} onDelete={handleDelete} type="incoming" />
        </TabsContent>
        <TabsContent value="sent">
          <SwapList swaps={sent} currentUser={currentUser} onAction={handleAction} onDelete={handleDelete} type="sent" />
        </TabsContent>
        <TabsContent value="history">
          <SwapList swaps={history} currentUser={currentUser} onAction={handleAction} onDelete={handleDelete} type="history" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SwapListProps {
    swaps: Swap[];
    currentUser: User;
    onAction: (swapId: string, status: Swap["status"]) => void;
    onDelete: (swapId: string) => void;
    type: 'incoming' | 'sent' | 'history';
}

function SwapList({ swaps, currentUser, onAction, onDelete, type }: SwapListProps) {
  if (swaps.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-semibold">No swaps here.</h3>
        <p className="text-muted-foreground mt-2">
            {type === 'incoming' && "You have no new incoming requests."}
            {type === 'sent' && "You haven't sent any requests yet."}
            {type === 'history' && "Your swap history is empty."}
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {swaps.map((swap) => (
        <SwapCard
          key={swap.id}
          swap={swap}
          currentUser={currentUser}
          onAction={onAction}
          onDelete={onDelete}
          type={type}
        />
      ))}
    </div>
  );
}

interface SwapCardProps {
    swap: Swap;
    currentUser: User;
    onAction: (swapId: string, status: Swap["status"]) => void;
    onDelete: (swapId: string) => void;
    type: 'incoming' | 'sent' | 'history';
}

function SwapCard({ swap, currentUser, onAction, onDelete, type }: SwapCardProps) {
    const otherUserId = swap.fromUserId === currentUser.id ? swap.toUserId : swap.fromUserId;
    const otherUser = getUser(otherUserId);

    if (!otherUser) return null;
    
    const statusConfig = {
        pending: { color: "bg-yellow-500", icon: Clock, text: "Pending" },
        accepted: { color: "bg-blue-500", icon: ThumbsUp, text: "Accepted" },
        completed: { color: "bg-green-500", icon: CircleCheck, text: "Completed" },
        rejected: { color: "bg-red-500", icon: ThumbsDown, text: "Rejected" },
    };
    const currentStatus = statusConfig[swap.status];

    return (
        <Card className="flex flex-col">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name}/>
                            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                            <CardDescription>
                                {type === 'incoming' ? 'Sent you a request' : 'You sent a request'}
                            </CardDescription>
                        </div>
                    </div>
                     <Badge variant="outline" className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", currentStatus.color)}></div>
                        {currentStatus.text}
                     </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                 <p className="text-sm text-muted-foreground">
                    Request for a skill swap. Details would be shown here, such as which skills are being offered and requested.
                 </p>
            </CardContent>
            <CardFooter className="p-4 bg-secondary/50 flex flex-col items-start gap-4">
                <div className="w-full text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(swap.createdAt), { addSuffix: true })}
                </div>
                {type === "incoming" && (
                    <div className="flex gap-2 w-full">
                        <Button className="flex-1" size="sm" onClick={() => onAction(swap.id, 'accepted')}>
                            <Check className="mr-2 h-4 w-4"/> Accept
                        </Button>
                        <Button className="flex-1" size="sm" variant="outline" onClick={() => onAction(swap.id, 'rejected')}>
                            <X className="mr-2 h-4 w-4"/> Reject
                        </Button>
                    </div>
                )}
                {type === "sent" && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full" size="sm" variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4"/> Cancel Request
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently cancel your swap request. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(swap.id)}>
                                Yes, Cancel
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                 {type === "history" && swap.status === 'accepted' && (
                    <Button className="w-full" size="sm" onClick={() => onAction(swap.id, 'completed')}>
                        <CircleCheck className="mr-2 h-4 w-4"/> Mark as Completed
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
