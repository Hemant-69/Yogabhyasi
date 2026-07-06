"use client";

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "./DataTable";
import ConfirmDialog from "./ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  reorderTeam
} from "@/actions/team";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Compass,
  Sparkles,
  Info,
  GripVertical
} from "lucide-react";
import Image from "next/image";



interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  objectPosition: string;
  transform: string | null;
  transformHover: string | null;
  displayOrder: number;
  status: boolean;
}

interface TeamClientProps {
  initialMembers: TeamMember[];
}

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photo: z.string().min(1, "Photo is required"),
  objectPosition: z.string(),
  transform: z.string().transform((v) => (v === "" ? null : v)).nullable().optional(),
  transformHover: z.string().transform((v) => (v === "" ? null : v)).nullable().optional(),
  displayOrder: z.number(),
  status: z.boolean(),
});

type TeamFormValues = z.infer<typeof teamMemberSchema>;

export default function TeamClient({ initialMembers }: TeamClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  // Modals / Forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Deletion States
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reordering States
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [tempList, setTempList] = useState<TeamMember[]>([]);

  const handleOpenReorder = () => {
    const sorted = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
    setTempList(sorted);
    setIsReorderOpen(true);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const listCopy = [...tempList];
    const itemToMove = listCopy[draggedIndex];
    listCopy.splice(draggedIndex, 1);
    listCopy.splice(index, 0, itemToMove);

    setDraggedIndex(index);
    setTempList(listCopy);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orderedIds = tempList.map((m) => m.id);
      const result = await reorderTeam(orderedIds);
      if (result.success) {
        toast.success("Team order saved successfully.");
        setMembers(
          tempList.map((item, idx) => ({ ...item, displayOrder: idx }))
        );
        setIsReorderOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save team order.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving display order.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      photo: "",
      objectPosition: "center",
      transform: "",
      transformHover: "",
      displayOrder: 0,
      status: true,
    },
  });

  const watchAll = watch();

  // Handle URL shortcut triggers (e.g. ?action=new)
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      handleAddClick();
      router.replace(window.location.pathname);
    }
  }, [searchParams]);

  const handleAddClick = () => {
    setEditingMember(null);
    reset({
      name: "",
      role: "",
      bio: "",
      photo: "",
      objectPosition: "center",
      transform: "",
      transformHover: "",
      displayOrder: members.length,
      status: true,
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    reset({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo: member.photo,
      objectPosition: member.objectPosition,
      transform: member.transform || "",
      transformHover: member.transformHover || "",
      displayOrder: member.displayOrder,
      status: member.status,
    });
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setValue("photo", result.url, { shouldValidate: true });
        toast.success("Photo uploaded successfully.");
      } else {
        toast.error(result.message || "Failed to upload photo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: TeamFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingMember) {
        const result = await updateTeamMember(editingMember.id, data);
        if (result.success) {
          setMembers((prev) =>
            prev.map((m) => (m.id === editingMember.id ? (result.member as any) : m))
          );
          toast.success("Team member updated successfully.");
          setIsFormOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to update team member.");
        }
      } else {
        const result = await createTeamMember(data);
        if (result.success) {
          setMembers((prev) => [...prev, result.member as any]);
          toast.success("Team member created successfully.");
          setIsFormOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to add team member.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (member: TeamMember) => {
    setIsLoading(true);
    const result = await toggleTeamMemberStatus(member.id, member.status);
    setIsLoading(false);

    if (result.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: result.status! } : m))
      );
      toast.success(`Guide status set to ${result.status ? "Active" : "Inactive"}`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const result = await deleteTeamMember(deleteTargetId);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.id !== deleteTargetId));
      toast.success("Team member removed successfully.");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete team member.");
    }
  };

  const columns: Column<TeamMember>[] = [
    {
      header: "Order",
      accessorKey: "displayOrder",
      sortable: true,
      className: "hidden sm:table-cell",
      cell: (row) => <span className="font-light text-sage-500">#{row.displayOrder}</span>,
    },
    {
      header: "Member",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative rounded-full overflow-hidden border border-sage-100 bg-sand-100/50 shrink-0">
            <Image src={row.photo} alt={row.name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-bold text-sage-950 leading-tight">{row.name}</p>
            <p className="text-[10px] text-sage-400 font-medium mt-0.5">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Positioning Offset",
      accessorKey: "objectPosition",
      className: "hidden md:table-cell",
      cell: (row) => (
        <span className="text-xs font-mono bg-sage-50 px-2 py-1 rounded text-sage-700 border border-sage-100">
          {row.objectPosition}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          className="focus:outline-none"
        >
          {row.status ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200/50 rounded-full px-2.5 py-0.5">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sage-400 bg-sage-50 border border-sage-200/50 rounded-full px-2.5 py-0.5">
              Inactive
            </span>
          )}
        </button>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="p-1 text-sage-500 hover:text-sage-900 hover:bg-sage-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Wellness Guides</h1>
          <p className="text-sm text-sage-600 font-light mt-1">
            Manage your certified teachers, cofounders, profile photos, bios, social URLs, and display order.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button variant="outline" onClick={handleOpenReorder} className="rounded-xl flex items-center gap-2 py-2.5">
            <GripVertical className="h-4 w-4 text-sage-500" />
            <span>Reorder</span>
          </Button>
          <Button variant="primary" onClick={handleAddClick} className="rounded-xl flex items-center gap-2 py-2.5">
            <Plus className="h-5 w-5" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Team Table */}
      <DataTable
        columns={columns}
        data={members}
        searchKey="name"
        searchPlaceholder="Search team members..."
        isLoading={isLoading}
        emptyStateText="No team guides registered yet."
      />

      {/* CRUD Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="xl">
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold text-sage-500 uppercase tracking-widest block mb-1">
              Guide Profile Form
            </span>
            <h3 className="font-serif font-bold text-2xl text-sage-950">
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Abhishek Sharma"
                    {...register("name")}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {errors.name && (
                    <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Role / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Wellness Steward"
                    {...register("role")}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {errors.role && (
                    <p className="text-xs font-semibold text-red-500">{errors.role.message}</p>
                  )}
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Display Order</label>
                  <input
                    type="number"
                    {...register("displayOrder", { valueAsNumber: true })}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                </div>

                {/* Object Position */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Object Position Offset</label>
                  <input
                    type="text"
                    placeholder="e.g. center 35% or top"
                    {...register("objectPosition")}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                </div>

                {/* Transform (Scale / Translate) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Base Transform</label>
                  <input
                    type="text"
                    placeholder="e.g. scale(1.15) translateX(6%)"
                    {...register("transform")}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                </div>

                {/* Transform Hover */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Hover Transform</label>
                  <input
                    type="text"
                    placeholder="e.g. scale(1.2) translateX(6%)"
                    {...register("transformHover")}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Biography</label>
                <textarea
                  rows={2}
                  placeholder="Dedicated to alignment, yoga philosophies, lineages..."
                  {...register("bio")}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {errors.bio && (
                  <p className="text-xs font-semibold text-red-500">{errors.bio.message}</p>
                )}
              </div>



              {/* Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full text-xs text-sage-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sage-100 file:text-sage-700 hover:file:bg-sage-200 file:cursor-pointer"
                />
                {isUploading && (
                  <div className="flex items-center gap-1 text-xs text-sage-500 mt-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
                <input type="hidden" {...register("photo")} />
                {errors.photo && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{errors.photo.message}</p>
                )}
              </div>

              {/* Status */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("status")}
                  className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                />
                <span className="text-xs font-bold text-sage-700">Publish immediately (Active)</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-sage-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl px-5"
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-sage-600 hover:bg-sage-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Guide</span>
                  )}
                </button>
              </div>
            </form>

            {/* Live Preview Card Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-sage-50/50 border border-sage-100 rounded-[2.5rem] sticky top-6">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest block mb-4">
                Live Card Preview
              </span>

              {/* Public Website Styled Card */}
              <Card
                variant="glass"
                className="flex flex-col items-center text-center p-6 bg-white border border-sage-100 w-full max-w-[280px] select-none pointer-events-none group shadow-lg"
              >
                {/* Photo Frame */}
                <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-md mb-5 flex-shrink-0">
                  {watchAll.photo ? (
                    <img
                      src={watchAll.photo}
                      alt={watchAll.name || "Preview"}
                      className="h-full w-full object-cover transition-transform duration-500"
                      style={{
                        objectPosition: watchAll.objectPosition || "center",
                        transform: watchAll.transform || undefined,
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-sage-100 flex flex-col items-center justify-center text-sage-400 gap-1">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="font-serif font-bold text-lg text-sage-950 mb-1 leading-snug">
                  {watchAll.name || "Guide Name"}
                </h3>

                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-sage-100 text-sage-700 border border-sage-200/50 mb-3">
                  {watchAll.role || "Wellness Steward"}
                </span>

                {/* Biography */}
                <p className="text-xs text-sage-600 font-light leading-relaxed mb-0 line-clamp-3">
                  {watchAll.bio || "Provide a biography detailing their lineage, experience, and certifications..."}
                </p>


              </Card>

              <div className="flex items-start gap-2 mt-6 p-4 bg-gold-50 border border-gold-100 rounded-2xl text-[10px] text-gold-700 leading-normal max-w-[280px]">
                <Info className="h-4 w-4 shrink-0 text-gold-600 mt-0.5" />
                <p>
                  Use <b>Object Position</b> (e.g. <span className="font-mono bg-white px-1 py-0.5 rounded border">center 35%</span>) and <b>Transforms</b> (e.g. <span className="font-mono bg-white px-1 py-0.5 rounded border">scale(1.15) translateX(6%)</span>) to visually center headshots in the circle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation delete alert */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDelete}
        title="Remove Guide"
        description="Are you sure you want to remove this teacher from the team? They will immediately disappear from the homepage."
      />

      {/* Reorder Modal */}
      <Modal isOpen={isReorderOpen} onClose={() => setIsReorderOpen(false)} size="sm">
        <div className="space-y-5">
          <div>
            <h3 className="font-serif font-bold text-xl text-sage-950">Reorder Guides</h3>
            <p className="text-xs text-sage-500 font-light mt-1">
              Drag and drop teachers to rearrange their display order on the website.
            </p>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {tempList.map((member, idx) => (
              <div
                key={member.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-3.5 p-2 bg-white border border-sage-100 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing select-none transition-all duration-200",
                  draggedIndex === idx && "opacity-40 scale-[1.01] border-gold-400 bg-sand-50/50 shadow-md"
                )}
              >
                <GripVertical className="h-4.5 w-4.5 text-sage-400 shrink-0" />
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-sage-150 shrink-0 bg-sage-50">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-sage-950 truncate">{member.name}</p>
                  <p className="text-[10px] text-sage-400 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsReorderOpen(false)}
              disabled={isSavingOrder}
              className="flex-1 rounded-xl py-2.5"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2"
            >
              {isSavingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Order</span>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
