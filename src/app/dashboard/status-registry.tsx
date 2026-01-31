"use client";

import React from 'react';
import { 
  Clock, XCircle, CheckCircle, DollarSign, AlertTriangle, 
  Copy, PhoneOff, ShieldAlert, TimerOff, FastForward, 
  PhoneCall, Clock1, Clock2, Clock3, Clock4, CreditCard, 
  FileQuestion, ArrowUpRight, Search, BadgeCheck, Zap, 
  FileText, Timer 
} from 'lucide-react';

// Centralized status configuration for the entire CRM
export const STATUS_CONFIG: Record<string, { icon: React.ReactNode, color: string, description: string }> = {
  PENDING: { icon: <Clock />, color: '#f59e0b', description: 'Awaiting initial system review' },
  REJECTED: { icon: <XCircle />, color: '#ef4444', description: 'Disqualified lead parameters' },
  VERIFIED: { icon: <CheckCircle />, color: '#10b981', description: 'Data points fully validated' },
  REJECTED_BY_CLIENT: { icon: <AlertTriangle />, color: '#f97316', description: 'External client rejection' },
  PAID: { icon: <DollarSign />, color: '#8b5cf6', description: 'Revenue transaction complete' },
  DUPLICATE: { icon: <Copy />, color: '#a855f7', description: 'Redundant entry detected' },
  NOT_RESPONDING: { icon: <PhoneOff />, color: '#737373', description: 'Communication attempts failed' },
  FELONY: { icon: <ShieldAlert />, color: '#dc2626', description: 'Legal eligibility restriction' },
  DEAD_LEAD: { icon: <TimerOff />, color: '#404040', description: 'Lead non-conversion state' },
  WORKING: { icon: <FastForward />, color: '#3b82f6', description: 'Active pipeline progression' },
  CALL_BACK: { icon: <PhoneCall />, color: '#06b6d4', description: 'Scheduled follow-up sequence' },
  ATTEMPT_1: { icon: <Clock1 />, color: '#6366f1', description: 'Initial outreach attempt' },
  ATTEMPT_2: { icon: <Clock2 />, color: '#4f46e5', description: 'Secondary contact phase' },
  ATTEMPT_3: { icon: <Clock3 />, color: '#4338ca', description: 'Tertiary contact phase' },
  ATTEMPT_4: { icon: <Clock4 />, color: '#3730a3', description: 'Final outreach protocol' },
  CHARGEBACK: { icon: <CreditCard />, color: '#be123c', description: 'Financial reversal alert' },
  WAITING_ID: { icon: <FileQuestion />, color: '#d97706', description: 'Pending identity documents' },
  SENT_CLIENT: { icon: <ArrowUpRight />, color: '#059669', description: 'Transferred to client portal' },
  QC: { icon: <Search />, color: '#7c3aed', description: 'Quality assurance evaluation' },
  ID_VERIFIED: { icon: <BadgeCheck />, color: '#16a34a', description: 'Confirmed identity status' },
  BILLABLE: { icon: <Zap />, color: '#10b981', description: 'Validated for invoicing' },
  CAMPAIGN_PAUSED: { icon: <Timer />, color: '#737373', description: 'Active campaign on hold' },
  SENT_TO_LAW_FIRM: { icon: <FileText />, color: '#8b5cf6', description: 'Transferred to legal council' }
};

// Logical buckets for high-level metrics
export const BUCKETS = {
  PIPELINE: ["WORKING", "QC", "ATTEMPT_1", "ATTEMPT_2", "ATTEMPT_3", "ATTEMPT_4", "CALL_BACK"],
  CONVERSION: ["VERIFIED", "ID_VERIFIED", "SENT_CLIENT", "PAID", "BILLABLE", "SENT_TO_LAW_FIRM"],
  RISK: ["REJECTED", "REJECTED_BY_CLIENT", "DUPLICATE", "NOT_RESPONDING", "FELONY", "DEAD_LEAD", "CHARGEBACK"]
};