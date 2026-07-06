import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Sparkles,
  Users,
  MessageSquare,
  PlusCircle,
  Clock,
  ArrowRight
} from "lucide-react";

function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  const suffix = options?.addSuffix ? " ago" : "";
  if (interval >= 1) return interval + "y" + suffix;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mo" + suffix;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d" + suffix;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h" + suffix;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m" + suffix;
  return "just now";
}

// Keep dynamic imports to avoid static caching at build-time since it uses Prisma
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;

  // Fetch metrics
  const [unreadMessages, totalMessages, totalServices, totalTeamMembers, recentMessages, recentLogs] =
    await Promise.all([
      prisma.message.count({ where: { read: false } }),
      prisma.message.count(),
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const stats = [
    {
      label: "Unread Inbox",
      value: unreadMessages,
      icon: Mail,
      color: "text-amber-700 bg-amber-50 border-amber-100",
      description: "Requires attention",
    },
    {
      label: "All Queries",
      value: totalMessages,
      icon: MessageSquare,
      color: "text-sage-700 bg-sage-50 border-sage-100",
      description: "Lifetime inquiries",
    },
    {
      label: "Studio Services",
      value: totalServices,
      icon: Sparkles,
      color: "text-blue-700 bg-blue-50 border-blue-100",
      description: "Offered classes",
    },
    {
      label: "Wellness Guides",
      value: totalTeamMembers,
      icon: Users,
      color: "text-purple-700 bg-purple-50 border-purple-100",
      description: "Registered team",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-900 via-sage-950 to-sage-900 p-8 sm:p-10 shadow-lg shadow-sage-950/10 border border-sage-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#b89f5d,transparent_25%)] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#6f8576,transparent_30%)] opacity-15 pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10 max-w-xl">
          <span className="text-[9px] font-bold tracking-widest text-gold-400 uppercase bg-gold-600/10 border border-gold-500/20 px-3 py-1 rounded-full inline-block">
            Yogabhyasi Portal
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-sand-50 tracking-wide mt-3">Welcome Back, Admin</h1>
          <p className="text-xs sm:text-sm text-sage-300 font-light leading-relaxed">
            Monitor client inquiries, curriculum listings, and instructor guides inside the management portal.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link href={`/${adminPath}/messages`}>
            <Button variant="gold" className="rounded-xl font-semibold text-xs tracking-wide shadow-lg shadow-gold-700/15 py-3 px-5 hover:scale-[1.02]">
              Unread Inbox ({unreadMessages})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              variant="glass"
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-sage-100/80 hover:border-sage-200 transition-all hover:shadow-md hover:shadow-sage-900/5 group"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-sage-950 pt-1 tracking-tight">{stat.value}</h3>
                <p className="text-[10px] text-sage-500 font-light leading-none">{stat.description}</p>
              </div>
              <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Actions & Inbox */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Management Actions */}
          <Card variant="glass" className="p-6 border border-sage-100/80">
            <h3 className="font-serif font-bold text-lg text-sage-950 mb-4">Quick Management Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href={`/${adminPath}/services?action=new`}>
                <div className="flex items-center gap-3.5 p-4 rounded-xl border border-sage-100/70 bg-white/45 hover:bg-white hover:border-sage-300 hover:shadow-md hover:shadow-sage-950/5 transition-all duration-300 cursor-pointer group">
                  <div className="p-2 rounded-lg bg-sage-50 text-sage-600 border border-sage-100 shrink-0 group-hover:bg-sage-600 group-hover:text-sand-50 transition-all">
                    <PlusCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sage-800">Add Service</p>
                    <p className="text-[9px] text-sage-400 font-light leading-none mt-0.5">Program listing</p>
                  </div>
                </div>
              </Link>
              <Link href={`/${adminPath}/team?action=new`}>
                <div className="flex items-center gap-3.5 p-4 rounded-xl border border-sage-100/70 bg-white/45 hover:bg-white hover:border-sage-300 hover:shadow-md hover:shadow-sage-950/5 transition-all duration-300 cursor-pointer group">
                  <div className="p-2 rounded-lg bg-sage-50 text-sage-600 border border-sage-100 shrink-0 group-hover:bg-sage-600 group-hover:text-sand-50 transition-all">
                    <PlusCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sage-800">Add Guide</p>
                    <p className="text-[9px] text-sage-400 font-light leading-none mt-0.5">Teacher profile</p>
                  </div>
                </div>
              </Link>
              <Link href={`/${adminPath}/messages`}>
                <div className="flex items-center gap-3.5 p-4 rounded-xl border border-sage-100/70 bg-white/45 hover:bg-white hover:border-sage-300 hover:shadow-md hover:shadow-sage-950/5 transition-all duration-300 cursor-pointer group">
                  <div className="p-2 rounded-lg bg-sage-50 text-sage-600 border border-sage-100 shrink-0 group-hover:bg-sage-600 group-hover:text-sand-50 transition-all">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sage-800">View Inbox</p>
                    <p className="text-[9px] text-sage-400 font-light leading-none mt-0.5">Recent inquiries</p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>

          {/* Inbox Queries Card */}
          <Card variant="glass" className="p-6 border border-sage-100/80">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-sage-950">Inbox Queries</h3>
                <p className="text-xs text-sage-500 font-light mt-0.5">Latest client booking requests and messages</p>
              </div>
              <Link href={`/${adminPath}/messages`} className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 group">
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-sage-400 text-center py-8">No recent queries.</p>
              ) : (
                recentMessages.map((msg: any) => (
                  <div key={msg.id} className="p-4 bg-white/40 rounded-2xl border border-sage-100 hover:border-sage-200 transition-all duration-200 flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-serif text-sm font-bold uppercase shrink-0 border border-sage-200/40">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-sage-950 truncate">{msg.name}</p>
                        <span className="text-[9px] font-semibold text-sage-400 shrink-0 font-light flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[11px] text-sage-600 line-clamp-2 mt-1 leading-normal">"{msg.message}"</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-sage-100/50">
                        <div className="flex gap-2 text-[9px] font-semibold text-sage-500">
                          <span>{msg.email}</span>
                          <span>•</span>
                          <span>{msg.phone}</span>
                        </div>
                        
                        {msg.replied ? (
                          <span className="inline-flex items-center text-[9px] font-semibold text-green-700 bg-green-50 border border-green-200/50 rounded-full px-2 py-0.5">
                            Action Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/50 rounded-full px-2 py-0.5">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Security & Activity Log */}
        <div className="lg:col-span-4">
          <Card variant="glass" className="p-6 border border-sage-100/80 flex flex-col h-full">
            <div>
              <h3 className="font-serif font-bold text-lg text-sage-950">Security & Activity Log</h3>
              <p className="text-xs text-sage-500 font-light mt-0.5">Real-time audit trailing of administrative changes</p>
            </div>
            
            <div className="mt-6 relative pl-4 border-l border-sage-100 space-y-6 flex-1">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-sage-400 text-center py-8 pl-0">No recent activities logged.</p>
              ) : (
                recentLogs.map((log: any) => (
                  <div key={log.id} className="relative text-xs text-sage-600">
                    {/* Timeline Dot Indicator */}
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-sage-400 ring-4 ring-white shadow-sm" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sage-950 leading-none">{log.action}</p>
                        <span className="text-[8px] text-sage-400 font-light font-mono leading-none shrink-0">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[10px] text-sage-500 leading-normal">{log.details}</p>
                      <p className="text-[9px] font-semibold text-sage-400/85 uppercase tracking-wider pt-0.5">
                        Admin: {log.adminEmail || "System"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
