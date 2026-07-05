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
  bulkDeleteMessages
} from "@/actions/messages";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface MessagesClientProps {
  initialMessages: Message[];
}

export default function MessagesClient({ initialMessages }: MessagesClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  // Deletion States
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState<string[] | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
        <button
          onClick={() => handleOpenMessage(row)}
          className={cn(
            "text-left hover:underline focus:outline-none font-bold",
            row.read ? "text-sage-800 font-medium" : "text-sage-950 font-extrabold"
          )}
        >
          {row.name}
        </button>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
      cell: (row) => <span className="font-light text-sage-600">{row.email}</span>,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (row) => <span className="font-light text-sage-600">{row.phone}</span>,
    },
    {
      header: "Submitted",
      accessorKey: "createdAt",
      sortable: true,
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
      <div>
        <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Client Queries</h1>
        <p className="text-sm text-sage-600 font-light mt-1">
          Review, sort, read, and manage all contact form inquiries submitted by website visitors.
        </p>
      </div>

      {/* Main Table view */}
      <DataTable
        columns={columns}
        data={messages}
        searchKey="name"
        searchPlaceholder="Search by sender name..."
        isLoading={isLoading}
        emptyStateText="No client queries found in your inbox."
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
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold text-sage-500 uppercase tracking-widest block mb-1">
                Query Details
              </span>
              <h3 className="font-serif font-bold text-2xl text-sage-950">{selectedMessage.name}</h3>
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
              <div className="flex items-center gap-2">
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
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`mailto:${selectedMessage.email}?subject=Booking Confirmation - Yogabhyasi&body=${encodeURIComponent(bookingNotes)}`}
                className="flex-grow"
              >
                <Button variant="primary" fullWidth className="rounded-xl flex items-center gap-2 justify-center py-2.5">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </Button>
              </Link>
              
              <Link
                href={`https://wa.me/${(selectedMessage.whatsapp || selectedMessage.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(bookingNotes)}`}
                target="_blank"
                className="flex-grow"
              >
                <Button variant="outline" fullWidth className="rounded-xl flex items-center gap-2 justify-center py-2.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                  <span className="text-sm">💬</span>
                  <span>Send WhatsApp</span>
                </Button>
              </Link>

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
