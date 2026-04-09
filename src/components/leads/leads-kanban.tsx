"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, MoreVertical, GripVertical, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const STAGES = [
  "New", 
  "Contacted", 
  "Not Picked", 
  "Follow-up Scheduled", 
  "Meeting Fixed", 
  "Proposal Sent", 
  "Negotiation", 
  "Won", 
  "Lost"
];

interface KanbanProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export function LeadsKanban({ leads, onLeadClick }: KanbanProps) {
  const [items, setItems] = React.useState<Record<string, string[]>>({});
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  React.useEffect(() => {
    const initialItems: Record<string, string[]> = {};
    STAGES.forEach(stage => {
      initialItems[stage] = leads
        .filter(lead => lead.status === stage)
        .map(lead => lead.id!)
        .filter(Boolean);
    });
    setItems(initialItems);
  }, [leads]);

  const findContainer = (id: string) => {
    if (id in items) return id;
    return Object.keys(items).find(key => items[key].includes(id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id in items) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(overId as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setItems(prev => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(active.id as string);
      const overIndex = overItems.indexOf(overId as string);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter(item => item !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...overItems.slice(newIndex, overItems.length),
        ],
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id as string);
    const overId = over?.id as string;
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      // If dropped in a different container, update Firestore
      if (overContainer && firestore) {
          const leadId = active.id as string;
          try {
              const leadRef = doc(firestore, "leads", leadId);
              await updateDoc(leadRef, {
                  status: overContainer,
                  updatedAt: serverTimestamp()
              });
              toast({
                  title: "Pipeline Updated",
                  description: `Lead moved to ${overContainer} stage.`,
              });
          } catch (e) {
              toast({
                  title: "Update Failed",
                  description: "Could not synchronize pipeline state.",
                  variant: "destructive"
              });
          }
      }
      setActiveId(null);
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id as string);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems(prev => ({
        ...prev,
        [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveId(null);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-10 min-h-[70vh] px-2 custom-scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {STAGES.map(stage => (
          <KanbanColumn 
            key={stage} 
            id={stage} 
            title={stage} 
            items={items[stage] || []}
            allLeads={leads}
            onLeadClick={onLeadClick}
          />
        ))}
        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}>
          {activeId ? (
            <div className="rotate-3 scale-105 pointer-events-none">
              <LeadCard id={activeId} lead={leads.find(l => l.id === activeId)!} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ id, title, items, allLeads, onLeadClick }: { id: string, title: string, items: string[], allLeads: Lead[], onLeadClick?: (lead: Lead) => void }) {
  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">{title}</h3>
            <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                {items.length}
            </span>
        </div>
        <div className="h-1 w-12 bg-slate-100 rounded-full" />
      </div>

      <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4 p-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 min-h-[500px]">
          {items.map(itemId => (
            <LeadCard 
              key={itemId} 
              id={itemId} 
              lead={allLeads.find(l => l.id === itemId)!} 
              onClick={() => onLeadClick?.(allLeads.find(l => l.id === itemId)!)}
            />
          ))}
          {items.length === 0 && (
            <div className="h-40 border-2 border-dashed border-slate-100 rounded-[1.5rem] flex items-center justify-center">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Drop Entity Here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function LeadCard({ id, lead, isOverlay, onClick }: { id: string, lead: Lead, isOverlay?: boolean, onClick?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  if (!lead) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:border-primary/20 transition-all group cursor-grab active:cursor-grabbing",
        isOverlay && "shadow-2xl border-primary"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
           <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lead.company}</p>
                <h4 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{lead.name}</h4>
           </div>
           <GripVertical className="text-slate-200 group-hover:text-slate-400 transition-colors" size={14} />
        </div>

        <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <Mail size={12} className="text-slate-300" />
                <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <Phone size={12} className="text-slate-300" />
                <span>{lead.phone}</span>
            </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-2">
            <div className="flex gap-2">
              <Badge variant="outline" className={cn(
                  "rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-none",
                  lead.priority === 'Hot' ? "bg-red-50 text-red-600" : 
                  lead.priority === 'Cold' ? "bg-blue-50 text-blue-600" : 
                  "bg-amber-50 text-amber-600"
              )}>
                  {lead.priority || 'Warm'}
              </Badge>
              {lead.score !== undefined && (
                <Badge className="bg-slate-900 text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-none">
                  {lead.score}
                </Badge>
              )}
            </div>
            {lead.followUpDate && (
                <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase">
                    <Clock size={10} /> {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
