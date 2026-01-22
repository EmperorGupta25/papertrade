import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Plus, 
  UserPlus, 
  Clock, 
  DollarSign,
  Crown,
  Medal,
  LogIn,
  X,
  Check,
  Send,
  Search,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, formatDistanceToNow, addDays, addWeeks, addMonths } from 'date-fns';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  display_name?: string;
  created_at: string;
}

interface Competition {
  id: string;
  name: string;
  creator_id: string;
  starting_balance: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  max_participants: number;
  participants?: Participant[];
}

interface Participant {
  id: string;
  user_id: string;
  display_name: string;
  balance: number;
  status: 'invited' | 'accepted' | 'declined' | 'left';
}

interface CompetitionsPanelProps {
  onOpenAuth: () => void;
}

export function CompetitionsPanel({ onOpenAuth }: CompetitionsPanelProps) {
  const { user, isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<Friend[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'active' | 'invites' | 'friends'>('active');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  
  // Create competition form
  const [competitionName, setCompetitionName] = useState('');
  const [startingBalance, setStartingBalance] = useState('10000');
  const [duration, setDuration] = useState('1_week');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const loadFriends = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;

      // Fetch display names for friends
      const friendsWithNames = await Promise.all((data || []).map(async (f) => {
        const friendUserId = f.user_id === user.id ? f.friend_id : f.user_id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', friendUserId)
          .single();

        return {
          ...f,
          display_name: profile?.display_name || 'Unknown',
          status: f.status as 'pending' | 'accepted' | 'rejected',
        };
      }));

      setFriends(friendsWithNames as Friend[]);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  }, [user]);

  const loadPendingFriendRequests = useCallback(async () => {
    if (!user?.id) {
      console.log('[FriendRequests] No user id, skipping load');
      return;
    }

    console.log('[FriendRequests] Loading pending requests for user:', user.id);

    try {
      // Get pending requests where current user is the recipient (friend_id)
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      console.log('[FriendRequests] Query result:', { data, error });

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log('[FriendRequests] No pending requests found');
        setPendingFriendRequests([]);
        return;
      }

      // Fetch display names for the requesters
      const requestsWithNames = await Promise.all(data.map(async (f) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', f.user_id)
          .single();

        return {
          ...f,
          display_name: profile?.display_name || 'Unknown',
          status: f.status as 'pending' | 'accepted' | 'rejected',
        };
      }));

      console.log('[FriendRequests] Requests with names:', requestsWithNames);
      setPendingFriendRequests(requestsWithNames as Friend[]);
    } catch (error) {
      console.error('[FriendRequests] Error loading pending friend requests:', error);
    }
  }, [user]);

  const loadCompetitions = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: comps, error } = await supabase
        .from('competitions')
        .select(`
          *,
          competition_participants (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userComps = (comps || []).map((c: any) => ({
        ...c,
        participants: c.competition_participants,
      }));

      // Separate active competitions from invites
      const active = userComps.filter((c: Competition) =>
        c.participants?.some((p: Participant) => p.user_id === user.id && p.status === 'accepted') ||
        c.creator_id === user.id
      );

      const invites = userComps.filter((c: Competition) =>
        c.participants?.some((p: Participant) => p.user_id === user.id && p.status === 'invited')
      );

      setCompetitions(active);
      setPendingInvites(invites);
    } catch (error) {
      console.error('Error loading competitions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadFriends();
    loadPendingFriendRequests();
    loadCompetitions();
  }, [isAuthenticated, loadCompetitions, loadFriends, loadPendingFriendRequests]);

  // If a user has incoming friend requests, don't hide them behind the default "Active" tab.
  useEffect(() => {
    if (!isAuthenticated) return;
    if (pendingFriendRequests.length > 0) setActiveSection('friends');
  }, [isAuthenticated, pendingFriendRequests.length]);

  // Keep pending friend requests fresh so recipients see invites without a full reload.
  useEffect(() => {
    if (!isAuthenticated) return;

    // Poll lightly (covers cases where realtime isn't configured)
    const interval = window.setInterval(() => {
      loadPendingFriendRequests();
    }, 8000);

    // Also refresh when the tab regains focus
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadPendingFriendRequests();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isAuthenticated, loadPendingFriendRequests]);

  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    if (!user) return;

    try {
      if (accept) {
        const { error } = await supabase
          .from('friends')
          .update({ status: 'accepted' })
          .eq('id', friendshipId);

        if (error) throw error;
        toast.success('Friend request accepted!');
      } else {
        const { error } = await supabase
          .from('friends')
          .delete()
          .eq('id', friendshipId);

        if (error) throw error;
        toast.info('Friend request declined');
      }

      loadFriends();
      loadPendingFriendRequests();
    } catch (error) {
      console.error('Error responding to friend request:', error);
      toast.error('Failed to respond to friend request');
    }
  };

  // (loadCompetitions moved to useCallback above)

  const sendFriendRequest = async () => {
    if (!user || !friendSearch.trim()) return;

    try {
      // Find user by display name
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .ilike('display_name', friendSearch.trim());

      if (searchError) throw searchError;
      if (!profiles || profiles.length === 0) {
        toast.error('User not found');
        return;
      }

      const friendProfile = profiles[0];
      if (friendProfile.user_id === user.id) {
        toast.error("You can't add yourself as a friend");
        return;
      }

      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendProfile.user_id,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Friend request already sent');
        } else {
          throw error;
        }
        return;
      }

      toast.success(`Friend request sent to ${friendProfile.display_name}`);
      setFriendSearch('');
      setShowAddFriendDialog(false);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const createCompetition = async () => {
    if (!user || !competitionName.trim() || selectedFriends.length === 0) {
      toast.error('Please fill in all fields and select at least one friend');
      return;
    }

    try {
      const now = new Date();
      let endDate: Date;
      
      switch (duration) {
        case '1_day': endDate = addDays(now, 1); break;
        case '3_days': endDate = addDays(now, 3); break;
        case '1_week': endDate = addWeeks(now, 1); break;
        case '2_weeks': endDate = addWeeks(now, 2); break;
        case '1_month': endDate = addMonths(now, 1); break;
        default: endDate = addWeeks(now, 1);
      }

      const { data: competition, error: compError } = await supabase
        .from('competitions')
        .insert({
          name: competitionName.trim(),
          creator_id: user.id,
          starting_balance: parseFloat(startingBalance),
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          max_participants: Math.min(selectedFriends.length + 1, 10),
          status: 'active'
        })
        .select()
        .single();

      if (compError) throw compError;

      // Add creator as participant
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('competition_participants')
        .insert({
          competition_id: competition.id,
          user_id: user.id,
          display_name: profile?.display_name || 'Creator',
          balance: parseFloat(startingBalance),
          status: 'accepted',
          joined_at: now.toISOString()
        });

      // Invite selected friends
      const friendInvites = selectedFriends.map(friendId => ({
        competition_id: competition.id,
        user_id: friendId,
        balance: parseFloat(startingBalance),
        status: 'invited'
      }));

      await supabase
        .from('competition_participants')
        .insert(friendInvites);

      toast.success('Competition created! Invites sent to friends.');
      setShowCreateDialog(false);
      setCompetitionName('');
      setSelectedFriends([]);
      loadCompetitions();
    } catch (error) {
      console.error('Error creating competition:', error);
      toast.error('Failed to create competition');
    }
  };

  const respondToInvite = async (competitionId: string, accept: boolean) => {
    if (!user) return;

    try {
      if (accept) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .single();

        await supabase
          .from('competition_participants')
          .update({
            status: 'accepted',
            display_name: profile?.display_name || 'Participant',
            joined_at: new Date().toISOString()
          })
          .eq('competition_id', competitionId)
          .eq('user_id', user.id);

        toast.success('Joined competition!');
      } else {
        await supabase
          .from('competition_participants')
          .update({ status: 'declined' })
          .eq('competition_id', competitionId)
          .eq('user_id', user.id);

        toast.info('Declined competition invite');
      }

      loadCompetitions();
    } catch (error) {
      console.error('Error responding to invite:', error);
      toast.error('Failed to respond to invite');
    }
  };

  const leaveCompetition = async (competitionId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('competition_participants')
        .update({ status: 'left' })
        .eq('competition_id', competitionId)
        .eq('user_id', user.id);

      toast.info('Left the competition');
      loadCompetitions();
    } catch (error) {
      console.error('Error leaving competition:', error);
      toast.error('Failed to leave competition');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Compete with Friends</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to create competitions, add friends, and see who's the best trader!
            </p>
            <Button onClick={onOpenAuth} size="lg">
              <LogIn className="h-5 w-5 mr-2" />
              Sign In to Compete
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Competitions
        </h1>
        <div className="flex gap-2">
          <Dialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogDescription>
                  Search for a user by their display name to send a friend request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter username..."
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={sendFriendRequest}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Competition
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-w-md">
              <DialogHeader>
                <DialogTitle>Create Competition</DialogTitle>
                <DialogDescription>
                  Challenge your friends to a trading competition!
                </DialogDescription>
              </DialogHeader>
              
              <Alert className="border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertTitle className="text-warning text-sm">Warning</AlertTitle>
                <AlertDescription className="text-warning/80 text-xs">
                  Joining a competition will reset participants' progress. Portfolio reset is disabled during competitions.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="comp-name">Competition Name</Label>
                  <Input
                    id="comp-name"
                    placeholder="e.g., Weekly Trading Challenge"
                    value={competitionName}
                    onChange={(e) => setCompetitionName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="starting-balance">Starting Balance</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="starting-balance"
                      type="number"
                      value={startingBalance}
                      onChange={(e) => setStartingBalance(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      <SelectItem value="1_day">1 Day</SelectItem>
                      <SelectItem value="3_days">3 Days</SelectItem>
                      <SelectItem value="1_week">1 Week</SelectItem>
                      <SelectItem value="2_weeks">2 Weeks</SelectItem>
                      <SelectItem value="1_month">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Invite Friends ({selectedFriends.length}/9 max)</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {friends.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No friends yet. Add some friends first!
                      </p>
                    ) : (
                      friends.map((friend) => {
                        const friendId = friend.user_id === user?.id ? friend.friend_id : friend.user_id;
                        const isSelected = selectedFriends.includes(friendId);
                        
                        return (
                          <button
                            key={friend.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedFriends(prev => prev.filter(id => id !== friendId));
                              } else if (selectedFriends.length < 9) {
                                setSelectedFriends(prev => [...prev, friendId]);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                              isSelected ? 'bg-primary/20 border border-primary' : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            <span className="text-sm">{friend.display_name}</span>
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={createCompetition}
                  disabled={!competitionName.trim() || selectedFriends.length === 0}
                >
                  Create & Send Invites
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="invites">
            Invites
            {pendingInvites.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {pendingInvites.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="friends">
            Friends
            {pendingFriendRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {pendingFriendRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {competitions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No active competitions</p>
                <p className="text-sm">Create one to challenge your friends!</p>
              </CardContent>
            </Card>
          ) : (
            competitions.map((comp) => (
              <CompetitionCard 
                key={comp.id} 
                competition={comp} 
                userId={user?.id || ''} 
                onLeave={leaveCompetition}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="invites" className="space-y-4 mt-4">
          {pendingInvites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending invites</p>
              </CardContent>
            </Card>
          ) : (
            pendingInvites.map((comp) => (
              <Card key={comp.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{comp.name}</CardTitle>
                      <CardDescription>
                        ${comp.starting_balance.toLocaleString()} starting balance • Ends {formatDistanceToNow(new Date(comp.end_date), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => respondToInvite(comp.id, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => respondToInvite(comp.id, true)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="friends" className="space-y-4 mt-4">
          {/* Pending Friend Requests */}
          {pendingFriendRequests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
              {pendingFriendRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <span className="font-medium">{request.display_name}</span>
                        <p className="text-xs text-muted-foreground">wants to be your friend</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => respondToFriendRequest(request.id, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => respondToFriendRequest(request.id, true)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Accepted Friends */}
          {friends.length === 0 && pendingFriendRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No friends yet</p>
                <p className="text-sm">Add friends to start competing!</p>
              </CardContent>
            </Card>
          ) : friends.length > 0 && (
            <div className="space-y-2">
              {pendingFriendRequests.length > 0 && (
                <p className="text-sm font-medium text-muted-foreground">Your Friends</p>
              )}
              <div className="grid gap-2">
                {friends.map((friend) => (
                  <Card key={friend.id}>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{friend.display_name}</span>
                      </div>
                      <Badge variant="secondary">Friend</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CompetitionCard({ 
  competition, 
  userId, 
  onLeave 
}: { 
  competition: Competition; 
  userId: string;
  onLeave: (id: string) => void;
}) {
  const participants = competition.participants?.filter(p => p.status === 'accepted') || [];
  const sortedParticipants = [...participants].sort((a, b) => b.balance - a.balance);
  const isCreator = competition.creator_id === userId;
  const timeLeft = formatDistanceToNow(new Date(competition.end_date), { addSuffix: true });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {competition.name}
              {competition.status === 'active' && (
                <Badge className="bg-profit/20 text-profit border-profit/30">Active</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {competition.starting_balance.toLocaleString()} start
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ends {timeLeft}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participants.length} participants
              </span>
            </CardDescription>
          </div>
          {!isCreator && (
            <Button variant="outline" size="sm" onClick={() => onLeave(competition.id)}>
              Leave
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Leaderboard</p>
          {sortedParticipants.map((p, index) => {
            const pnl = p.balance - competition.starting_balance;
            const pnlPercent = (pnl / competition.starting_balance) * 100;
            const isUser = p.user_id === userId;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isUser ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-yellow-950' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-600 text-orange-100' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index === 0 ? <Crown className="h-3 w-3" /> : index + 1}
                  </div>
                  <span className={`font-medium ${isUser ? 'text-primary' : ''}`}>
                    {p.display_name || 'Unknown'}
                    {isUser && ' (You)'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${p.balance.toLocaleString()}</p>
                  <p className={`text-xs ${pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
