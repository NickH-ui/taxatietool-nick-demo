import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  CheckCircle2,
  Circle,
  Copy,
  FileDown,
  GripVertical,
  Mic,
  Minus,
  Plus,
  Search,
  Smartphone,
  Tablet,
  Undo2,
  Redo2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  X,
  ClipboardPaste,
  LayoutTemplate,
} from "lucide-react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "icon";
};
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type DialogCtx = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogCtx>({ open: false });

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Card({ className, ...props }: DivProps) {
  return <div className={cn("bg-white", className)} {...props} />;
}

function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />;
}

function Button({ className, variant = "default", size = "default", type = "button", ...props }: ButtonProps) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";
  const sizeClass =
    size === "sm"
      ? "h-8 px-3 text-sm"
      : size === "icon"
        ? "h-10 w-10"
        : "h-10 px-4 text-sm";
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md border-0 font-medium shadow-none outline-none transition disabled:cursor-not-allowed disabled:opacity-50",
        variantClass,
        sizeClass,
        className,
      )}
      {...props}
    />
  );
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
        className,
      )}
      {...props}
    />
  );
});

function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center border border-slate-300 px-2 py-0.5 text-xs", className)} {...props} />;
}

function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, onOpenChange } = React.useContext(DialogContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onMouseDown={() => onOpenChange?.(false)}>
      <div className={cn("w-full bg-white p-6 shadow-2xl", className)} onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: DivProps) {
  return <div className={cn("mb-4", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-slate-500", className)} {...props} />;
}

type RowItem = {
  id: string;
  typeCode: 0 | 1 | 2;
  label?: string;
  count?: number | string;
  brand?: string;
  brandModel?: string;
  description?: string;
  belongings?: string;
  code?: string;
  unitValue?: number | string;
  totalValue?: number;
  calculatedTotalValue?: number;
  overrideTotalActive?: boolean;
  seen?: boolean;
  print?: boolean;
  changed?: boolean;
  notes?: string;
  parked?: boolean;
  children?: RowItem[];
};

type FlatRow = RowItem & {
  depth: number;
  parentId: string | null;
  section: string;
  level: string;
  room: string;
};

type Snapshot = {
  data: RowItem[];
  parkingArea: RowItem[];
};

type InsertMode = "after" | "inside";

type SuggestionState = {
  rowId: string;
  field: "brand" | "brandModel" | "code";
} | null;

type TemplateNode = {
  kind: "level" | "group" | "object";
  label?: string;
  description?: string;
  count?: number | string;
  brand?: string;
  brandModel?: string;
  belongings?: string;
  code?: string;
  unitValue?: number | string;
  children?: TemplateNode[];
};

type TemplatePreset = {
  id: string;
  companyType: string;
  roomType: string;
  title: string;
  nodes: TemplateNode[];
};

type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results?: { 0?: { 0?: { transcript?: string } } } }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

const reportTree: RowItem[] = [
  {
    id: "sec1",
    typeCode: 2,
    label: "Bedrijfsruimten",
    seen: false,
    print: true,
    children: [
      {
        id: "lvl1",
        typeCode: 2,
        label: "Begane grond",
        seen: false,
        print: true,
        children: [
          {
            id: "lvl1a",
            typeCode: 2,
            label: "Hal en wachtruimte",
            seen: false,
            print: true,
            children: [
              {
                id: "obj1",
                typeCode: 0,
                count: 1,
                brand: "Cisco",
                brandModel: "Meraki MR36",
                description: "access point",
                belongings: "incl. montagebeugel",
                code: "wifi",
                unitValue: 500,
                totalValue: 500,
                seen: false,
                print: true,
                changed: false,
              },
              {
                id: "grp1a",
                typeCode: 1,
                count: "-",
                description: "de inventaris met",
                unitValue: "",
                totalValue: 10000,
                seen: false,
                print: true,
                changed: false,
                children: [
                  {
                    id: "obj1a1",
                    typeCode: 0,
                    count: 1,
                    brand: "Ahrend",
                    brandModel: "Balance",
                    description: "balie met ladenblok",
                    belongings: "kabeldoorvoer",
                    code: "meub",
                    unitValue: 2500,
                    totalValue: 2500,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                  {
                    id: "obj1a2",
                    typeCode: 0,
                    count: 6,
                    brand: "Vitra",
                    brandModel: "Visitor",
                    description: "wachtkamerstoel gestoffeerd",
                    belongings: "met armleuningen",
                    code: "meub",
                    unitValue: 450,
                    totalValue: 2700,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                ],
              },
            ],
          },
          {
            id: "lvl1b",
            typeCode: 2,
            label: "Spreekkamer 1",
            seen: false,
            print: true,
            children: [
              {
                id: "grp2a",
                typeCode: 1,
                count: "-",
                description: "de inventaris met",
                unitValue: "",
                totalValue: 12000,
                seen: false,
                print: true,
                changed: false,
                children: [
                  {
                    id: "obj2a1",
                    typeCode: 0,
                    count: 1,
                    brand: "Lensvelt",
                    brandModel: "Oval",
                    description: "vergadertafel ovaal",
                    belongings: "fineerblad",
                    code: "meub",
                    unitValue: 3200,
                    totalValue: 3200,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                  {
                    id: "obj2a2",
                    typeCode: 0,
                    count: 8,
                    brand: "Ahrend",
                    brandModel: "Conference",
                    description: "vergaderstoel",
                    belongings: "gestoffeerd",
                    code: "meub",
                    unitValue: 550,
                    totalValue: 4400,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                ],
              },
            ],
          },
          {
            id: "lvl1c",
            typeCode: 2,
            label: "Kantoor administratie",
            seen: false,
            print: true,
            children: [
              {
                id: "obj3a",
                typeCode: 0,
                count: 2,
                brand: "Dell",
                brandModel: "OptiPlex 7010",
                description: "pc's",
                belongings: "beeldscherm en toetsenbord",
                code: "com",
                unitValue: 1750,
                totalValue: 3500,
                seen: false,
                print: true,
                changed: false,
              },
              {
                id: "obj3b",
                typeCode: 0,
                count: 1,
                brand: "Ricoh",
                brandModel: "IMC 3010",
                description: "copier",
                belongings: "incl. adf",
                code: "print",
                unitValue: 6000,
                totalValue: 6000,
                seen: false,
                print: true,
                changed: false,
              },
              {
                id: "grp3a",
                typeCode: 1,
                count: "-",
                description: "de inventaris met",
                unitValue: "",
                totalValue: 17000,
                seen: false,
                print: true,
                changed: false,
                children: [
                  {
                    id: "obj3a1",
                    typeCode: 0,
                    count: 4,
                    brand: "Ahrend",
                    brandModel: "Balance",
                    description: "bureau elektrisch verstelbaar",
                    belongings: "kabelgoot",
                    code: "meub",
                    unitValue: 850,
                    totalValue: 3400,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                  {
                    id: "obj3a2",
                    typeCode: 0,
                    count: 4,
                    brand: "Herman Miller",
                    brandModel: "Aeron",
                    description: "bureaustoel ergonomisch",
                    belongings: "armleggers",
                    code: "meub",
                    unitValue: 980,
                    totalValue: 3920,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "lvl2",
        typeCode: 2,
        label: "Eerste verdieping",
        seen: false,
        print: true,
        children: [
          {
            id: "lvl2a",
            typeCode: 2,
            label: "Kantoor",
            seen: false,
            print: true,
            children: [
              {
                id: "obj4a",
                typeCode: 0,
                count: 9,
                brand: "Dell",
                brandModel: "OptiPlex 7010",
                description: "pc's",
                belongings: "beeldscherm en toetsenbord",
                code: "com",
                unitValue: 1750,
                totalValue: 15750,
                seen: false,
                print: true,
                changed: false,
              },
              {
                id: "grp4a",
                typeCode: 1,
                count: "-",
                description: "de inventaris met",
                unitValue: "",
                totalValue: 35000,
                seen: false,
                print: true,
                changed: false,
                children: [
                  {
                    id: "obj4a1",
                    typeCode: 0,
                    count: 9,
                    brand: "Ahrend",
                    brandModel: "Workplace",
                    description: "bureau werkplek",
                    belongings: "met ladeblok",
                    code: "meub",
                    unitValue: 950,
                    totalValue: 8550,
                    seen: false,
                    print: true,
                    changed: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sec2",
    typeCode: 2,
    label: "Computerapparatuur",
    seen: false,
    print: true,
    children: [
      {
        id: "grp5",
        typeCode: 1,
        label: "de computerapparatuur, bestaande uit:",
        seen: false,
        print: true,
        children: [
          {
            id: "grp5a",
            typeCode: 1,
            count: "-",
            description: "computers",
            code: "com",
            unitValue: "",
            totalValue: 75500,
            seen: false,
            print: true,
            changed: false,
            children: [
              {
                id: "obj5a1",
                typeCode: 0,
                count: 11,
                brand: "Dell",
                brandModel: "OptiPlex 7010",
                description: "desktop pc",
                belongings: "beeldscherm en toetsenbord",
                code: "com",
                unitValue: 1750,
                totalValue: 19250,
                seen: false,
                print: true,
                changed: false,
              },
            ],
          },
          {
            id: "grp5b",
            typeCode: 1,
            count: "-",
            description: "printers zoals per ruimte vermeld",
            code: "print",
            unitValue: "",
            totalValue: 26300,
            seen: false,
            print: true,
            changed: false,
          },
          {
            id: "grp5c",
            typeCode: 1,
            count: "-",
            description: "access points",
            code: "wifi",
            unitValue: "",
            totalValue: 3000,
            seen: false,
            print: true,
            changed: false,
          },
        ],
      },
    ],
  },
];

const brandSuggestions = ["Dell", "Cisco", "Ricoh", "Ahrend", "Herman Miller", "Vitra", "Lensvelt"];
const modelSuggestions = [
  { brand: "Dell", brandModel: "OptiPlex 7010", description: "desktop pc", belongings: "beeldscherm en toetsenbord", code: "com", unitValue: 1750 },
  { brand: "Cisco", brandModel: "Meraki MR36", description: "access point", belongings: "incl. montagebeugel", code: "wifi", unitValue: 500 },
  { brand: "Ricoh", brandModel: "IMC 3010", description: "copier", belongings: "incl. adf", code: "print", unitValue: 6000 },
  { brand: "Ahrend", brandModel: "Balance", description: "bureau elektrisch verstelbaar", belongings: "kabelgoot", code: "meub", unitValue: 850 },
  { brand: "Herman Miller", brandModel: "Aeron", description: "bureaustoel ergonomisch", belongings: "armleggers", code: "meub", unitValue: 980 },
  { brand: "Vitra", brandModel: "Visitor", description: "wachtkamerstoel gestoffeerd", belongings: "met armleuningen", code: "meub", unitValue: 450 },
];
const codeSuggestions = ["com", "print", "wifi", "meub", "novt", "alg", "install", "patch", "cpu"];
const FIELD_ORDER = ["description", "unitValue", "brand", "brandModel", "belongings"] as const;
const templatePresets: TemplatePreset[] = [
  {
    id: "office-workspace",
    companyType: "Kantoor",
    roomType: "Werkruimte",
    title: "Kantoor werkplek",
    nodes: [
      {
        kind: "group",
        description: "de inventaris met",
        children: [
          { kind: "object", description: "bureau werkplek", count: 4, brand: "Ahrend", brandModel: "Workplace", belongings: "met ladeblok", code: "meub", unitValue: 950 },
          { kind: "object", description: "bureaustoel ergonomisch", count: 4, brand: "Herman Miller", brandModel: "Aeron", belongings: "armleggers", code: "meub", unitValue: 980 },
          { kind: "object", description: "desktop pc", count: 4, brand: "Dell", brandModel: "OptiPlex 7010", belongings: "beeldscherm en toetsenbord", code: "com", unitValue: 1750 },
        ],
      },
    ],
  },
  {
    id: "health-waiting",
    companyType: "Praktijk",
    roomType: "Wachtruimte",
    title: "Wachtruimte standaard",
    nodes: [
      {
        kind: "level",
        label: "Wachtruimte",
        children: [
          { kind: "object", description: "wachtkamerstoel gestoffeerd", count: 6, brand: "Vitra", brandModel: "Visitor", belongings: "met armleuningen", code: "meub", unitValue: 450 },
          { kind: "object", description: "balie met ladenblok", count: 1, brand: "Ahrend", brandModel: "Balance", belongings: "kabeldoorvoer", code: "meub", unitValue: 2500 },
        ],
      },
    ],
  },
  {
    id: "retail-counter",
    companyType: "Retail",
    roomType: "Balie",
    title: "Balie / ontvangstruimte",
    nodes: [
      {
        kind: "level",
        label: "Balie",
        children: [
          { kind: "object", description: "kassabalie", count: 1, belongings: "met opberglades", code: "meub", unitValue: 3200 },
          { kind: "object", description: "pinapparaat", count: 1, brand: "Ingenico", brandModel: "Desk 5000", code: "com", unitValue: 450 },
          { kind: "object", description: "desktop pc", count: 1, brand: "Dell", brandModel: "OptiPlex 7010", belongings: "beeldscherm en toetsenbord", code: "com", unitValue: 1750 },
        ],
      },
    ],
  },
];

function euro(value: number | string | undefined) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function combinedDescription(item: RowItem) {
  return [item.brand, item.brandModel, item.description, item.belongings].filter(Boolean).join(", ");
}

function titleCase(text: string | undefined) {
  return String(text || "")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (s) => s.toUpperCase());
}

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function isNumericCount(value: number | string | undefined) {
  return value !== "-" && value !== "" && !Number.isNaN(Number(value));
}

function recomputeInitialTotal(nodes: RowItem[]) {
  let total = 0;
  const walk = (items: RowItem[]) => {
    for (const item of items) {
      if (item.typeCode === 0 && item.totalValue) total += Number(item.totalValue || 0);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(nodes);
  return total;
}

function calculateCurrentLeafTotal(nodes: RowItem[]) {
  let total = 0;
  const walk = (items: RowItem[]) => {
    for (const item of items) {
      if (item.typeCode === 0 && item.totalValue) total += Number(item.totalValue || 0);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(nodes);
  return total;
}

const INITIAL_TOTAL = recomputeInitialTotal(reportTree);

function flattenTree(
  nodes: RowItem[],
  expanded: Record<string, boolean>,
  depth = 0,
  parentId: string | null = null,
  branch = { section: "", level: "", room: "" },
): FlatRow[] {
  let rows: FlatRow[] = [];
  for (const node of nodes) {
    const nextBranch = { ...branch };
    if (depth === 0) nextBranch.section = node.label || "";
    if (depth >= 1 && node.typeCode === 2) nextBranch.level = node.label || "";
    if (depth >= 1 && node.typeCode === 1 && !node.description) nextBranch.room = node.label || "";
    rows.push({ ...node, depth, parentId, section: nextBranch.section, level: nextBranch.level, room: nextBranch.room });
    if (node.children?.length && expanded[node.id] !== false) {
      rows = rows.concat(flattenTree(node.children, expanded, depth + 1, node.id, nextBranch));
    }
  }
  return rows;
}

function recomputeTotals(nodes: RowItem[]): RowItem[] {
  return nodes.map((node) => {
    const next: RowItem = { ...node };
    if (next.children?.length) {
      next.children = recomputeTotals(next.children);
      const childSum = next.children.reduce((sum, child) => sum + Number(child.totalValue || 0), 0);
      const trackableChildren = next.children.filter((child) => !child.id.startsWith("new-"));
      next.seen = trackableChildren.length > 0 ? trackableChildren.every((child) => !!child.seen) : !!next.seen;
      if (next.typeCode === 1) {
        next.calculatedTotalValue = childSum;
        if (next.unitValue !== "" && next.unitValue !== null && next.unitValue !== undefined && !Number.isNaN(Number(next.unitValue))) {
          next.totalValue = Number(next.unitValue);
          next.overrideTotalActive = true;
        } else {
          next.totalValue = childSum;
          next.overrideTotalActive = false;
        }
      }
    } else if (next.description && isNumericCount(next.count) && !Number.isNaN(Number(next.unitValue))) {
      next.totalValue = Number(next.count) * Number(next.unitValue);
      next.calculatedTotalValue = next.totalValue;
      next.overrideTotalActive = false;
    }
    return next;
  });
}

function updateNode(nodes: RowItem[], nodeId: string, updater: (node: RowItem) => RowItem): RowItem[] {
  const updated = nodes.map((node) => {
    if (node.id === nodeId) return updater(node);
    if (node.children?.length) return { ...node, children: updateNode(node.children, nodeId, updater) };
    return node;
  });
  return recomputeTotals(updated);
}

function findNode(nodes: RowItem[], nodeId: string): RowItem | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children?.length) {
      const found = findNode(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

function removeNode(nodes: RowItem[], nodeId: string): { next: RowItem[]; removed: RowItem | null } {
  let removed: RowItem | null = null;
  const next = nodes
    .map((node) => {
      if (node.id === nodeId) {
        removed = node;
        return null;
      }
      if (node.children?.length) {
        const result = removeNode(node.children, nodeId);
        if (result.removed) removed = result.removed;
        return { ...node, children: result.next };
      }
      return node;
    })
    .filter(Boolean) as RowItem[];
  return { next, removed };
}

function insertAfter(nodes: RowItem[], targetId: string, newNode: RowItem): RowItem[] {
  const result: RowItem[] = [];
  for (const node of nodes) {
    const current = node.children?.length ? { ...node, children: insertAfter(node.children, targetId, newNode) } : node;
    result.push(current);
    if (node.id === targetId) result.push(newNode);
  }
  return result;
}

function insertAsFirstChild(nodes: RowItem[], parentId: string, newNode: RowItem): RowItem[] {
  return nodes.map((node) => {
    if (node.id === parentId) return { ...node, children: [newNode, ...(node.children || [])] };
    if (node.children?.length) return { ...node, children: insertAsFirstChild(node.children, parentId, newNode) };
    return node;
  });
}

function insertAsChildOfSelection(nodes: RowItem[], selectedId: string, newNode: RowItem): RowItem[] {
  return nodes.map((node) => {
    if (node.id === selectedId) return { ...node, children: [...(node.children || []), newNode] };
    if (node.children?.length) return { ...node, children: insertAsChildOfSelection(node.children, selectedId, newNode) };
    return node;
  });
}

function makeNodeFromTemplate(node: TemplateNode): RowItem {
  return {
    id: `new-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    typeCode: node.kind === "level" ? 2 : node.kind === "group" ? 1 : 0,
    label: node.label || "",
    description: node.description || (node.kind === "group" ? "de inventaris met" : ""),
    count: node.kind === "level" ? "" : node.kind === "group" ? "-" : node.count ?? 1,
    brand: node.brand || "",
    brandModel: node.brandModel || "",
    belongings: node.belongings || "",
    code: node.code || "",
    unitValue: node.unitValue ?? "",
    totalValue: 0,
    seen: false,
    print: true,
    changed: true,
    children: node.children?.map(makeNodeFromTemplate) || [],
  };
}

function snapshotState(data: RowItem[], parkingArea: RowItem[]): Snapshot {
  return { data: cloneDeep(data), parkingArea: cloneDeep(parkingArea) };
}

function moveNode(nodes: RowItem[], draggedId: string, targetId: string, mode: InsertMode = "after") {
  const removedResult = removeNode(nodes, draggedId);
  if (!removedResult.removed) return nodes;
  if (mode === "inside") {
    return recomputeTotals(insertAsFirstChild(removedResult.next, targetId, { ...removedResult.removed, changed: true }));
  }
  return recomputeTotals(insertAfter(removedResult.next, targetId, { ...removedResult.removed, changed: true }));
}

function applySpeechFlow(item: RowItem) {
  if (item.typeCode === 2 && !item.description) return { label: `${item.label || ""} - spraak bijgewerkt` };
  if (item.typeCode === 1 && !item.description) return { label: `${item.label || ""} - spraak toegevoegd` };
  return {
    brand: "Dell",
    brandModel: "OptiPlex 7010",
    description: "desktop pc",
    belongings: "beeldscherm en toetsenbord",
    code: "com",
    count: 2,
    unitValue: 1750,
  };
}

function parseSpeechText(text: string, item: RowItem) {
  const input = String(text || "").trim();
  if (!input) return null;
  if (item.typeCode === 2 && !item.description) return { label: titleCase(input) };
  if (item.typeCode === 1 && !item.description) return { label: input };
  const lower = input.toLowerCase();
  const matchCount = lower.match(/aantal\s+(\d+)/);
  const matchPrice = lower.match(/(?:deelprijs|prijs)\s+(\d+)/);
  const matchedSuggestion = modelSuggestions.find(
    (s) => lower.includes(s.brand.toLowerCase()) || lower.includes(s.brandModel.toLowerCase()) || lower.includes(s.description.toLowerCase()),
  );
  return {
    brand: matchedSuggestion?.brand || item.brand || "",
    brandModel: matchedSuggestion?.brandModel || item.brandModel || "",
    description: matchedSuggestion?.description || input,
    belongings: matchedSuggestion?.belongings || item.belongings || "",
    code: matchedSuggestion?.code || item.code || "",
    count: matchCount ? Number(matchCount[1]) : item.count,
    unitValue: matchPrice ? Number(matchPrice[1]) : matchedSuggestion?.unitValue || item.unitValue,
  };
}

function aiAssistForItem(item: RowItem) {
  if (!item.description) return {};
  const suggestion = modelSuggestions.find(
    (s) =>
      (item.brand && s.brand.toLowerCase() === String(item.brand).toLowerCase()) ||
      (item.brandModel && s.brandModel.toLowerCase() === String(item.brandModel).toLowerCase()),
  );
  return {
    brand: item.brand || suggestion?.brand || "",
    brandModel: item.brandModel || suggestion?.brandModel || "",
    description: titleCase(item.description),
    belongings: item.belongings || suggestion?.belongings || "in nette gebruikte staat",
    code: item.code || suggestion?.code || "alg",
    unitValue: item.unitValue || suggestion?.unitValue || "",
  };
}

function compactLevelStyle(active: boolean) {
  return active ? "border border-stone-300 bg-white shadow-sm" : "border border-stone-300 bg-white";
}

function compactGroupStyle(active: boolean) {
  return active ? "border border-stone-200 bg-stone-50 shadow-sm" : "border border-stone-200 bg-[#fcfbf8]";
}

function CountEditor({ item, onInlineEdit }: { item: RowItem; onInlineEdit: (id: string, field: keyof RowItem, value: unknown) => void }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <Input
        className="h-8 w-16 rounded-md px-2 text-center"
        value={item.count ?? ""}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onInlineEdit(item.id, "count", e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-md border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
          onClick={(e) => {
            e.stopPropagation();
            const current = isNumericCount(item.count) ? Number(item.count) : 0;
            onInlineEdit(item.id, "count", Math.max(0, current - 1));
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-md border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          onClick={(e) => {
            e.stopPropagation();
            const current = isNumericCount(item.count) ? Number(item.count) : 0;
            onInlineEdit(item.id, "count", current + 1);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function InlineSuggestField({
  value,
  placeholder,
  options,
  onChange,
  onPick,
  onFocus,
  active,
  inputRef,
  onKeyDown,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  onPick: (value: string) => void;
  onFocus: () => void;
  active: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}) {
  const filtered = useMemo(() => {
    const v = String(value || "").toLowerCase();
    if (!active) return [] as string[];
    if (!v) return options.slice(0, 4);
    return options.filter((o) => String(o).toLowerCase().includes(v)).slice(0, 4);
  }, [value, options, active]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        className="h-7 rounded-md"
        value={value || ""}
        onFocus={onFocus}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      {filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white p-1 shadow-lg">
          {filtered.map((option) => (
            <button
              key={option}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-100"
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InlineCodeField({
  value,
  onChange,
  active,
  inputRef,
  onFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  active: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onFocus: () => void;
}) {
  const filtered = useMemo(() => {
    if (!active) return [] as string[];
    const v = String(value || "").toLowerCase();
    if (!v) return codeSuggestions;
    return codeSuggestions.filter((o) => o.toLowerCase().includes(v)).slice(0, 6);
  }, [value, active]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        className="h-7 rounded-md"
        value={value || ""}
        onFocus={onFocus}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Code"
      />
      {active && filtered.length > 0 && (
        <div className="absolute right-0 z-20 mt-1 w-28 rounded-lg border bg-white p-1 shadow-lg">
          {filtered.map((option) => (
            <button
              key={option}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-100"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PrintToggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <button
      title={value ? "Print aan" : "Print uit"}
      className={`rounded-md border border-transparent p-2 shadow-none outline-none ${value ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {value ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </button>
  );
}

function SeenToggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <button
      title={value ? "Gezien" : "Niet gezien"}
      className={`rounded-md border border-transparent p-2 shadow-none outline-none ${value ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {value ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
    </button>
  );
}

function Row({
  item,
  active,
  selectedOnly,
  expanded,
  onToggleExpand,
  onSelect,
  onEnterEditMode,
  onToggleSeen,
  onTogglePrint,
  onMoveToParking,
  onDeleteRow,
  onDragStart,
  onDragOver,
  onDrop,
  onInlineEdit,
  onSpeech,
  onAiAssist,
  suggestionState,
  setSuggestionState,
  focusField,
  setFocusField,
  activeField,
  setActiveField,
  onTabAdvance,
}: {
  item: FlatRow;
  active: boolean;
  selectedOnly: boolean;
  expanded: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string | null) => void;
  onEnterEditMode: (id: string | null, field?: (typeof FIELD_ORDER)[number] | "code" | null) => void;
  onToggleSeen: (id: string) => void;
  onTogglePrint: (id: string) => void;
  onMoveToParking: (id: string) => void;
  onDeleteRow: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: (id: string) => void;
  onInlineEdit: (id: string, field: keyof RowItem, value: unknown) => void;
  onSpeech: (id: string) => void;
  onAiAssist: (id: string) => void;
  suggestionState: SuggestionState;
  setSuggestionState: React.Dispatch<React.SetStateAction<SuggestionState>>;
  focusField: string | null;
  setFocusField: React.Dispatch<React.SetStateAction<string | null>>;
  activeField: string | null;
  setActiveField: React.Dispatch<React.SetStateAction<string | null>>;
  onTabAdvance: (e: React.KeyboardEvent<HTMLInputElement>, rowId: string, nextField: (typeof FIELD_ORDER)[number]) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const unitValueRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLInputElement>(null);
  const brandModelRef = useRef<HTMLInputElement>(null);
  const belongingsRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const isLevel = item.typeCode === 2;
  const isContainer = !!item.children?.length;
  const isGroup = item.typeCode === 1 && !isLevel;
  const indent = item.depth * 14;
  const gridTemplate = `30px ${indent}px 18px 30px 88px minmax(340px,1.9fr) 80px 100px 140px 182px`;
  const rowClass = isLevel
    ? compactLevelStyle(active || selectedOnly)
    : isGroup && !item.brand && !item.brandModel && !item.code
      ? compactGroupStyle(active || selectedOnly)
      : active
        ? "border-2 border-amber-400 bg-white shadow-sm"
        : selectedOnly
          ? "border-2 border-sky-300 bg-white"
          : "border border-transparent hover:border-stone-200 hover:bg-white";
  const activeSuggest = suggestionState?.rowId === item.id ? suggestionState.field : null;
  const parkingActive = !!item.parked;
  const isNewRow = item.id.startsWith("new-");

  useEffect(() => {
    if (!active) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        onSelect(null);
        onEnterEditMode(null, null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [active, onSelect, onEnterEditMode]);

  useEffect(() => {
    if (!active || !focusField) return;
    const map: Record<string, React.RefObject<HTMLInputElement>> = {
      description: descriptionRef,
      unitValue: unitValueRef,
      brand: brandRef,
      brandModel: brandModelRef,
      belongings: belongingsRef,
      code: codeRef,
    };
    const ref = map[focusField];
    if (ref?.current) {
      ref.current.focus();
      ref.current.select?.();
      setFocusField(null);
    }
  }, [active, focusField, setFocusField]);

  return (
    <div
      ref={rowRef}
      draggable
      onDragStart={() => onDragStart(item.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(item.id);
      }}
      onDrop={() => onDrop(item.id)}
      style={{ gridTemplateColumns: gridTemplate }}
      className={`grid items-start gap-0.5 rounded-sm px-1 py-0 text-[11px] leading-tight transition ${rowClass}`}
    >
      {!isNewRow ? (
        <div className="flex items-center justify-center">
          <SeenToggle value={!!item.seen} onToggle={() => onToggleSeen(item.id)} />
        </div>
      ) : (
        <div />
      )}

      <div />

      <button
        className="pt-1 text-stone-400 shadow-none outline-none bg-transparent border-0"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
      >
        <GripVertical className="h-4 w-4 opacity-70" />
      </button>

      <div className="pt-1">
        {isContainer ? (
          <button
            className="flex h-5 w-5 items-center justify-center rounded-sm border-0 p-0.5 text-stone-500 shadow-none outline-none hover:bg-stone-100/70"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(item.id);
            }}
          >
            {expanded[item.id] === false ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        ) : null}
      </div>

      <div
        className="pt-0.5 font-medium text-slate-700"
        onClick={() => {
          onSelect(item.id);
          if (item.typeCode === 0) onEnterEditMode(item.id, null);
        }}
      >
        {active && item.typeCode === 0 ? <CountEditor item={item} onInlineEdit={onInlineEdit} /> : isLevel ? "" : item.count ?? "-"}
      </div>

      <div
        className="min-w-0"
        onClick={() => {
          onSelect(item.id);
          if (item.typeCode === 0) onEnterEditMode(item.id, "description");
          else onEnterEditMode(item.id, null);
        }}
      >
        {!active ? (
          <div className={`truncate ${item.typeCode === 0 ? "font-normal text-slate-900" : item.typeCode === 2 ? "font-semibold text-blue-900" : "font-semibold text-slate-900"}`}>
            {item.typeCode === 0 ? combinedDescription(item) : item.typeCode === 1 ? item.description || item.label : item.label || item.description}
          </div>
        ) : (
          <div className="space-y-1">
            {item.typeCode === 0 ? (
              <>
                <Input
                  ref={descriptionRef}
                  className="h-7 rounded-md"
                  value={item.description || ""}
                  onFocus={() => setActiveField("description")}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onInlineEdit(item.id, "description", e.target.value)}
                  onKeyDown={(e) => e.key === "Tab" && onTabAdvance(e, item.id, "unitValue")}
                  placeholder="Omschrijving"
                />
                <div className="grid grid-cols-2 gap-2">
                  <InlineSuggestField
                    inputRef={brandRef}
                    value={item.brand || ""}
                    placeholder="Merk"
                    options={brandSuggestions}
                    active={activeSuggest === "brand"}
                    onFocus={() => {
                      setActiveField("brand");
                      setSuggestionState({ rowId: item.id, field: "brand" });
                    }}
                    onChange={(value) => {
                      setSuggestionState({ rowId: item.id, field: "brand" });
                      onInlineEdit(item.id, "brand", value);
                    }}
                    onPick={(value) => {
                      setSuggestionState(null);
                      onInlineEdit(item.id, "brand", value);
                    }}
                    onKeyDown={(e) => e.key === "Tab" && onTabAdvance(e, item.id, "brandModel")}
                  />
                  <div className="relative">
                    <Input
                      ref={brandModelRef}
                      className="h-7 rounded-md"
                      value={item.brandModel || ""}
                      placeholder="Type"
                      onFocus={() => {
                        setActiveField("brandModel");
                        setSuggestionState({ rowId: item.id, field: "brandModel" });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        setSuggestionState({ rowId: item.id, field: "brandModel" });
                        onInlineEdit(item.id, "brandModel", e.target.value);
                      }}
                      onKeyDown={(e) => e.key === "Tab" && onTabAdvance(e, item.id, "belongings")}
                    />
                    {activeSuggest === "brandModel" && (
                      <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white p-1 shadow-lg">
                        {modelSuggestions
                          .filter((s) => !item.brandModel || s.brandModel.toLowerCase().includes(String(item.brandModel || "").toLowerCase()))
                          .slice(0, 4)
                          .map((s) => (
                            <button
                              key={`${s.brand}-${s.brandModel}`}
                              className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-100"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSuggestionState(null);
                                onInlineEdit(item.id, "brand", s.brand);
                                onInlineEdit(item.id, "brandModel", s.brandModel);
                                onInlineEdit(item.id, "description", s.description);
                                onInlineEdit(item.id, "belongings", s.belongings);
                                onInlineEdit(item.id, "code", s.code);
                                onInlineEdit(item.id, "unitValue", s.unitValue);
                              }}
                            >
                              {s.brand} {s.brandModel}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <Input
                  ref={belongingsRef}
                  className="h-7 rounded-md"
                  value={item.belongings || ""}
                  onFocus={() => setActiveField("belongings")}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onInlineEdit(item.id, "belongings", e.target.value)}
                  onKeyDown={(e) => e.key === "Tab" && onTabAdvance(e, item.id, "description")}
                  placeholder="Toebehoren"
                />
              </>
            ) : (
              <Input
                className="h-7 rounded-md"
                value={item.typeCode === 1 ? item.description || "" : item.label || ""}
                onFocus={() => setActiveField("label")}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onInlineEdit(item.id, item.typeCode === 1 ? "description" : "label", e.target.value)}
                placeholder="Naam"
              />
            )}
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" className="h-7 rounded-md" onClick={(e) => { e.stopPropagation(); onSpeech(item.id); }}>
                <Mic className="mr-1.5 h-3.5 w-3.5" /> Spraak
              </Button>
              <Button size="sm" variant="outline" className="h-7 rounded-md" onClick={(e) => { e.stopPropagation(); onAiAssist(item.id); }}>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI
              </Button>
            </div>
          </div>
        )}
      </div>

      <div
        className="pt-1.5"
        onClick={() => {
          onSelect(item.id);
          if (item.typeCode === 0) onEnterEditMode(item.id, "code");
        }}
      >
        {active && item.typeCode === 0 ? (
          <InlineCodeField
            inputRef={codeRef}
            value={item.code || ""}
            active={activeSuggest === "code"}
            onFocus={() => {
              setActiveField("code");
              setSuggestionState({ rowId: item.id, field: "code" });
            }}
            onChange={(value) => onInlineEdit(item.id, "code", value)}
          />
        ) : item.code ? (
          <Badge className="rounded-full uppercase">{item.code}</Badge>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      <div
        className="pt-1.5 text-right font-medium text-slate-700"
        onClick={() => {
          onSelect(item.id);
          if (item.typeCode === 0) onEnterEditMode(item.id, "unitValue");
          if (item.typeCode === 1) onEnterEditMode(item.id, null);
        }}
      >
        {active && (item.typeCode === 0 || item.typeCode === 1) ? (
          <Input
            ref={unitValueRef}
            className="h-7 rounded-md text-right"
            value={item.unitValue ?? ""}
            onFocus={() => setActiveField("unitValue")}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onInlineEdit(item.id, "unitValue", e.target.value)}
            onKeyDown={(e) => item.typeCode === 0 && e.key === "Tab" && onTabAdvance(e, item.id, "brand")}
            placeholder={item.typeCode === 1 ? "Totaalprijs" : "Deelprijs"}
          />
        ) : item.unitValue !== "" && item.unitValue !== null && item.unitValue !== undefined ? (
          euro(item.unitValue)
        ) : (
          "—"
        )}
      </div>

      <div
        className={`pt-1.5 text-right font-semibold ${item.overrideTotalActive ? "text-red-600" : "text-slate-900"}`}
        onClick={() => {
          onSelect(item.id);
          if (item.typeCode === 0 || item.typeCode === 1) onEnterEditMode(item.id, null);
        }}
      >
        {item.overrideTotalActive ? `(${euro(item.calculatedTotalValue)}) ${euro(item.totalValue)}` : item.totalValue ? euro(item.totalValue) : "—"}
      </div>

      <div className="flex items-center justify-end gap-1 pt-1">
        <PrintToggle value={item.print !== false} onToggle={() => onTogglePrint(item.id)} />
        <button
          title={parkingActive ? "Uit parkeerplaats halen" : "In parkeerplaats plaatsen"}
          className={`rounded-md border border-transparent p-2 shadow-none outline-none ${parkingActive ? "bg-orange-200 text-orange-800" : "bg-slate-100 text-slate-500"}`}
          onClick={(e) => {
            e.stopPropagation();
            onMoveToParking(item.id);
          }}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>
        <button
          title="Verwijder regel"
          className="rounded-md border border-transparent p-2 shadow-none outline-none bg-rose-100 text-rose-700"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRow(item.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function OpnametoolDemo() {
  const [data, setData] = useState<RowItem[]>(recomputeTotals(reportTree));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parkingArea, setParkingArea] = useState<RowItem[]>([]);
  const [clipboardItem, setClipboardItem] = useState<RowItem | null>(null);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [insertTarget, setInsertTarget] = useState<{ targetId: string; mode: InsertMode } | null>(null);
    const [history, setHistory] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [deviceView, setDeviceView] = useState<"tablet" | "mobile">("tablet");
  const [showCsv, setShowCsv] = useState(false);
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [suggestionState, setSuggestionState] = useState<SuggestionState>(null);
  const [templateCompanyFilter, setTemplateCompanyFilter] = useState("Alle bedrijven");
  const [templateRoomFilter, setTemplateRoomFilter] = useState("Alle ruimtes");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    sec1: true,
    lvl1: true,
    lvl1a: true,
    grp1a: true,
    lvl1b: true,
    grp2a: true,
    lvl1c: true,
    grp3a: true,
    lvl2: true,
    lvl2a: true,
    grp4a: true,
    sec2: true,
    grp5: true,
    grp5a: true,
    grp5b: true,
    grp5c: true,
  });

  const rows = useMemo(() => flattenTree(data, expanded), [data, expanded]);
  const selectedItem = rows.find((r) => r.id === selectedId) || null;
  const changedCount = rows.filter((r) => r.changed).length;
  const unseenCount = rows.filter((r) => r.description && !r.seen).length;
  const currentTotal = useMemo(() => calculateCurrentLeafTotal(data), [data]);
  const filteredRows = useMemo(
    () => rows.filter((r) => `${r.label || ""} ${combinedDescription(r) || ""} ${r.code || ""} ${r.room || ""}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );
  const normalizedRows = useMemo(
    () => filteredRows.map((r) => ({ ...r, label: r.typeCode === 2 ? titleCase(r.label) : r.label })),
    [filteredRows],
  );

  const companyFilterOptions = useMemo(() => ["Alle bedrijven", ...Array.from(new Set(templatePresets.map((t) => t.companyType)))], []);
  const roomFilterOptions = useMemo(() => ["Alle ruimtes", ...Array.from(new Set(templatePresets.map((t) => t.roomType)))], []);
  const filteredTemplates = useMemo(
    () =>
      templatePresets.filter(
        (t) =>
          (templateCompanyFilter === "Alle bedrijven" || t.companyType === templateCompanyFilter) &&
          (templateRoomFilter === "Alle ruimtes" || t.roomType === templateRoomFilter),
      ),
    [templateCompanyFilter, templateRoomFilter],
  );

  const csvPreview = useMemo(() => {
    const header = ["Sectie", "Niveau", "Ruimte", "Count", "Brand", "BrandModel", "Description", "Belongings", "Code", "Deelprijs", "Totaal", "Gezien", "Print", "Gewijzigd"];
    const body = rows
      .filter((r) => r.description)
      .map((r) => [
        r.section,
        r.level,
        r.room,
        r.count ?? "",
        r.brand ?? "",
        r.brandModel ?? "",
        r.description ?? "",
        r.belongings ?? "",
        r.code ?? "",
        r.unitValue ?? "",
        r.totalValue ?? "",
        r.seen ? "1" : "0",
        r.print !== false ? "1" : "0",
        r.changed ? "1" : "0",
      ]);
    return [header, ...body].map((row) => row.join(";")).join("\n");
  }, [rows]);

  const pushHistory = (nextData: RowItem[], nextParking = parkingArea) => {
    setHistory((prev) => [...prev.slice(-49), snapshotState(data, parkingArea)]);
    setFuture([]);
    setData(nextData);
    setParkingArea(nextParking);
  };

  const undoAction = () => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const previous = prev[prev.length - 1];
      setFuture((f) => [snapshotState(data, parkingArea), ...f].slice(0, 50));
      setData(previous.data);
      setParkingArea(previous.parkingArea);
      return prev.slice(0, -1);
    });
  };

  const redoAction = () => {
    setFuture((prev) => {
      if (!prev.length) return prev;
      const next = prev[0];
      setHistory((h) => [...h.slice(-49), snapshotState(data, parkingArea)]);
      setData(next.data);
      setParkingArea(next.parkingArea);
      return prev.slice(1);
    });
  };

  const enterEditMode = (id: string | null, field: (typeof FIELD_ORDER)[number] | "code" | null = null) => {
    setSelectedId(id);
    setEditingId(id);
    if (!id) {
      setFocusField(null);
      setActiveField(null);
      return;
    }
    const node = findNode(data, id);
    if (field) {
      setFocusField(field);
      setActiveField(field);
      return;
    }
    if (node?.typeCode === 0) {
      setFocusField("description");
      setActiveField("description");
    } else {
      setFocusField(null);
      setActiveField("label");
    }
  };

  const toggleSeen = (id: string) => {
    const node = findNode(data, id);
    if (!node) return;
    const newSeen = !node.seen;
    const cascade = (n: RowItem): RowItem => ({ ...n, seen: newSeen, changed: true, children: n.children?.map(cascade) });
    pushHistory(updateNode(data, id, cascade));
  };

  const togglePrint = (id: string) => {
    const node = findNode(data, id);
    if (!node) return;
    const newPrint = !(node.print !== false);
    pushHistory(updateNode(data, id, (n) => ({ ...n, print: newPrint, changed: true })));
  };

  const onInlineEdit = (id: string, field: keyof RowItem, value: unknown) => {
    pushHistory(updateNode(data, id, (node) => ({ ...node, [field]: value as never, changed: true })));
  };

  const onSpeech = async (id: string) => {
    const item = findNode(data, id);
    if (!item) return;
    const browserWindow = window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    const RecognitionClass = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!RecognitionClass) {
      const fallback = applySpeechFlow(item);
      pushHistory(updateNode(data, id, (node) => ({ ...node, ...fallback, changed: true })));
      return;
    }
    const recognition = new RecognitionClass();
    recognition.lang = "nl-NL";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      const updates = parseSpeechText(transcript, item) || applySpeechFlow(item);
      pushHistory(updateNode(data, id, (node) => ({ ...node, ...updates, changed: true })));
    };
    recognition.onerror = () => {
      const fallback = applySpeechFlow(item);
      pushHistory(updateNode(data, id, (node) => ({ ...node, ...fallback, changed: true })));
    };
    recognition.start();
  };

  const onAiAssist = async (id: string) => {
    const item = findNode(data, id);
    if (!item) return;
    const updates = aiAssistForItem(item);
    pushHistory(updateNode(data, id, (node) => ({ ...node, ...updates, changed: true })));
  };

  const moveToParking = (id: string) => {
    const node = findNode(data, id);
    if (!node) return;
    if (node.parked) {
      const clearParked = (n: RowItem): RowItem => ({ ...n, parked: false, children: n.children?.map(clearParked) });
      const nextParking = parkingArea.filter((p) => p.id !== id);
      pushHistory(updateNode(data, id, clearParked), nextParking);
      return;
    }
    const nextParking = parkingArea.find((p) => p.id === id) ? parkingArea : [...parkingArea, { ...cloneDeep(node), parked: true }];
    const cascade = (n: RowItem): RowItem => ({ ...n, parked: true, changed: true, children: n.children?.map(cascade) });
    pushHistory(updateNode(data, id, cascade), nextParking);
  };

  const restoreFromParking = (id: string) => {
    const parkedNode = parkingArea.find((item) => item.id === id);
    if (!parkedNode || !selectedId) return;
    const clean = (n: RowItem): RowItem => ({ ...n, parked: false, children: n.children?.map(clean) });
    const cleanedNode = clean(parkedNode);
    const nextParking = parkingArea.filter((item) => item.id !== id);
    const removed = removeNode(data, id).next;
    pushHistory(recomputeTotals(insertAsChildOfSelection(removed, selectedId, cleanedNode)), nextParking);
  };

  const addNewItem = () => {
    const draft: RowItem = {
      id: `new-${Date.now()}`,
      typeCode: 0,
      count: 1,
      brand: "",
      brandModel: "",
      description: "",
      belongings: "",
      code: "",
      unitValue: "",
      totalValue: 0,
      seen: false,
      print: true,
      changed: true,
    };
    if (insertTarget?.targetId) {
      pushHistory(recomputeTotals(moveNode([...data, draft], draft.id, insertTarget.targetId, insertTarget.mode)));
    } else {
      const targetParent = selectedItem?.id || "lvl1";
      pushHistory(recomputeTotals(insertAsChildOfSelection(data, targetParent, draft)));
    }
    setSelectedId(draft.id);
    setEditingId(draft.id);
    setFocusField("description");
    setActiveField("description");
  };

  const addNewLevel = () => {
    const draft: RowItem = { id: `new-level-${Date.now()}`, typeCode: 2, label: "", seen: false, print: true, changed: true, children: [] };
    if (insertTarget?.targetId) {
      pushHistory(recomputeTotals(moveNode([...data, draft], draft.id, insertTarget.targetId, insertTarget.mode)));
    } else {
      const targetParent = selectedItem?.id || "lvl1";
      pushHistory(recomputeTotals(insertAsChildOfSelection(data, targetParent, draft)));
    }
    setSelectedId(draft.id);
    setEditingId(draft.id);
    setActiveField(null);
  };

  const applyTemplate = (preset: TemplatePreset) => {
    let nextData = data;
    const templateNodes = preset.nodes.map(makeNodeFromTemplate);
    templateNodes.forEach((node) => {
      if (insertTarget?.targetId) {
        nextData = insertTarget.mode === "inside"
          ? recomputeTotals(insertAsFirstChild(nextData, insertTarget.targetId, node))
          : recomputeTotals(insertAfter(nextData, insertTarget.targetId, node));
      } else {
        const targetParent = selectedItem?.id || "lvl1";
        nextData = recomputeTotals(insertAsChildOfSelection(nextData, targetParent, node));
      }
    });
    pushHistory(nextData);
  };

  const copySelected = () => {
    if (!selectedId) return;
    const node = findNode(data, selectedId);
    if (node) setClipboardItem(cloneDeep(node));
  };

  const remapIds = (node: RowItem): RowItem => ({
    ...node,
    id: `${node.id}-copy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    changed: true,
    children: node.children?.map(remapIds),
  });

  const pasteClipboard = () => {
    if (!clipboardItem) return;
    const clone = remapIds(clipboardItem);
    if (insertTarget?.targetId) {
      pushHistory(recomputeTotals(moveNode([...data, clone], clone.id, insertTarget.targetId, insertTarget.mode)));
      return;
    }
    if (!selectedId) return;
    pushHistory(recomputeTotals(insertAsChildOfSelection(data, selectedId, clone)));
  };

  const deleteSelectedOrRow = (id: string) => {
    const nextParking = parkingArea.filter((p) => p.id !== id);
    pushHistory(recomputeTotals(removeNode(data, id).next), nextParking);
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleTabAdvance = (e: React.KeyboardEvent<HTMLInputElement>, rowId: string, nextField: (typeof FIELD_ORDER)[number]) => {
    e.preventDefault();
    setSelectedId(rowId);
    setEditingId(rowId);
    setActiveField(nextField);
    setFocusField(nextField);
  };

  const cycleTabField = () => {
    if (!selectedId || editingId !== selectedId) return;
    const node = findNode(data, selectedId);
    if (!node || node.typeCode !== 0) return;
    const current = FIELD_ORDER.includes((activeField || "") as (typeof FIELD_ORDER)[number])
      ? (activeField as (typeof FIELD_ORDER)[number])
      : FIELD_ORDER[0];
    const idx = FIELD_ORDER.indexOf(current);
    const next = FIELD_ORDER[(idx + 1) % FIELD_ORDER.length];
    setActiveField(next);
    setFocusField(next);
  };

  const handleDrop = (targetId: string, mode: InsertMode = "after") => {
    if (!draggedId || draggedId === targetId) return;
    pushHistory(moveNode(data, draggedId, targetId, mode));
    setDraggedId(null);
    setInsertTarget(null);
  };

  const screenClass = deviceView === "mobile" ? "mx-auto max-w-[430px]" : "";
  const spacerClass = "h-[2px] rounded-sm border-0";

  return (
    <div className="min-h-screen bg-[#f3f0ea] p-4 md:p-8">
      <div className={`mx-auto max-w-7xl ${screenClass}`}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Taxatietool Nick</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={deviceView === "tablet" ? "default" : "outline"} className="rounded-2xl" onClick={() => setDeviceView("tablet")}>
              <Tablet className="mr-2 h-4 w-4" /> Tablet
            </Button>
            <Button variant={deviceView === "mobile" ? "default" : "outline"} className="rounded-2xl" onClick={() => setDeviceView("mobile")}>
              <Smartphone className="mr-2 h-4 w-4" /> Mobiel
            </Button>
            <Button className="rounded-2xl" variant="outline" onClick={() => setShowCsv(true)}>
              <FileDown className="mr-2 h-4 w-4" /> CSV-preview
            </Button>
          </div>
        </motion.div>

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Rapportagevorm</div><div className="mt-2 text-lg font-semibold text-slate-900">Standaard</div></CardContent></Card>
          <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Gewijzigde regels</div><div className="mt-2 text-2xl font-semibold text-amber-700">{changedCount}</div></CardContent></Card>
          <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Niet gezien</div><div className="mt-2 text-2xl font-semibold text-slate-900">{unseenCount}</div></CardContent></Card>
          <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Parkeerplaats</div><div className="mt-2 text-2xl font-semibold text-slate-900">{parkingArea.length}</div></CardContent></Card>
        </div>

        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader className="rounded-t-[28px] border-b border-stone-200 bg-stone-50/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div><CardTitle>Opnamerapport</CardTitle></div>
              <div className="flex gap-2">
                <div className="relative w-full min-w-[220px] lg:w-[280px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl bg-white pl-9" placeholder="Zoek in rapportregels" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="rounded-[24px] border border-stone-200 bg-[#fbfaf7] p-4 md:p-6 shadow-inner">
              <div className="mb-5 border-b border-stone-200 pb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Taxatierapport 123456-01-0</div>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <div className="text-2xl font-semibold text-slate-900">Troostwijk Taxaties B.V.</div>
                  <div className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm">
                    <div className="flex items-center gap-4">
                      <div><div className="text-stone-500">Totaal vóór wijzigingen</div><div className="text-base font-semibold text-slate-900">{euro(INITIAL_TOTAL)}</div></div>
                      <div><div className="text-stone-500">Totaal huidige situatie</div><div className="text-base font-semibold text-slate-900">{euro(currentTotal)}</div></div>
                      <div><div className="text-stone-500">Verschil</div><div className={`text-base font-semibold ${currentTotal - INITIAL_TOTAL === 0 ? "text-slate-900" : currentTotal - INITIAL_TOTAL > 0 ? "text-emerald-700" : "text-rose-700"}`}>{euro(currentTotal - INITIAL_TOTAL)}</div></div>
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 text-sm text-stone-600">De Entree 227, 1101 HG Amsterdam • Taxatiedatum 17 maart 2026</div>
              </div>

              <div className="sticky top-2 z-10 mb-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-700">
                <div
                  className="grid items-center gap-0.5 rounded-sm border border-stone-200 bg-stone-50 px-1 py-2 shadow-sm"
                  style={{ gridTemplateColumns: "30px 0px 18px 30px 88px minmax(340px,1.9fr) 80px 100px 140px 182px" }}
                >
                  <div className="flex items-center justify-center">Gezien</div>
                  <div />
                  <div />
                  <div />
                  <div className="text-left">Aantal</div>
                  <div className="text-left">Omschrijving</div>
                  <div className="text-left">Code</div>
                  <div className="text-right">Deelprijs</div>
                  <div className="text-right">Totaal</div>
                  <div className="text-right">Status</div>
                </div>
              </div>

              <div className="space-y-[2px]">
                {normalizedRows.flatMap((item) => {
                  const afterKey = `after-${item.id}`;
                  const activeAfter = insertTarget?.targetId === item.id && insertTarget?.mode === "inside";
                  const spacerStyle = (active: boolean) => `${spacerClass} ${active ? "bg-green-200" : "bg-transparent"}`;
                  return [
                    <Row
                      key={item.id}
                      item={item}
                      active={editingId === item.id}
                      selectedOnly={selectedId === item.id && editingId !== item.id}
                      expanded={expanded}
                      onToggleExpand={(id) => setExpanded((prev) => ({ ...prev, [id]: prev[id] === false ? true : false }))}
                      onSelect={(id) => {
                        setSelectedId(id);
                        setSuggestionState(null);
                        setInsertTarget(null);
                      }}
                      onEnterEditMode={enterEditMode}
                      onToggleSeen={toggleSeen}
                      onTogglePrint={togglePrint}
                      onMoveToParking={moveToParking}
                      onDeleteRow={deleteSelectedOrRow}
                      onDragStart={setDraggedId}
                      onDragOver={() => setInsertTarget(null)}
                      onDrop={(id) => handleDrop(id, "after")}
                      onInlineEdit={onInlineEdit}
                      onSpeech={onSpeech}
                      onAiAssist={onAiAssist}
                      suggestionState={suggestionState}
                      setSuggestionState={setSuggestionState}
                      focusField={selectedId === item.id ? focusField : null}
                      setFocusField={setFocusField}
                      activeField={selectedId === item.id ? activeField : null}
                      setActiveField={setActiveField}
                      onTabAdvance={handleTabAdvance}
                    />,
                    <div
                      key={afterKey}
                      className={spacerStyle(activeAfter)}
                      style={{ marginLeft: `${30 + 18 + 30 + item.depth * 14}px` }}
                      onClick={() => {
                        setSelectedId(item.id);
                        setInsertTarget({ targetId: item.id, mode: "inside" });
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setInsertTarget({ targetId: item.id, mode: "inside" });
                      }}
                      onDrop={() => handleDrop(item.id, "inside")}
                    />,
                  ];
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-[28px] border-0 shadow-sm">
            <CardHeader><CardTitle>Parkeerplaats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {parkingArea.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Nog geen items in de parkeerplaats.</div>
              ) : (
                parkingArea.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-900">{item.description ? combinedDescription(item) : item.label}</div>
                      <div className="text-xs text-slate-500">{item.description ? item.code || "geen code" : "structuur"}</div>
                    </div>
                    <Button className="rounded-2xl" variant="outline" onClick={() => restoreFromParking(item.id)} disabled={!selectedId}>
                      <Undo2 className="mr-2 h-4 w-4" /> Zet terug
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-0 shadow-sm">
            <CardHeader><CardTitle>Snel nieuwe taxatie opbouwen met templates</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4">
                Voorstel: gebruik templates per type bedrijf en ruimte, zodat je snel niveaus, subniveaus, objectgroepen en objecten kunt toevoegen bij een volledig nieuwe opname.
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Type bedrijf</div>
                  <div className="flex flex-wrap gap-2">
                    {companyFilterOptions.map((option) => (
                      <Button key={option} size="sm" variant={templateCompanyFilter === option ? "default" : "outline"} onClick={() => setTemplateCompanyFilter(option)}>{option}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Type ruimte</div>
                  <div className="flex flex-wrap gap-2">
                    {roomFilterOptions.map((option) => (
                      <Button key={option} size="sm" variant={templateRoomFilter === option ? "default" : "outline"} onClick={() => setTemplateRoomFilter(option)}>{option}</Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                {filteredTemplates.map((preset) => (
                  <div key={preset.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-100 p-2 text-slate-700"><LayoutTemplate className="h-4 w-4" /></div>
                      <div>
                        <div className="font-medium text-slate-900">{preset.title}</div>
                        <div className="text-xs text-slate-500">{preset.companyType} • {preset.roomType}</div>
                      </div>
                    </div>
                    <Button onClick={() => applyTemplate(preset)} className="rounded-2xl">Template toevoegen</Button>
                  </div>
                ))}
                {filteredTemplates.length === 0 ? <div className="rounded-2xl bg-slate-50 p-4 text-slate-500">Geen templates gevonden voor deze filters.</div> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
          <Button className="h-14 w-14 rounded-full bg-white shadow-xl hover:bg-stone-50" variant="outline" title="Ongedaan maken" onClick={undoAction} disabled={!history.length}><Undo2 className="h-6 w-6" /></Button>
          <Button className="h-14 w-14 rounded-full bg-white shadow-xl hover:bg-stone-50" variant="outline" title="Opnieuw uitvoeren" onClick={redoAction} disabled={!future.length}><Redo2 className="h-6 w-6" /></Button>
          <Button className="h-16 w-16 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800" title="Tab naar volgende veld" onClick={cycleTabField} disabled={!selectedId || editingId !== selectedId}>Tab</Button>
        </div>

        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
          <Button className="h-20 w-20 rounded-full bg-blue-600 shadow-xl hover:bg-blue-700" onClick={addNewLevel} title="Niveau toevoegen"><Plus className="h-8 w-8" /></Button>
          <Button className="h-20 w-20 rounded-full bg-emerald-600 shadow-xl hover:bg-emerald-700" onClick={addNewItem} title="Nieuw object toevoegen"><Plus className="h-8 w-8" /></Button>
          <Button className="h-16 w-16 rounded-full bg-white shadow-xl hover:bg-stone-50" variant="outline" onClick={copySelected} title="Kopieer geselecteerde regel" disabled={!selectedId}><Copy className="h-7 w-7" /></Button>
          <Button className="h-16 w-16 rounded-full bg-white shadow-xl hover:bg-stone-50" variant="outline" onClick={pasteClipboard} title="Plak onder geselecteerde regel of op geselecteerde invoegpositie" disabled={!clipboardItem}><ClipboardPaste className="h-7 w-7" /></Button>
        </div>


        <Dialog open={showCsv} onOpenChange={setShowCsv}>
          <DialogContent className="max-w-5xl rounded-[28px]">
            <DialogHeader>
              <DialogTitle>CSV-preview voor import in TAC</DialogTitle>
              <DialogDescription>Conceptuele export met Count, Brand, BrandModel, Description, Belongings en Print.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[440px] overflow-auto rounded-2xl bg-slate-950 p-4 font-mono text-sm text-slate-100 whitespace-pre-wrap">{csvPreview}</div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/*
Regression checks:
1. The file must parse as TSX without syntax errors.
2. moveNode(nodes, draggedId, targetId, "inside") should nest the dragged item under targetId.
3. moveNode(nodes, draggedId, targetId, "after") should place the dragged item directly after targetId.
4. addNewItem() should create an object row that opens full edit fields.
5. addNewLevel() should create a level row that opens a single name field.
6. CountEditor should render buttons under the count input.
7. Newly added rows (id starts with new-) should not influence seen-completion on parent levels/groups.
8. The floating Tab button should cycle exactly like keyboard Tab within an active object row.
9. Templates should be filterable by company type and room type and insert reusable structures.
10. Seen checkboxes should stay aligned in a fixed left column while indentation affects the content area only.
*/
