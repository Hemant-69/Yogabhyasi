"use client";

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "./DataTable";
import ConfirmDialog from "./ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  createService,
  updateService,
  deleteService,
  toggleServiceStatus
} from "@/actions/services";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Eye,
  EyeOff,
  Activity,
  Wind,
  Sparkles,
  Heart,
  Smile,
  Zap,
  Info
} from "lucide-react";
import Image from "next/image";

interface Service {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  benefits: any; // string[]
  status: boolean;
  displayOrder: number;
}

interface ServicesClientProps {
  initialServices: Service[];
}

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Image is required"),
  benefits: z.array(z.object({ value: z.string().min(1, "Benefit cannot be empty") })).min(1, "Add at least one benefit"),
  status: z.boolean(),
  displayOrder: z.number(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const iconList = [
  { name: "Activity", icon: Activity },
  { name: "Wind", icon: Wind },
  { name: "Sparkles", icon: Sparkles },
  { name: "Heart", icon: Heart },
  { name: "Smile", icon: Smile },
  { name: "Zap", icon: Zap },
];

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>(initialServices);
  
  // Modals / Forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Deletion States
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      icon: "Activity",
      description: "",
      image: "",
      benefits: [{ value: "" }],
      status: true,
      displayOrder: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const watchTitle = watch("title");
  const watchImage = watch("image");

  // Auto-slugify title
  useEffect(() => {
    if (watchTitle && !editingService) {
      const slugified = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slugified, { shouldValidate: true });
    }
  }, [watchTitle, setValue, editingService]);

  // Handle URL shortcut triggers (e.g. ?action=new)
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      handleAddClick();
      // Remove param from URL
      router.replace(window.location.pathname);
    }
  }, [searchParams]);

  const handleAddClick = () => {
    setEditingService(null);
    reset({
      title: "",
      slug: "",
      icon: "Activity",
      description: "",
      image: "",
      benefits: [{ value: "" }],
      status: true,
      displayOrder: services.length,
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    
    // Parse benefits array into the structure expected by useFieldArray
    const benefitsArray = Array.isArray(service.benefits)
      ? service.benefits
      : typeof service.benefits === "string"
      ? JSON.parse(service.benefits)
      : [];

    const formattedBenefits = benefitsArray.map((b: string) => ({ value: b }));

    reset({
      title: service.title,
      slug: service.slug,
      icon: service.icon,
      description: service.description,
      image: service.image,
      benefits: formattedBenefits.length > 0 ? formattedBenefits : [{ value: "" }],
      status: service.status,
      displayOrder: service.displayOrder,
    });
    setIsFormOpen(true);
  };

  // Handle Image Upload
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
        setValue("image", result.url, { shouldValidate: true });
        toast.success("Image uploaded successfully.");
      } else {
        toast.error(result.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    
    // Flatten benefits array for DB storage
    const flatBenefits = data.benefits.map((b) => b.value);
    const actionData = {
      ...data,
      benefits: flatBenefits,
    };

    try {
      if (editingService) {
        // Update Action
        const result = await updateService(editingService.id, actionData);
        if (result.success) {
          setServices((prev) =>
            prev.map((s) => (s.id === editingService.id ? (result.service as any) : s))
          );
          toast.success("Service updated successfully.");
          setIsFormOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to update service.");
        }
      } else {
        // Create Action
        const result = await createService(actionData);
        if (result.success) {
          setServices((prev) => [...prev, result.service as any]);
          toast.success("Service created successfully.");
          setIsFormOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to create service.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    setIsLoading(true);
    const result = await toggleServiceStatus(service.id, service.status);
    setIsLoading(false);

    if (result.success) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, status: result.status! } : s))
      );
      toast.success(`Service status set to ${result.status ? "Active" : "Inactive"}`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const result = await deleteService(deleteTargetId);
    if (result.success) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTargetId));
      toast.success("Service deleted successfully.");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete service.");
    }
  };

  const getIconComponent = (iconName: string) => {
    const matched = iconList.find((i) => i.name === iconName);
    const MatchedIcon = matched ? matched.icon : Activity;
    return <MatchedIcon className="h-5 w-5" />;
  };

  const columns: Column<Service>[] = [
    {
      header: "Order",
      accessorKey: "displayOrder",
      sortable: true,
      cell: (row) => <span className="font-light text-sage-500">#{row.displayOrder}</span>,
    },
    {
      header: "Service",
      accessorKey: "title",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative rounded-lg overflow-hidden border border-sage-100 bg-sand-100/50 shrink-0">
            <Image src={row.image} alt={row.title} fill className="object-cover" />
          </div>
          <div>
            <p className="font-bold text-sage-950 leading-tight">{row.title}</p>
            <p className="text-[10px] text-sage-400 font-mono mt-0.5">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Icon",
      accessorKey: "icon",
      cell: (row) => (
        <div className="p-2 rounded-lg bg-sage-50 text-sage-600 border border-sage-100 inline-block">
          {getIconComponent(row.icon)}
        </div>
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
          <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Studio Services</h1>
          <p className="text-sm text-sage-600 font-light mt-1">
            Manage your signature programs, curriculum listings, icons, descriptions, and dynamic page content.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddClick} className="rounded-xl flex items-center gap-2 self-start sm:self-auto py-2.5">
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Services Table */}
      <DataTable
        columns={columns}
        data={services}
        searchKey="title"
        searchPlaceholder="Search services..."
        isLoading={isLoading}
        emptyStateText="No studio services created yet."
      />

      {/* CRUD Add/Edit Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="lg">
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold text-sage-500 uppercase tracking-widest block mb-1">
              Service Form
            </span>
            <h3 className="font-serif font-bold text-2xl text-sage-950">
              {editingService ? "Edit Service" : "Add Service"}
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Service Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vinyasa Flow"
                  {...register("title")}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {errors.title && (
                  <p className="text-xs font-semibold text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  placeholder="e.g. vinyasa-flow"
                  {...register("slug")}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {errors.slug && (
                  <p className="text-xs font-semibold text-red-500">{errors.slug.message}</p>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Service Icon
                </label>
                <select
                  {...register("icon")}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                >
                  {iconList.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.icon && (
                  <p className="text-xs font-semibold text-red-500">{errors.icon.message}</p>
                )}
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Display Order
                </label>
                <input
                  type="number"
                  {...register("displayOrder", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {errors.displayOrder && (
                  <p className="text-xs font-semibold text-red-500">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the curriculum, goals, and philosophy of the class..."
                {...register("description")}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
              />
              {errors.description && (
                <p className="text-xs font-semibold text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                Cover Image
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="h-28 w-44 rounded-xl border border-sage-200 bg-sand-100 flex items-center justify-center relative overflow-hidden shrink-0">
                  {watchImage ? (
                    <Image src={watchImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-sage-400">
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-[10px]">No image uploaded</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full text-xs text-sage-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sage-100 file:text-sage-700 hover:file:bg-sage-200 file:cursor-pointer"
                  />
                  <p className="text-[10px] text-sage-400">Recommended size: 800x600px. JPG, PNG or WEBP (Max 5MB).</p>
                  {isUploading && (
                    <div className="flex items-center gap-1.5 text-xs text-sage-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Uploading file...</span>
                    </div>
                  )}
                  {/* Hidden field value */}
                  <input type="hidden" {...register("image")} />
                </div>
              </div>
              {errors.image && (
                <p className="text-xs font-semibold text-red-500">{errors.image.message}</p>
              )}
            </div>

            {/* Benefits Array */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Benefits / Highlights
                </label>
                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Benefit</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g. Core muscle toning"
                      {...register(`benefits.${index}.value` as const)}
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.benefits && (
                <p className="text-xs font-semibold text-red-500">{errors.benefits.root?.message}</p>
              )}
            </div>

            {/* Status Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("status")}
                className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-xs font-bold text-sage-700">Publish immediately (Active)</span>
            </label>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-sage-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl px-5 py-2.5"
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
                  <span>Save Service</span>
                )}
              </button>
            </div>
          </form>
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
        title="Delete Service"
        description="Are you sure you want to delete this service? All details will be permanently removed from the website."
      />
    </div>
  );
}
