'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, Search, History, ChevronRight, ChevronLeft,
  Mail, PhoneCall, UserPlus, ExternalLink, ShieldCheck,
  Filter, X, UserCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function ClientLeads() {
  const { user, loading: authLoading, authChecked } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [historyDialog, setHistoryDialog] = useState<{ open: boolean; lead: any | null }>({ open: false, lead: null });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let url = `/api/leads?page=${pagination.page}&limit=10&search=${searchInput}&t=${Date.now()}`;
      if (statusFilter && statusFilter !== 'All') url += `&status=${statusFilter}`;
      const { data } = await axios.get(url);
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked && !authLoading && user) fetchLeads();
  }, [user, authChecked, authLoading, pagination.page, statusFilter, searchInput]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'VERIFIED': case 'PAID': return 'dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20 bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED': case 'CHARGEBACK': return 'dark:bg-rose-500/10 dark:text-rose-500 dark:border-rose-500/20 bg-rose-50 text-rose-700 border-rose-200';
      case 'PENDING': return 'dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20 bg-amber-50 text-amber-700 border-amber-200';
      case 'WORKING': return 'dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/20 bg-blue-50 text-blue-700 border-blue-200';
      default: return 'dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const LEAD_STATUSES = [
    "PENDING", "REJECTED", "VERIFIED", "PAID", "WORKING", "QC", "SENT_CLIENT"
  ];

  return (
    <DashboardLayout>
      {/* Background wrapper for dark mode to ensure true black bleed */}
      <div className="flex flex-col space-y-8 max-w-7xl mx-auto px-6 py-8 dark:bg-black min-h-screen transition-colors">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Lead Database</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage, filter, and track your lead conversions</p>
          </div>
          <div className="flex items-center gap-3">
             <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20 px-4 py-1.5 rounded-full flex gap-2 items-center">
              <ShieldCheck className="h-4 w-4" /> Database Encrypted
            </Badge>
            <Button 
              onClick={() => router.push('/leads/create')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:shadow-indigo-500/10 transition-all gap-2"
            >
              <UserPlus className="h-4 w-4" /> Add New Lead
            </Button>
          </div>
        </div>

        {/* Main Table Card - Adjusted to match VetoAxis Dark Theme */}
        <Card className="border-none shadow-md bg-white dark:bg-[#0A0A0A] dark:border dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-6 py-5 dark:bg-[#0F0F0F] border-b dark:border-zinc-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl flex items-center gap-2 font-bold text-slate-800 dark:text-zinc-100">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                  <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </span>
                Record Filters
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <Input 
                    placeholder="Search name, email, ID..." 
                    className="pl-10 w-full md:w-[280px] border-slate-200 dark:bg-black dark:border-zinc-800 dark:text-white dark:focus:ring-indigo-500/30" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                
                <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] border-slate-200 dark:bg-black dark:border-zinc-800 dark:text-white">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#0F0F0F] dark:border-zinc-800">
                    <SelectItem value="All">All Statuses</SelectItem>
                    {LEAD_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchInput || statusFilter) && (
                  <Button 
                    variant="ghost" 
                    onClick={() => { setSearchInput(''); setStatusFilter(''); }}
                    className="text-slate-400 hover:text-rose-600 dark:hover:bg-zinc-900"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-[#0F0F0F] border-b dark:border-zinc-800">
                <TableRow className="border-slate-100 dark:border-zinc-800">
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 px-6 py-4">Client Identity</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">Communication</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">Case Type</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">Buyer Code</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">Created By</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">Entry Date</TableHead>
                  <TableHead className="text-right px-6 dark:text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="dark:border-zinc-900">
                    <TableCell colSpan={8} className="h-64 text-center">
                      <Loader2 className="animate-spin mx-auto h-8 w-8 text-indigo-600" />
                    </TableCell>
                  </TableRow>
                ) : leads.map((lead) => (
                  <TableRow key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors border-slate-100 dark:border-zinc-900">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-100 dark:border-indigo-500/20">
                          {lead.firstName?.[0]}{lead.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-zinc-100">{lead.firstName} {lead.lastName}</div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold">#{lead._id.slice(-6)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-slate-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {lead.email}</div>
                        <div className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 mt-0.5"><PhoneCall className="h-3 w-3" /> {lead.phone}</div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm font-medium dark:text-zinc-300">{lead.applicationType || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-medium rounded-md px-2.5 py-0.5 ${getStatusStyle(lead.status)}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium dark:text-zinc-300">{lead.buyerCode || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                        <span className="text-sm font-medium dark:text-zinc-300">{lead.createdBy?.name || "System"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-zinc-400">
                      {format(new Date(lead.createdAt), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setHistoryDialog({ open: true, lead })} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:bg-zinc-800 rounded-lg"><History className="h-4 w-4" /></button>
                        <button onClick={() => router.push(`/leads/${lead._id}`)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:bg-zinc-800 rounded-lg"><ExternalLink className="h-4 w-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          
          <CardFooter className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 dark:bg-[#0F0F0F] border-t dark:border-zinc-800 gap-4">
            <div className="text-sm text-slate-500 dark:text-zinc-500 font-medium">
              Showing {((pagination.page - 1) * 10) + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} leads
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="dark:bg-black dark:border-zinc-800 dark:text-zinc-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="text-xs font-bold px-3 py-1 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 rounded">
                {pagination.page} / {pagination.pages || 1}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="dark:bg-black dark:border-zinc-800 dark:text-zinc-300"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* History Dialog with Dark Styling */}
      <Dialog open={historyDialog.open} onOpenChange={(open) => !open && setHistoryDialog({ open: false, lead: null })}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-none shadow-2xl dark:bg-[#0A0A0A] dark:border dark:border-zinc-800">
          <DialogHeader className="p-6 bg-slate-900 dark:bg-black text-white">
            <DialogTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" /> Activity History
            </DialogTitle>
            <DialogDescription className="text-slate-400 dark:text-zinc-500">
              Tracking timeline for {historyDialog.lead?.firstName} {historyDialog.lead?.lastName}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] p-6 bg-white dark:bg-[#0A0A0A]">
            <div className="space-y-6 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-slate-200 dark:bg-zinc-800" />
              {historyDialog.lead?.statusHistory?.map((log: any, i: number) => (
                <div key={i} className="relative pl-7 group">
                  <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-indigo-600 ring-2 ring-indigo-50 dark:ring-indigo-900/20" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Badge className="text-[10px] font-bold dark:bg-zinc-800 dark:text-zinc-300 border-none">{log.toStatus}</Badge>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 text-right">
                        {format(new Date(log.timestamp), 'MM/dd/yyyy hh:mm a')}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-black p-3 rounded-lg border dark:border-zinc-800">
                      {log.notes || "No notes."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 bg-slate-50 dark:bg-[#0F0F0F] border-t dark:border-zinc-800 flex justify-end">
            <Button onClick={() => setHistoryDialog({ open: false, lead: null })} className="dark:bg-black dark:border-zinc-800 dark:text-zinc-300" variant="outline">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}