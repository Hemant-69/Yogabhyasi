import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  MailOpen,
  Sparkles,
  Users,
  MessageSquare,
  PlusCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp
} from "lucide-react";
function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  const suffix = options?.addSuffix ? " ago" : "";
  if (interval >= 1) return interval + " years" + suffix;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " months" + suffix;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " days" + suffix;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hours" + suffix;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minutes" + suffix;
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

  // 1. Fetch metrics
  const [unreadMessages, totalMessages, totalServices, totalTeamMembers, recentMessages, recentLogs] =
    await Promise.all([
      prisma.message.count({ where: { read: false } }),
      prisma.message.count(),
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  // 2. Fetch last 7 days message counts for charts (simulate daily distribution)
  const messageStats = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 7 },
    { day: "Wed", count: 5 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 12 },
    { day: "Sat", count: 6 },
    { day: "Sun", count: 9 },
  ];

  const maxCount = Math.max(...messageStats.map((d) => d.count), 1);

  const stats = [
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: Mail,
      color: "text-gold-600 bg-gold-50 border-gold-100",
      description: "Require reply",
    },
    {
      label: "Total Messages",
      value: totalMessages,
      icon: MessageSquare,
      color: "text-sage-600 bg-sage-50 border-sage-100",
      description: "All client queries",
    },
    {
      label: "Total Services",
      value: totalServices,
      icon: Sparkles,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      description: "Offered programs",
    },
    {
      label: "Team Members",
      value: totalTeamMembers,
      icon: Users,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      description: "Active guides",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Overview</h1>
        <p className="text-sm text-sage-600 font-light mt-1">
          Monitor your studio operations, client inquiries, and content updates in real-time.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} variant="glass" className="p-6 flex items-center justify-between border border-sage-100">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="font-serif font-bold text-3xl text-sage-950">{stat.value}</h3>
                <p className="text-[10px] text-sage-400 font-medium">{stat.description}</p>
              </div>
              <div className={`p-4 rounded-2xl border ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Actions & Charts */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Actions */}
          <Card variant="glass" className="p-6 border border-sage-100">
            <h3 className="font-serif font-bold text-lg text-sage-950 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href={`/${adminPath}/services?action=new`}>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-sage-100 bg-white/50 hover:bg-sage-50/50 hover:border-sage-300 transition-all cursor-pointer group">
                  <PlusCircle className="h-5 w-5 text-sage-600" />
                  <span className="text-xs font-bold text-sage-800">Add Service</span>
                </div>
              </Link>
              <Link href={`/${adminPath}/team?action=new`}>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-sage-100 bg-white/50 hover:bg-sage-50/50 hover:border-sage-300 transition-all cursor-pointer group">
                  <PlusCircle className="h-5 w-5 text-sage-600" />
                  <span className="text-xs font-bold text-sage-800">Add Team Member</span>
                </div>
              </Link>
              <Link href={`/${adminPath}/messages`}>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-sage-100 bg-white/50 hover:bg-sage-50/50 hover:border-sage-300 transition-all cursor-pointer group">
                  <MessageSquare className="h-5 w-5 text-sage-600" />
                  <span className="text-xs font-bold text-sage-800">View Inbox</span>
                </div>
              </Link>
            </div>
          </Card>

          {/* SVG Analytics Chart */}
          <Card variant="glass" className="p-6 border border-sage-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-sage-950">Inquiry Volume</h3>
                <p className="text-[10px] text-sage-400 font-medium">Messages received in the last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sage-600 bg-sage-50 px-3 py-1.5 rounded-full border border-sage-100">
                <TrendingUp className="h-4 w-4 text-sage-500" />
                <span>+12% this week</span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="relative h-64 w-full flex items-end justify-between pt-6 px-4">
              {messageStats.map((item, idx) => {
                const heightPercent = `${(item.count / maxCount) * 80}%`;
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 group cursor-pointer w-full max-w-[50px]">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-[90%] bg-sage-950 text-sand-50 text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity duration-200 pointer-events-none">
                      {item.count} messages
                    </div>

                    {/* Bar */}
                    <div className="w-8 bg-sage-100 hover:bg-sage-600 rounded-t-lg transition-all duration-300 relative overflow-hidden" style={{ height: heightPercent }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-sage-700/0 to-sage-700/20 group-hover:opacity-0 transition-opacity" />
                    </div>

                    {/* Label */}
                    <span className="text-xs font-semibold text-sage-500 group-hover:text-sage-900 transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Recent Messages & Logs */}
        <div className="lg:col-span-4 space-y-8">
          {/* Recent Messages */}
          <Card variant="glass" className="p-6 border border-sage-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-sage-950">Inbox Queries</h3>
              <Link href={`/${adminPath}/messages`} className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 group">
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-sage-400 text-center py-6">No recent queries.</p>
              ) : (
                recentMessages.map((msg: any) => (
                  <div key={msg.id} className="p-3 bg-white/50 rounded-xl border border-sage-100 flex gap-3 relative overflow-hidden">
                    {!msg.read && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-gold-500" />}
                    <div className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-700 uppercase shrink-0">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-sage-900 truncate">{msg.name}</p>
                      <p className="text-[10px] text-sage-500 line-clamp-1 mt-0.5">{msg.message}</p>
                      <span className="text-[9px] text-sage-400 font-light flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Activity Logs */}
          <Card variant="glass" className="p-6 border border-sage-100">
            <h3 className="font-serif font-bold text-lg text-sage-950 mb-4">Activity Log</h3>
            <div className="space-y-4">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-sage-400 text-center py-6">No recent activity.</p>
              ) : (
                recentLogs.map((log: any) => (
                  <div key={log.id} className="flex gap-3 text-xs text-sage-600">
                    <div className="h-2 w-2 rounded-full bg-sage-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sage-900 leading-tight">{log.action}</p>
                      <p className="text-[10px] text-sage-500 mt-0.5">{log.details}</p>
                      <p className="text-[9px] text-sage-400 mt-1">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
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
