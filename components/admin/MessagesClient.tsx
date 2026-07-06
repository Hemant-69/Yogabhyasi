"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import DataTable, { Column } from "./DataTable";
import ConfirmDialog from "./ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  MailOpen,
  Trash2,
  ExternalLink,
  Calendar,
  Phone,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";
function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
import { toast } from "sonner";
import {
  markMessageAsRead,
  deleteMessage,
  bulkDeleteMessages,
  sendClientReplyEmail,
  toggleMessageReplied,
  recordWhatsAppClick,
  getAllMessages
} from "@/actions/messages";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MessageAction {
  id: string;
  type: string;
  details?: string | null;
  adminEmail: string;
  createdAt: Date | string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  replyMethod?: string | null;
  createdAt: Date;
  actions?: MessageAction[];
}

interface MessagesClientProps {
  initialMessages: Message[];
}

export default function MessagesClient({ initialMessages }: MessagesClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Deletion States
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState<string[] | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const isDateTimeProvided = !!bookingDate && !!bookingTime;

  useEffect(() => {
    if (selectedMessage) {
      const dateStr = bookingDate
        ? new Date(bookingDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "[Date]";
      const timeStr = bookingTime
        ? new Date(`2000-01-01T${bookingTime}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "[Time]";
      
      setBookingNotes(
        `Hi ${selectedMessage.name},\n\nThank you for reaching out to Yogabhyasi Wellness Sanctuary!\n\nWe would love to book your session slot on ${dateStr} at ${timeStr}.\n\nPlease let us know if this works for you.\n\nWarm regards,\nYogabhyasi Team`
      );
    }
  }, [selectedMessage, bookingDate, bookingTime]);

  // Background Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      // Skip polling if the window tab is hidden or action is processing
      if (document.hidden || isSendingEmail || isLoading) return;

      try {
        const result = await getAllMessages();
        if (result.success && result.messages) {
          setMessages((prev) => {
            const hasChanged = JSON.stringify(prev) !== JSON.stringify(result.messages);
            if (hasChanged) {
              // Update selectedMessage reference to keep detail modal timeline synced
              if (selectedMessage) {
                const updatedSel = result.messages.find((m: any) => m.id === selectedMessage.id);
                if (updatedSel) {
                  setSelectedMessage(updatedSel);
                }
              }
              return result.messages as any[];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Failed to poll messages:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedMessage, isSendingEmail, isLoading]);

  const updateLocalStatus = (
    isReplied: boolean,
    replyMethod: string | null,
    newAction?: MessageAction
  ) => {
    if (!selectedMessage) return;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMessage.id) return m;
        const currentActions = m.actions || [];
        const updatedActions = newAction 
          ? [newAction, ...currentActions] 
          : currentActions;
        return {
          ...m,
          replied: isReplied,
          replyMethod,
          read: true,
          actions: updatedActions,
        };
      })
    );
    setSelectedMessage((prev) => {
      if (!prev) return null;
      const currentActions = prev.actions || [];
      const updatedActions = newAction 
        ? [newAction, ...currentActions] 
        : currentActions;
      return {
        ...prev,
        replied: isReplied,
        replyMethod,
        read: true,
        actions: updatedActions,
      };
    });
  };

  const handleSendEmail = async () => {
    if (!selectedMessage) return;
    setIsSendingEmail(true);
    try {
      const result = await sendClientReplyEmail(
        selectedMessage.id,
        selectedMessage.email,
        selectedMessage.name,
        "Booking Confirmation - Yogabhyasi",
        bookingNotes
      );

      if (result.success) {
        toast.success(`Email sent successfully to ${selectedMessage.name}!`);
        
        // Auto-mark as read locally and in DB
        if (!selectedMessage.read) {
          await markMessageAsRead(selectedMessage.id, true);
        }

        const mockAction: MessageAction = {
          id: Math.random().toString(),
          type: "EMAIL",
          details: bookingNotes,
          adminEmail: "You",
          createdAt: new Date(),
        };

        updateLocalStatus(true, "EMAIL", mockAction);
        setIsDetailOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending the email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleWaClick = async () => {
    if (!selectedMessage) return;
    try {
      const result = await recordWhatsAppClick(selectedMessage.id, bookingNotes);
      if (result.success) {
        if (!selectedMessage.read) {
          await markMessageAsRead(selectedMessage.id, true);
        }

        const mockAction: MessageAction = {
          id: Math.random().toString(),
          type: "WHATSAPP",
          details: bookingNotes,
          adminEmail: "You",
          createdAt: new Date(),
        };

        updateLocalStatus(true, "WHATSAPP", mockAction);
        setIsDetailOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setIsDetailOpen(true);

    if (!msg.read) {
      // Mark as read in DB via Server Action
      const result = await markMessageAsRead(msg.id, true);
      if (result.success) {
        // Update local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
        router.refresh();
      }
    }
  };

  const handleToggleRead = async (msg: Message, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    const newReadState = !msg.read;
    const result = await markMessageAsRead(msg.id, newReadState);
    setIsLoading(false);

    if (result.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: newReadState } : m))
      );
      toast.success(newReadState ? "Message marked as read" : "Message marked as unread");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update read status.");
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteTargetId) return;
    const result = await deleteMessage(deleteTargetId);
    if (result.success) {
      setMessages((prev) => prev.filter((m) => m.id !== deleteTargetId));
      toast.success("Message deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete message.");
    }
  };

  const handleBulkDelete = async () => {
    if (!bulkDeleteTargets || bulkDeleteTargets.length === 0) return;
    const result = await bulkDeleteMessages(bulkDeleteTargets);
    if (result.success) {
      setMessages((prev) => prev.filter((m) => !bulkDeleteTargets.includes(m.id)));
      toast.success(`Successfully deleted ${result.count} messages.`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete messages.");
    }
  };

  const columns: Column<Message>[] = [
    {
      header: "Status",
      accessorKey: "read",
      sortable: true,
      cell: (row) => (
        <button
          onClick={(e) => handleToggleRead(row, e)}
          className="flex items-center gap-1.5 focus:outline-none"
        >
          {row.read ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sage-600 bg-sage-50 border border-sage-100 rounded-full px-2 py-0.5">
              <MailOpen className="h-3 w-3" />
              <span>Read</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold-700 bg-gold-50 border border-gold-150 rounded-full px-2 py-0.5 animate-pulse">
              <Mail className="h-3 w-3" />
              <span>New</span>
            </span>
          )}
        </button>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => handleOpenMessage(row)}
            className={cn(
              "text-left hover:underline focus:outline-none font-bold",
              row.read ? "text-sage-800 font-medium" : "text-sage-950 font-extrabold"
            )}
          >
            {row.name}
          </button>
          {row.replied && (
            <div className="flex flex-wrap gap-1 mt-1">
              {row.actions && row.actions.length > 0 ? (
                Array.from(new Set(row.actions.map(a => a.type.replace("MANUAL_RESOLVE_", "")))).map(type => (
                  <span key={type} className={cn(
                    "inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider w-max px-1.5 py-0.5 rounded-md",
                    type === "EMAIL"
                      ? "bg-sky-50 text-sky-700 border border-sky-100"
                      : type === "WHATSAPP"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-sage-50 text-sage-700 border border-sage-100"
                  )}>
                    {type === "EMAIL" ? "📧 Email" : type === "WHATSAPP" ? "💬 WhatsApp" : "✅ Resolved"}
                  </span>
                ))
              ) : row.replyMethod ? (
                <span className={cn(
                  "inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider w-max px-1.5 py-0.5 rounded-md",
                  row.replyMethod === "EMAIL"
                    ? "bg-sky-50 text-sky-700 border border-sky-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                )}>
                  {row.replyMethod === "EMAIL" ? "📧 Email" : "💬 WhatsApp"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider w-max px-1.5 py-0.5 rounded-md bg-sage-50 text-sage-700 border border-sage-100">
                  ✅ Resolved
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
      className: "hidden md:table-cell",
      cell: (row) => <span className="font-light text-sage-600">{row.email}</span>,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      className: "hidden lg:table-cell",
      cell: (row) => <span className="font-light text-sage-600">{row.phone}</span>,
    },
    {
      header: "Submitted",
      accessorKey: "createdAt",
      sortable: true,
      className: "hidden sm:table-cell",
      cell: (row) => (
        <span className="text-xs text-sage-500 font-light">
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenMessage(row)}
            className="p-1 text-sage-500 hover:text-sage-900 hover:bg-sage-50 rounded transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setDeleteTargetId(row.id);
              setIsDeleteOpen(true);
            }}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Client Queries</h1>
          <p className="text-sm text-sage-600 font-light mt-1">
            Review, sort, read, and manage all contact form inquiries submitted by visitors.
          </p>
        </div>
      </div>

      {/* Tab Categories Switcher */}
      <div className="flex border-b border-sage-100 gap-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "pb-3 text-xs md:text-sm font-semibold tracking-wider uppercase border-b-2 transition-all relative focus:outline-none",
            activeTab === "pending"
              ? "border-gold-500 text-sage-950 font-bold"
              : "border-transparent text-sage-400 hover:text-sage-700"
          )}
        >
          No Action Done ({messages.filter((m) => !m.replied).length})
        </button>
        <button
          onClick={() => setActiveTab("resolved")}
          className={cn(
            "pb-3 text-xs md:text-sm font-semibold tracking-wider uppercase border-b-2 transition-all relative focus:outline-none",
            activeTab === "resolved"
              ? "border-gold-500 text-sage-950 font-bold"
              : "border-transparent text-sage-400 hover:text-sage-700"
          )}
        >
          Action Done ({messages.filter((m) => m.replied).length})
        </button>
      </div>

      {/* Main Table view */}
      <DataTable
        columns={columns}
        data={messages.filter((m) => activeTab === "resolved" ? m.replied : !m.replied)}
        searchKey="name"
        searchPlaceholder="Search by sender name..."
        isLoading={isLoading}
        emptyStateText={activeTab === "resolved" ? "No resolved queries found." : "No pending queries found."}
        bulkActionTrigger={(selectedRows) => (
          <Button
            variant="outline"
            onClick={() => {
              setBulkDeleteTargets(selectedRows.map((r) => r.id));
              setIsBulkDeleteOpen(true);
            }}
            className="text-red-600 hover:bg-red-50 hover:border-red-400/50 flex items-center gap-2 rounded-xl py-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Selected ({selectedRows.length})</span>
          </Button>
        )}
      />

      {/* Message details modal view */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} size="md">
        {selectedMessage && (
          <div className="space-y-6">
            {/* Header with resolve state switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sage-100 pb-3 gap-3">
              <div>
                <span className="text-[10px] font-bold text-sage-500 uppercase tracking-widest block mb-1">
                  Query Details
                </span>
                <h3 className="font-serif font-bold text-2xl text-sage-950">{selectedMessage.name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] text-sage-400 font-bold uppercase tracking-wider mr-1">Status:</span>
                <button
                  onClick={async () => {
                    const result = await toggleMessageReplied(selectedMessage.id, true, "EMAIL", "Marked resolved via Email (manual)");
                    if (result.success) {
                      const mockAction: MessageAction = {
                        id: Math.random().toString(),
                        type: "MANUAL_RESOLVE_EMAIL",
                        details: "Marked resolved via Email (manual)",
                        adminEmail: "You",
                        createdAt: new Date(),
                      };
                      updateLocalStatus(true, "EMAIL", mockAction);
                      toast.success("Query resolved via Email");
                    }
                  }}
                  className={cn(
                    "px-2 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wider transition-all",
                    selectedMessage.replied && selectedMessage.replyMethod === "EMAIL"
                      ? "bg-sky-50 border-sky-200 text-sky-700 font-bold"
                      : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
                  )}
                >
                  📧 Email
                </button>
                <button
                  onClick={async () => {
                    const result = await toggleMessageReplied(selectedMessage.id, true, "WHATSAPP", "Marked resolved via WhatsApp (manual)");
                    if (result.success) {
                      const mockAction: MessageAction = {
                        id: Math.random().toString(),
                        type: "MANUAL_RESOLVE_WHATSAPP",
                        details: "Marked resolved via WhatsApp (manual)",
                        adminEmail: "You",
                        createdAt: new Date(),
                      };
                      updateLocalStatus(true, "WHATSAPP", mockAction);
                      toast.success("Query resolved via WhatsApp");
                    }
                  }}
                  className={cn(
                    "px-2 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wider transition-all",
                    selectedMessage.replied && selectedMessage.replyMethod === "WHATSAPP"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold"
                      : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
                  )}
                >
                  💬 WhatsApp
                </button>
                {selectedMessage.replied && (
                  <button
                    onClick={async () => {
                      const result = await toggleMessageReplied(selectedMessage.id, false, null, "Status reset to pending");
                      if (result.success) {
                        const mockAction: MessageAction = {
                          id: Math.random().toString(),
                          type: "MANUAL_PENDING",
                          details: "Status reset to pending",
                          adminEmail: "You",
                          createdAt: new Date(),
                        };
                        updateLocalStatus(false, null, mockAction);
                        toast.success("Reset query status to Pending");
                      }
                    }}
                    className="px-2 py-1 rounded-lg border border-red-200 text-red-650 hover:bg-red-50 text-[9px] font-bold uppercase tracking-wider transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-sage-50/50 rounded-xl border border-sage-100 flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-sage-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-sage-400 font-bold">Email Address</p>
                  <p className="text-xs font-semibold text-sage-800 truncate">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="p-3 bg-sage-50/50 rounded-xl border border-sage-100 flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-sage-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-sage-400 font-bold">Phone Number</p>
                  <p className="text-xs font-semibold text-sage-800 truncate">{selectedMessage.phone}</p>
                </div>
              </div>
              <div className="p-3 bg-sage-50/50 rounded-xl border border-sage-100 flex items-center gap-3">
                <span className="text-sm shrink-0">💬</span>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-sage-400 font-bold">WhatsApp</p>
                  <p className="text-xs font-semibold text-sage-800 truncate">{selectedMessage.whatsapp || "Not provided"}</p>
                </div>
              </div>
              <div className="p-3 bg-sage-50/50 rounded-xl border border-sage-100 flex items-center gap-3">
                <Calendar className="h-4.5 w-4.5 text-sage-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-sage-400 font-bold">Submission Date</p>
                  <p className="text-xs font-semibold text-sage-800 truncate">
                    {formatDateTime(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-sage-400 font-bold block">
                Message Text
              </label>
              <div className="p-4 rounded-2xl bg-sand-100/50 border border-sage-100 text-sm text-sage-800 leading-relaxed font-light whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Booking Scheduler Section */}
            <div className="p-4 bg-sage-50/40 rounded-2xl border border-sage-100 space-y-4">
              <span className="text-[10px] font-bold text-sage-600 uppercase tracking-widest block">
                🗓️ Booking & Scheduling Coordinator
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Booking Date */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-sage-500 font-bold block">
                    Proposed Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-1 focus:ring-sage-500"
                  />
                </div>

                {/* Booking Time */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-sage-500 font-bold block">
                    Proposed Time
                  </label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-1 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Generated Message / Notes */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-sage-500 font-bold block">
                  Prefilled Reply Message
                </label>
                <textarea
                  rows={4}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-1 focus:ring-sage-500 resize-none font-light leading-relaxed"
                />
              </div>

              {/* Action Buttons inside Scheduler */}
              <div className="flex items-center justify-between gap-2">
                {/* Copy to Clipboard */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(bookingNotes);
                    toast.success("Booking details copied to clipboard.");
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-sage-700 bg-white border border-sage-200 hover:bg-sage-50 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>📋</span>
                  <span>Copy Reply Message</span>
                </button>

                {!isDateTimeProvided && (
                  <span className="text-[10px] text-amber-650 font-semibold flex items-center gap-1 animate-pulse">
                    ⚠️ Select Date & Time to send
                  </span>
                )}
              </div>
            </div>

            {/* Timeline Action History */}
            <div className="space-y-3 pt-1">
              <label className="text-[9px] uppercase tracking-wider text-sage-400 font-bold block">
                Action History / Timeline ({selectedMessage.actions?.length || 0})
              </label>
              {selectedMessage.actions && selectedMessage.actions.length > 0 ? (
                <div className="space-y-4 pl-3 border-l border-sage-100 ml-1 max-h-48 overflow-y-auto pr-1">
                  {selectedMessage.actions.map((act) => (
                    <div key={act.id} className="relative flex flex-col text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-sage-400 border border-white" />
                      
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sage-900">
                            {act.type === "EMAIL" && "📧 Sent reply via Email"}
                            {act.type === "WHATSAPP" && "💬 Opened WhatsApp chat link"}
                            {act.type === "MANUAL_RESOLVE_EMAIL" && "✅ Resolved via Email (manual)"}
                            {act.type === "MANUAL_RESOLVE_WHATSAPP" && "✅ Resolved via WhatsApp (manual)"}
                            {act.type === "MANUAL_PENDING" && "⏳ Reset status to Pending"}
                          </p>
                          <span className="text-[10px] text-sage-400 font-light shrink-0">
                            {new Date(act.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[9px] text-sage-400 font-medium mt-0.5">by {act.adminEmail}</p>
                        {act.details && (
                          <div className="mt-1 p-2 rounded-lg bg-sage-50 text-[10px] text-sage-600 border border-sage-100 max-h-24 overflow-y-auto whitespace-pre-wrap leading-normal font-light">
                            {act.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-sage-400 italic">No actions recorded on this query yet.</p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleSendEmail}
                disabled={isSendingEmail || !isDateTimeProvided}
                className="flex-grow rounded-xl flex items-center gap-2 justify-center py-2.5"
              >
                {isSendingEmail ? (
                  <div className="h-4 w-4 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </>
                )}
              </Button>
              
              {!isDateTimeProvided ? (
                <Button
                  variant="outline"
                  disabled
                  className="flex-grow rounded-xl flex items-center gap-2 justify-center py-2.5 border-sage-200 text-sage-400 bg-sage-50/50 cursor-not-allowed opacity-50"
                >
                  <span className="text-sm">💬</span>
                  <span>Send WhatsApp</span>
                </Button>
              ) : (
                <Link
                  href={`https://wa.me/${(selectedMessage.whatsapp || selectedMessage.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(bookingNotes)}`}
                  target="_blank"
                  onClick={handleWaClick}
                  className="flex-grow"
                >
                  <Button variant="outline" fullWidth className="rounded-xl flex items-center gap-2 justify-center py-2.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                    <span className="text-sm">💬</span>
                    <span>Send WhatsApp</span>
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setDeleteTargetId(selectedMessage.id);
                  setIsDetailOpen(false);
                  setIsDeleteOpen(true);
                }}
                className="text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation delete alert */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteMessage}
        title="Delete Query"
        description="Are you sure you want to delete this query? This action is permanent and cannot be undone."
      />

      {/* Confirmation bulk delete alert */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => {
          setIsBulkDeleteOpen(false);
          setBulkDeleteTargets(null);
        }}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Queries"
        description={`Are you sure you want to delete the ${bulkDeleteTargets?.length} selected queries? This will permanently delete them from the database.`}
      />
    </div>
  );
}
