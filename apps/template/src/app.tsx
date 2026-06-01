import {
  ArchiveIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CommandIcon,
  CopyIcon,
  DatabaseIcon,
  DownloadIcon,
  FileTextIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  ListFilterIcon,
  MailIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const installedComponents = [
  "accordion",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button-group",
  "button",
  "card",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input-group",
  "input",
  "item",
  "kbd",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle-group",
  "toggle",
  "tooltip",
] as const;

const sections = [
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data",
  "Feedback",
  "Layout",
] as const;

function PreviewCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="min-h-56">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="flex w-full flex-col items-start gap-4 text-left">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-28 border-t px-5 py-10 sm:px-8" id={id}>
      <div className="mx-auto grid w-full max-w-7xl gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-muted-foreground text-xs uppercase">
            {eyebrow}
          </span>
          <h2 className="font-semibold text-2xl tracking-normal">{title}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline">shadcn/ui installed preview</Badge>
              <h1 className="mt-4 text-balance font-semibold text-4xl tracking-normal sm:text-5xl">
                Component library preview
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                A compact view of the components currently installed in{" "}
                <Kbd>src/components/ui</Kbd>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  toast.success(
                    "Sonner toast is wired through the root layout."
                  )
                }
              >
                <BellIcon data-icon="inline-start" />
                Toast
              </Button>
              <Button variant="outline">
                <DownloadIcon data-icon="inline-start" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {installedComponents.map((component) => (
              <Badge key={component} variant="secondary">
                {component}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-b bg-background/90 px-5 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {sections.map((section) => (
            <Button
              key={section}
              nativeButton={false}
              render={<a href={`#${section.toLowerCase()}`}>{section}</a>}
              variant="ghost"
            />
          ))}
        </div>
      </nav>

      <Section eyebrow="Primitives" id="actions" title="Actions">
        <PreviewCard
          description="Button variants, icon sizing, and button group."
          title="Button, ButtonGroup"
        >
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button size="icon" variant="ghost">
              <SettingsIcon />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
          <ButtonGroup>
            <Button variant="outline">
              <CopyIcon data-icon="inline-start" />
              Copy
            </Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Paste</Button>
            <ButtonGroupText>⌘K</ButtonGroupText>
          </ButtonGroup>
        </PreviewCard>

        <PreviewCard
          description="Single toggle, grouped toggles, keyboard keys, and tooltips."
          title="Toggle, ToggleGroup, Kbd, Tooltip"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Toggle
              aria-label="Toggle favorites"
              defaultPressed
              variant="outline"
            >
              <StarIcon data-icon="inline-start" />
              Favorite
            </Toggle>
            <ToggleGroup defaultValue={["preview"]} multiple variant="outline">
              <ToggleGroupItem aria-label="Preview" value="preview">
                <SparklesIcon />
              </ToggleGroupItem>
              <ToggleGroupItem aria-label="Archive" value="archive">
                <ArchiveIcon />
              </ToggleGroupItem>
              <ToggleGroupItem aria-label="Settings" value="settings">
                <SettingsIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover for shortcut
            </TooltipTrigger>
            <TooltipContent>
              Open palette{" "}
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </PreviewCard>

        <PreviewCard
          description="Badge variants, spinner status, and separator rhythm."
          title="Badge, Spinner, Separator"
        >
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <Separator />
          <div className="flex items-center gap-3 text-sm">
            <Spinner />
            Syncing component registry
          </div>
        </PreviewCard>
      </Section>

      <Section eyebrow="Inputs" id="forms" title="Forms">
        <PreviewCard
          description="Inputs, labels, native select, textarea, and field helpers."
          title="Field, Label, Input, Textarea"
        >
          <FieldSet className="w-full">
            <FieldLegend>Profile</FieldLegend>
            <FieldGroup>
              <Field>
                <Label htmlFor="standalone-label">Standalone label</Label>
                <Input defaultValue="Label component" id="standalone-label" />
              </Field>
              <Field>
                <FieldLabel htmlFor="preview-email">Email</FieldLabel>
                <Input
                  defaultValue="paul@karnet.app"
                  id="preview-email"
                  type="email"
                />
                <FieldDescription>
                  Used for notification previews.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="preview-note">Note</FieldLabel>
                <Textarea
                  defaultValue="Remember to review the component states."
                  id="preview-note"
                />
              </Field>
              <FieldSeparator>Choice</FieldSeparator>
              <Field>
                <FieldLabel htmlFor="native-density">Density</FieldLabel>
                <NativeSelect defaultValue="compact" id="native-density">
                  <NativeSelectOptGroup label="Display">
                    <NativeSelectOption value="compact">
                      Compact
                    </NativeSelectOption>
                    <NativeSelectOption value="comfortable">
                      Comfortable
                    </NativeSelectOption>
                  </NativeSelectOptGroup>
                </NativeSelect>
              </Field>
            </FieldGroup>
          </FieldSet>
        </PreviewCard>

        <PreviewCard
          description="Checkbox, radio group, switch, slider, and validation text."
          title="Checkbox, RadioGroup, Switch, Slider"
        >
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox defaultChecked id="memory-enabled" />
              <FieldContent>
                <FieldTitle>Memory enabled</FieldTitle>
                <FieldDescription>
                  Keeps context available for future runs.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Switch defaultChecked id="quiet-mode" />
              <FieldContent>
                <FieldLabel htmlFor="quiet-mode">Quiet mode</FieldLabel>
              </FieldContent>
            </Field>
            <RadioGroup defaultValue="daily">
              <Field orientation="horizontal">
                <RadioGroupItem id="radio-daily" value="daily" />
                <FieldLabel htmlFor="radio-daily">Daily digest</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem id="radio-weekly" value="weekly" />
                <FieldLabel htmlFor="radio-weekly">Weekly digest</FieldLabel>
              </Field>
            </RadioGroup>
            <Slider defaultValue={[64]} />
            <FieldError>Preview error message</FieldError>
          </FieldGroup>
        </PreviewCard>

        <PreviewCard
          description="Composed input groups and select trigger/content."
          title="InputGroup, Select"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search components" />
            <InputGroupButton>
              <ListFilterIcon />
              Filter
            </InputGroupButton>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea placeholder="Draft a preview note..." />
            <InputGroupAddon align="block-end">
              <InputGroupText>Markdown</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <Select defaultValue="forms">
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Choose a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Preview sections</SelectLabel>
                <SelectItem value="actions">Actions</SelectItem>
                <SelectItem value="forms">Forms</SelectItem>
                <SelectSeparator />
                <SelectItem value="layout">Layout</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </PreviewCard>
      </Section>

      <Section eyebrow="Surfaces" id="overlays" title="Overlays">
        <PreviewCard
          description="Dialog, alert dialog, sheet, drawer, and popover triggers."
          title="Dialog, AlertDialog, Sheet, Drawer, Popover"
        >
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog preview</DialogTitle>
                  <DialogDescription>
                    A modal surface with header, footer, and close controls.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>
                Alert
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <CircleAlertIcon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Confirm preview action</AlertDialogTitle>
                  <AlertDialogDescription>
                    Alert dialogs focus attention on a decision.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Sheet
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet preview</SheetTitle>
                  <SheetDescription>
                    Slide-over content for secondary workflows.
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <Button>Apply</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer preview</DrawerTitle>
                  <DrawerDescription>
                    Bottom-first mobile surface from Vaul.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>
                Popover
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Popover preview</PopoverTitle>
                  <PopoverDescription>
                    Small anchored content for extra detail.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
        </PreviewCard>

        <PreviewCard
          description="Menu primitives including submenu, checkbox, radio, and shortcuts."
          title="DropdownMenu, ContextMenu, Menubar"
        >
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Dropdown
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  Copy
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuCheckboxItem checked>
                  Show details
                </DropdownMenuCheckboxItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value="list">
                  <DropdownMenuRadioItem value="grid">
                    Grid
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="list">
                    List
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <ContextMenu>
              <ContextMenuTrigger className="rounded-lg border border-dashed px-3 py-1.5 text-sm">
                Right-click
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuLabel>Context</ContextMenuLabel>
                <ContextMenuItem>
                  Rename
                  <ContextMenuShortcut>R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuCheckboxItem checked>
                  Starred
                </ContextMenuCheckboxItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>Inbox</ContextMenuItem>
                    <ContextMenuItem>Archive</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuRadioGroup value="now">
                  <ContextMenuRadioItem value="now">Now</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="later">
                    Later
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuContent>
            </ContextMenu>
          </div>

          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New note
                  <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Export</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>PDF</MenubarItem>
                    <MenubarItem>Markdown</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value="preview">
                  <MenubarRadioItem value="preview">Preview</MenubarRadioItem>
                  <MenubarRadioItem value="source">Source</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </PreviewCard>

        <PreviewCard
          description="Hover cards and command palette shell."
          title="HoverCard, Command, CommandDialog"
        >
          <HoverCard>
            <HoverCardTrigger render={<Button variant="outline" />}>
              Hover card
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>KC</AvatarFallback>
                  <AvatarBadge />
                </Avatar>
                <div>
                  <p className="font-medium">Karnet components</p>
                  <p className="text-muted-foreground text-sm">
                    Hover surface with arbitrary content.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <Command className="h-52 border">
            <CommandInput placeholder="Search commands..." />
            <CommandList>
              <CommandEmpty>No commands found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <HomeIcon />
                  Dashboard
                  <CommandShortcut>⌘1</CommandShortcut>
                </CommandItem>
                <CommandItem data-checked="true">
                  <CommandIcon />
                  Command palette
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="System">
                <CommandItem>
                  <SettingsIcon />
                  Settings
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          <CommandDialog open={false}>
            <Command>
              <CommandInput placeholder="Hidden dialog preview" />
            </Command>
          </CommandDialog>
        </PreviewCard>
      </Section>

      <Section eyebrow="Wayfinding" id="navigation" title="Navigation">
        <PreviewCard
          description="Breadcrumbs, navigation menu, and pagination."
          title="Breadcrumb, NavigationMenu, Pagination"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Components</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Library</NavigationMenuTrigger>
                <NavigationMenuIndicator />
                <NavigationMenuContent className="w-56">
                  <NavigationMenuLink href="#actions">
                    <ZapIcon />
                    Actions
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#forms">
                    <SlidersHorizontalIcon />
                    Forms
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#layout">Layout</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#navigation" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#navigation" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#data" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </PreviewCard>

        <PreviewCard
          description="Sidebar provider, rail, trigger, inset, groups, actions, badges, and skeleton."
          title="Sidebar"
        >
          <div className="h-72 w-full overflow-hidden rounded-lg border">
            <SidebarProvider className="h-full min-h-full" defaultOpen>
              <Sidebar className="relative h-full border-r" collapsible="none">
                <SidebarHeader>
                  <SidebarInput placeholder="Search" />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarGroupAction aria-label="Add">
                      <PlusIcon />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive tooltip="Dashboard">
                            <LayoutDashboardIcon />
                            <span>Dashboard</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>3</SidebarMenuBadge>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton tooltip="Inbox">
                            <InboxIcon />
                            <span>Inbox</span>
                          </SidebarMenuButton>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontalIcon />
                          </SidebarMenuAction>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton href="#navigation">
                                <span>Unread</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </SidebarMenuItem>
                        <SidebarMenuSkeleton showIcon />
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarSeparator />
                <SidebarFooter>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <UserIcon />
                        <span>Paul</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
              </Sidebar>
              <SidebarInset className="min-h-full p-3">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <PanelLeftIcon className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Embedded sidebar preview
                  </span>
                </div>
                <div className="mt-4 rounded-lg border border-dashed p-4 text-sm">
                  SidebarInset content area
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </PreviewCard>
      </Section>

      <Section eyebrow="Records" id="data" title="Data Display">
        <PreviewCard
          description="Table caption, header, body, and footer."
          title="Table"
        >
          <Table>
            <TableCaption>Installed component counts by group.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Forms</TableCell>
                <TableCell>9</TableCell>
                <TableCell>
                  <Badge variant="secondary">Ready</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Overlays</TableCell>
                <TableCell>7</TableCell>
                <TableCell>
                  <Badge variant="secondary">Ready</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total files</TableCell>
                <TableCell colSpan={2}>{installedComponents.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </PreviewCard>

        <PreviewCard
          description="Avatar group, item lists, and structured item content."
          title="Avatar, Item"
        >
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>PK</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>

          <ItemGroup>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <MailIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Morning digest</ItemTitle>
                <ItemDescription>
                  Summary of reminders and component checks.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline">
                  Open
                </Button>
              </ItemActions>
              <ItemFooter>
                <Badge variant="outline">item footer</Badge>
              </ItemFooter>
            </Item>
            <ItemSeparator />
            <Item variant="muted">
              <ItemHeader>
                <ItemTitle>Grouped item header</ItemTitle>
                <ChevronRightIcon className="size-4" />
              </ItemHeader>
            </Item>
          </ItemGroup>
        </PreviewCard>

        <PreviewCard
          description="Tabs for compact, switchable content areas."
          title="Tabs"
        >
          <Tabs className="w-full" defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent className="rounded-lg border p-3" value="preview">
              Component states are visible in one place.
            </TabsContent>
            <TabsContent className="rounded-lg border p-3" value="code">
              Import from <Kbd>@/components/ui</Kbd>.
            </TabsContent>
            <TabsContent className="rounded-lg border p-3" value="notes">
              Keep examples small and scannable.
            </TabsContent>
          </Tabs>
        </PreviewCard>
      </Section>

      <Section eyebrow="States" id="feedback" title="Feedback">
        <PreviewCard
          description="Alert states, action slot, and sonner toast trigger."
          title="Alert, Sonner"
        >
          <Alert>
            <SparklesIcon />
            <AlertTitle>Preview ready</AlertTitle>
            <AlertDescription>
              Alerts can include icons, descriptions, and actions.
            </AlertDescription>
            <AlertAction>
              <Button
                onClick={() => toast("Alert action clicked")}
                size="sm"
                variant="outline"
              >
                Notify
              </Button>
            </AlertAction>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Destructive alert</AlertTitle>
            <AlertDescription>
              Use for errors or risky actions.
            </AlertDescription>
          </Alert>
        </PreviewCard>

        <PreviewCard
          description="Empty state, skeleton placeholders, progress, and spinner."
          title="Empty, Skeleton, Progress"
        >
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>No pending tasks</EmptyTitle>
              <EmptyDescription>
                The empty component handles blank states.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">Create task</Button>
            </EmptyContent>
          </Empty>
          <div className="grid w-full gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Progress value={72}>
            <ProgressLabel>Coverage</ProgressLabel>
            <ProgressValue />
          </Progress>
        </PreviewCard>
      </Section>

      <Section eyebrow="Composition" id="layout" title="Layout">
        <PreviewCard
          description="Aspect ratio, scroll area, resizable panels, and collapsible content."
          title="AspectRatio, ScrollArea, Resizable, Collapsible"
        >
          <AspectRatio
            className="grid w-full place-items-center rounded-lg border bg-muted text-muted-foreground text-sm"
            ratio={16 / 7}
          >
            16:7 aspect ratio
          </AspectRatio>

          <ScrollArea className="h-24 w-full rounded-lg border">
            <div className="grid gap-2 p-3 text-sm">
              {installedComponents.slice(0, 16).map((component) => (
                <div className="flex items-center gap-2" key={component}>
                  <CheckIcon className="size-3" />
                  {component}
                </div>
              ))}
            </div>
          </ScrollArea>

          <ResizablePanelGroup
            className="min-h-28 rounded-lg border"
            orientation="horizontal"
          >
            <ResizablePanel defaultSize={45}>
              <div className="grid h-full place-items-center text-sm">Left</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={55}>
              <div className="grid h-full place-items-center text-sm">
                Right
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          <Collapsible defaultOpen>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-sm">Collapsible notes</span>
              <CollapsibleTrigger
                render={<Button size="sm" variant="outline" />}
              >
                Toggle
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-2 rounded-lg border p-3 text-muted-foreground text-sm">
              This content can be opened and closed.
            </CollapsibleContent>
          </Collapsible>
        </PreviewCard>

        <PreviewCard
          description="Accordion and card slots used throughout this catalog."
          title="Accordion, Card"
        >
          <Accordion defaultValue={["one"]}>
            <AccordionItem value="one">
              <AccordionTrigger>Why a catalog page?</AccordionTrigger>
              <AccordionContent>
                It makes the installed components visible without hunting
                through files.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Can these be customized?</AccordionTrigger>
              <AccordionContent>
                Yes. These local component files are owned by the app.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <CardFooter className="w-full justify-between">
            <span className="text-muted-foreground text-sm">Card footer</span>
            <CardAction>
              <Badge variant="outline">slot</Badge>
            </CardAction>
          </CardFooter>
        </PreviewCard>

        <PreviewCard
          description="Component count and quick reference."
          title="Installed Files"
        >
          <div className="grid w-full gap-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="font-medium text-sm">components/ui</span>
              <Badge>{installedComponents.length} files</Badge>
            </div>
            <div className="grid gap-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <DatabaseIcon className="size-4" />
                Data display, feedback, inputs, overlays, and layout.
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4" />
                Last edited in this local preview page.
              </div>
              <div className="flex items-center gap-2">
                <FileTextIcon className="size-4" />
                Source: local installed shadcn files.
              </div>
            </div>
          </div>
        </PreviewCard>
      </Section>
    </main>
  );
}

export default App;
