"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  User,
  Palette,
  FileText,
  Database,
  Bell,
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
  HardDrive,
  CheckCircle2,
  Globe,
  FolderTree,
  Shield,
  ArrowDownAZ,
  Eye,
  Type,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useLanguage, LANGUAGE_OPTIONS } from "@/hooks/use-language";
import { invalidateQueryCache } from "@/lib/mock-convex";

type SettingsTab =
  | "account"
  | "appearance"
  | "language"
  | "sidebar"
  | "editor"
  | "privacy"
  | "data"
  | "notifications";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ checked, onChange, disabled }: ToggleSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
      checked ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-md ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

const ACCENT_COLORS = [
  { id: "indigo", name: "Índigo", class: "bg-indigo-600", text: "text-indigo-600" },
  { id: "emerald", name: "Esmeralda", class: "bg-emerald-600", text: "text-emerald-600" },
  { id: "violet", name: "Violeta", class: "bg-violet-600", text: "text-violet-600" },
  { id: "amber", name: "Âmbar", class: "bg-amber-500", text: "text-amber-500" },
  { id: "rose", name: "Rosa", class: "bg-rose-600", text: "text-rose-600" },
  { id: "cyan", name: "Ciano", class: "bg-cyan-600", text: "text-cyan-600" },
  { id: "orange", name: "Laranja", class: "bg-orange-500", text: "text-orange-500" },
  { id: "sapphire", name: "Safira", class: "bg-blue-600", text: "text-blue-600" },
];

export const SettingsModal = () => {
  const settings = useSettings();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const {
    language,
    setLanguage,
    t,
    dateFormat,
    setDateFormat,
    is24Hour,
    setIs24Hour,
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General configuration states
  const [workspaceName, setWorkspaceName] = useState("Nexus Workspace");
  const [selectedFont, setSelectedFont] = useState("sans");
  const [accentColor, setAccentColor] = useState("indigo");
  const [highContrast, setHighContrast] = useState(false);
  const [bgPattern, setBgPattern] = useState("plain");
  const [borderRadius, setBorderRadius] = useState("subtle");
  const [darkVariant, setDarkVariant] = useState("graphite");
  const [glassmorphism, setGlassmorphism] = useState(false);

  // Sidebar preferences
  const [sidebarSort, setSidebarSort] = useState("recent");
  const [showSubpageCount, setShowSubpageCount] = useState(true);
  const [autoCollapseMobile, setAutoCollapseMobile] = useState(true);

  // Editor preferences
  const [editorFontSize, setEditorFontSize] = useState("medium");
  const [lineSpacing, setLineSpacing] = useState("normal");
  const [spellCheck, setSpellCheck] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [wordCount, setWordCount] = useState(true);
  const [autoSaveBadge, setAutoSaveBadge] = useState(true);

  // Privacy & security
  const [readOnlyByDefault, setReadOnlyByDefault] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [autoPurgeTrash, setAutoPurgeTrash] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Queries for real workspace data
  const allDocuments = useQuery(api.documents.getSearch);
  const trashDocuments = useQuery(api.documents.getTrash);
  const removeDocument = useMutation(api.documents.remove);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("nexus_workspace_name");
      if (savedName) setWorkspaceName(savedName);

      const savedFont = localStorage.getItem("nexus_font_family");
      if (savedFont) setSelectedFont(savedFont);

      const savedAccent = localStorage.getItem("nexus_accent_color");
      if (savedAccent) setAccentColor(savedAccent);

      const savedContrast = localStorage.getItem("nexus_high_contrast");
      if (savedContrast) setHighContrast(savedContrast === "true");

      const savedPattern = localStorage.getItem("nexus_bg_pattern");
      if (savedPattern) {
        setBgPattern(savedPattern);
        document.documentElement.setAttribute("data-pattern", savedPattern);
      }

      const savedRadius = localStorage.getItem("nexus_border_radius");
      if (savedRadius) {
        setBorderRadius(savedRadius);
        document.documentElement.setAttribute("data-radius", savedRadius);
      }

      const savedDarkVar = localStorage.getItem("nexus_dark_variant");
      if (savedDarkVar) {
        setDarkVariant(savedDarkVar);
        document.documentElement.setAttribute("data-dark-variant", savedDarkVar);
      }

      const savedGlass = localStorage.getItem("nexus_glassmorphism");
      if (savedGlass) {
        setGlassmorphism(savedGlass === "true");
        document.documentElement.setAttribute("data-glass", savedGlass);
      }

      const savedSort = localStorage.getItem("nexus_sidebar_sort");
      if (savedSort) setSidebarSort(savedSort);

      const savedSubpages = localStorage.getItem("nexus_show_subpages");
      if (savedSubpages) setShowSubpageCount(savedSubpages === "true");

      const savedMobileCollapse = localStorage.getItem("nexus_auto_collapse_mobile");
      if (savedMobileCollapse) setAutoCollapseMobile(savedMobileCollapse === "true");

      const savedFontSize = localStorage.getItem("nexus_editor_font_size");
      if (savedFontSize) setEditorFontSize(savedFontSize);

      const savedLineSpacing = localStorage.getItem("nexus_line_spacing");
      if (savedLineSpacing) setLineSpacing(savedLineSpacing);

      const savedFullWidth = localStorage.getItem("nexus_full_width");
      if (savedFullWidth) setFullWidth(savedFullWidth === "true");

      const savedSpell = localStorage.getItem("nexus_spellcheck");
      if (savedSpell) setSpellCheck(savedSpell === "true");

      const savedWordCount = localStorage.getItem("nexus_word_count");
      if (savedWordCount) setWordCount(savedWordCount === "true");

      const savedReadOnly = localStorage.getItem("nexus_read_only");
      if (savedReadOnly) setReadOnlyByDefault(savedReadOnly === "true");

      const savedConfirmDel = localStorage.getItem("nexus_confirm_delete");
      if (savedConfirmDel) setConfirmDelete(savedConfirmDel === "true");

      const savedPurge = localStorage.getItem("nexus_auto_purge_trash");
      if (savedPurge) setAutoPurgeTrash(savedPurge === "true");

      const savedNotifs = localStorage.getItem("nexus_notifications");
      if (savedNotifs) setNotifications(savedNotifs === "true");

      const savedSound = localStorage.getItem("nexus_sound_enabled");
      if (savedSound) setSoundEnabled(savedSound === "true");
    }
  }, []);

  const handleSaveWorkspaceName = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_workspace_name", workspaceName);
      toast.success(t("savedSuccess", "Nome do espaço de trabalho atualizado!"));
    }
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_accent_color", color);
      document.documentElement.setAttribute("data-accent", color);
      toast.success(`Cor de destaque alterada para ${color}!`);
    }
  };

  const handleBgPatternChange = (pat: string) => {
    setBgPattern(pat);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_bg_pattern", pat);
      document.documentElement.setAttribute("data-pattern", pat);
      toast.success(`Textura de fundo atualizada para ${pat}!`);
    }
  };

  const handleBorderRadiusChange = (rad: string) => {
    setBorderRadius(rad);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_border_radius", rad);
      document.documentElement.setAttribute("data-radius", rad);
      toast.success(`Estilo de curvatura das bordas alterado!`);
    }
  };

  const handleDarkVariantChange = (variant: string) => {
    setDarkVariant(variant);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_dark_variant", variant);
      document.documentElement.setAttribute("data-dark-variant", variant);
      toast.success(`Estilo do modo escuro atualizado!`);
    }
  };

  const handleGlassmorphismToggle = (val: boolean) => {
    setGlassmorphism(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_glassmorphism", String(val));
      document.documentElement.setAttribute("data-glass", String(val));
      toast.success(val ? "Efeito de vidro fosco (blur) ativado" : "Efeito de vidro desativado");
    }
  };

  const handleSidebarSortChange = (sort: string) => {
    setSidebarSort(sort);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_sidebar_sort", sort);
      invalidateQueryCache();
      toast.success(
        sort === "alpha"
          ? "Barra lateral ordenada em ordem alfabética (A-Z)"
          : sort === "created_asc"
          ? "Barra lateral ordenada por data de criação"
          : "Barra lateral ordenada por mais recentes primeiro"
      );
    }
  };

  const handleExportBackup = () => {
    try {
      const data =
        localStorage.getItem("nexus_documents_store") ||
        JSON.stringify(allDocuments || []);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexus-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup do Nexus baixado com sucesso!");
    } catch {
      toast.error("Erro ao gerar arquivo de exportação.");
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          localStorage.setItem("nexus_documents_store", JSON.stringify(parsed));
          invalidateQueryCache();
          toast.success("Backup restaurado com sucesso! Atualizando notas...");
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          toast.error("O arquivo importado não é um backup válido do Nexus.");
        }
      } catch {
        toast.error("Erro ao analisar arquivo JSON de backup.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleClearTrash = async () => {
    if (!trashDocuments || trashDocuments.length === 0) {
      toast.info("A lixeira já está vazia.");
      return;
    }
    if (
      window.confirm(
        `Tem certeza que deseja esvaziar permanentemente ${trashDocuments.length} nota(s) da lixeira? Esta ação não pode ser desfeita.`
      )
    ) {
      for (const doc of trashDocuments) {
        await removeDocument({ id: doc._id });
      }
      toast.success("Lixeira esvaziada com sucesso!");
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Tem certeza que deseja restaurar as notas padrão do Nexus? Todas as alterações locais serão redefinidas."
      )
    ) {
      localStorage.removeItem("nexus_documents_store");
      toast.success("Espaço restaurado! Recarregando página...");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const navItems = [
    { id: "account", label: t("tabAccount", "Conta e Perfil"), icon: User },
    { id: "appearance", label: t("tabAppearance", "Aparência"), icon: Palette },
    { id: "language", label: t("tabLanguage", "Idioma e Região"), icon: Globe },
    { id: "sidebar", label: t("tabSidebar", "Barra Lateral e Pastas"), icon: FolderTree },
    { id: "editor", label: t("tabEditor", "Editor de Notas"), icon: FileText },
    { id: "privacy", label: t("tabPrivacy", "Privacidade e Segurança"), icon: Shield },
    { id: "data", label: t("tabData", "Dados e Armazenamento"), icon: Database },
    { id: "notifications", label: t("tabNotifications", "Notificações"), icon: Bell },
  ] as const;

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden sm:max-w-3xl border shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("settingsTitle", "Configurações do Nexus")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row min-h-[550px]">
          {/* Settings Navigation Sidebar */}
          <div className="w-full md:w-60 bg-muted/30 border-b md:border-b-0 md:border-r p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shrink-0">
            <div className="px-3 py-2 hidden md:block">
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                {t("settingsTitle", "Configurações")}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("settingsSubtitle", "Personalize seu Nexus")}
              </p>
            </div>

            <nav className="flex md:flex-col gap-1 w-full mt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Main Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[82vh] space-y-6">
            {/* TAB: ACCOUNT & PROFILE */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("accountTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("accountSubtitle")}
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={user?.imageUrl || "/logo.svg"} />
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-base leading-none">
                      {user?.fullName || "Lucas Pasquetti"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.emailAddresses?.[0]?.emailAddress ||
                        "lucascunhapasquetti@gmail.com"}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1">
                      <Sparkles className="h-3 w-3" />
                      {t("freePlan")}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveWorkspaceName} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">{t("workspaceNameLabel")}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="workspace-name"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Ex: Nexus Workspace"
                      />
                      <Button type="submit" size="sm">
                        {t("saveBtn")}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("workspaceNameDesc")}
                    </p>
                  </div>
                </form>

                <div className="pt-2 border-t space-y-3">
                  <h4 className="text-sm font-medium">{t("sessionStatus")}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 border rounded-md bg-muted/20">
                      <span className="text-xs text-muted-foreground block">
                        {t("sessionStatus")}
                      </span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {t("connectedStatus")}
                      </span>
                    </div>
                    <div className="p-3 border rounded-md bg-muted/20">
                      <span className="text-xs text-muted-foreground block">
                        {t("storageMode")}
                      </span>
                      <span className="font-medium mt-0.5 block">
                        Offline & LocalStorage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: APPEARANCE */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("appearanceTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("appearanceSubtitle")}
                  </p>
                </div>

                {/* Color Theme */}
                <div className="space-y-3">
                  <Label>{t("themeLabel")}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={cn(
                        "flex flex-col items-center gap-2.5 p-4 rounded-xl border text-sm font-medium transition hover:border-primary/50 text-center",
                        theme === "light"
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      <Sun className="h-6 w-6" />
                      <span>{t("themeLight")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "flex flex-col items-center gap-2.5 p-4 rounded-xl border text-sm font-medium transition hover:border-primary/50 text-center",
                        theme === "dark"
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      <Moon className="h-6 w-6" />
                      <span>{t("themeDark")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme("system")}
                      className={cn(
                        "flex flex-col items-center gap-2.5 p-4 rounded-xl border text-sm font-medium transition hover:border-primary/50 text-center",
                        theme === "system"
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      <Monitor className="h-6 w-6" />
                      <span>{t("themeSystem")}</span>
                    </button>
                  </div>
                </div>

                {/* Dark Mode Variants (Shown when in dark theme) */}
                {(theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)) && (
                  <div className="space-y-3 pt-3 border-t">
                    <Label>Tom do Tema Escuro</Label>
                    <p className="text-xs text-muted-foreground">
                      Escolha a intensidade e profundidade de preto para ambientes escuros.
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: "graphite", title: "Grafite", desc: "Clássico #1A1A1A" },
                        { id: "oled", title: "Onyx OLED", desc: "Preto Puro #000000" },
                        { id: "midnight", title: "Meia-Noite", desc: "Azul Profundo #0A0E17" },
                      ].map((dv) => (
                        <button
                          key={dv.id}
                          type="button"
                          onClick={() => handleDarkVariantChange(dv.id)}
                          className={cn(
                            "p-3 rounded-lg border text-left transition",
                            darkVariant === dv.id
                              ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                              : "border-border bg-card hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{dv.title}</span>
                            {darkVariant === dv.id && <Check className="h-3.5 w-3.5" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{dv.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accent Color Selection */}
                <div className="space-y-3 pt-3 border-t">
                  <Label>Cor de Destaque da Marca</Label>
                  <p className="text-xs text-muted-foreground">
                    Personalize o tom dos botões principais, seleções ativas e realces visuais.
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleAccentColorChange(c.id)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-center transition",
                          accentColor === c.id
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <span className={cn("h-5 w-5 rounded-full shadow-sm", c.class)} />
                        <span className="text-[11px] font-medium leading-none">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Pattern / Texture */}
                <div className="space-y-3 pt-3 border-t">
                  <Label>Textura e Padrão de Fundo</Label>
                  <p className="text-xs text-muted-foreground">
                    Adicione uma textura visual sutil ao plano de fundo do seu workspace.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "plain", title: "Liso", desc: "Minimalista neutro" },
                      { id: "dots", title: "Pontilhado", desc: "Caderno Dot Grid" },
                      { id: "grid", title: "Grade Técnica", desc: "Papel quadriculado" },
                      { id: "mesh", title: "Aura Glow", desc: "Gradiente sutil" },
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => handleBgPatternChange(pat.id)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition",
                          bgPattern === pat.id
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{pat.title}</span>
                          {bgPattern === pat.id && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{pat.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius Style */}
                <div className="space-y-3 pt-3 border-t">
                  <Label>Curvatura das Bordas dos Elementos</Label>
                  <p className="text-xs text-muted-foreground">
                    Ajuste o arredondamento de botões, caixas de diálogo e cartões.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "sharp", title: "Reto", desc: "0px (Brutalista)" },
                      { id: "subtle", title: "Moderado", desc: "6px (Padrão)" },
                      { id: "rounded", title: "Arredondado", desc: "12px (Moderno)" },
                      { id: "pill", title: "Pílula", desc: "20px (Fluido)" },
                    ].map((rad) => (
                      <button
                        key={rad.id}
                        type="button"
                        onClick={() => handleBorderRadiusChange(rad.id)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition",
                          borderRadius === rad.id
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{rad.title}</span>
                          {borderRadius === rad.id && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{rad.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Style */}
                <div className="space-y-3 pt-3 border-t">
                  <Label>{t("typographyLabel")}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t("typographyDesc")}
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "sans", title: t("fontModern"), desc: "Sans-Serif" },
                      { id: "serif", title: t("fontEditorial"), desc: "Serif" },
                      { id: "mono", title: t("fontTechnical"), desc: "Monospace" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setSelectedFont(f.id);
                          localStorage.setItem("nexus_font_family", f.id);
                          toast.success(`${t("typographyLabel")}: ${f.title}`);
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-left transition",
                          selectedFont === f.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{f.title}</span>
                          {selectedFont === f.id && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y border rounded-lg bg-card">
                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Efeito Vidro Fosco (Glassmorphism & Blur)</Label>
                      <p className="text-xs text-muted-foreground">
                        Aplica acabamento acrílico translúcido com desfoque de fundo na barra lateral.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={glassmorphism}
                      onChange={handleGlassmorphismToggle}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Modo de Alto Contraste</Label>
                      <p className="text-xs text-muted-foreground">
                        Aumenta a separação de bordas e contraste de leitura.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={highContrast}
                      onChange={(val) => {
                        setHighContrast(val);
                        localStorage.setItem("nexus_high_contrast", String(val));
                        toast.success(val ? "Alto contraste ativado" : "Alto contraste desativado");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Transições Suaves de Tema</Label>
                      <p className="text-xs text-muted-foreground">
                        Animação fluida e suave ao alternar entre os modos de exibição.
                      </p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} disabled />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LANGUAGE & REGION */}
            {activeTab === "language" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("langHeader")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("langSubheader")}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>{t("chooseLang")}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = language === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => setLanguage(opt.code)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border text-left transition-all",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm"
                              : "border-border bg-card hover:bg-muted/80 text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl" role="img" aria-label={opt.name}>
                              {opt.flag}
                            </span>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                  {opt.name}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-primary text-primary-foreground rounded">
                                    {t("activeBadge")}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {opt.nativeName}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 text-primary font-bold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h4 className="text-sm font-semibold">{t("tabLanguage")}</h4>

                  <div className="divide-y border rounded-lg bg-card">
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 pr-4">
                        <Label>{t("dateFormatTitle")}</Label>
                        <p className="text-xs text-muted-foreground">
                          {t("dateFormatDesc")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted p-1 rounded-md text-xs font-medium shrink-0">
                        {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => {
                              setDateFormat(fmt);
                              toast.success(`${t("dateFormatTitle")}: ${fmt}`);
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded transition",
                              dateFormat === fmt
                                ? "bg-background text-foreground shadow-sm font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div className="space-y-0.5 pr-4">
                        <Label>{t("timeFormatTitle")}</Label>
                        <p className="text-xs text-muted-foreground">
                          {t("timeFormatDesc")}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={is24Hour}
                        onChange={(val) => {
                          setIs24Hour(val);
                          toast.success(
                            val
                              ? "Relógio 24h ativado"
                              : "Relógio 12h (AM/PM) ativado"
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SIDEBAR & FOLDERS */}
            {activeTab === "sidebar" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("tabSidebar", "Barra Lateral e Pastas")}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajuste a ordenação, hierarquia de documentos e comportamento do menu lateral.
                  </p>
                </div>

                {/* Sorting Mode */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4 text-primary" />
                    Ordem de Exibição das Páginas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Escolha como suas notas e subpáginas são ordenadas na lista de navegação.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "recent", title: "Mais Recentes", desc: "Últimas criadas primeiro" },
                      { id: "alpha", title: "Ordem Alfabética", desc: "De A a Z por título" },
                      { id: "created_asc", title: "Ordem Cronológica", desc: "Mais antigas primeiro" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSidebarSortChange(s.id)}
                        className={cn(
                          "p-3.5 rounded-lg border text-left transition",
                          sidebarSort === s.id
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{s.title}</span>
                          {sidebarSort === s.id && <Check className="h-4 w-4" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y border rounded-lg bg-card">
                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Contador de Subpáginas</Label>
                      <p className="text-xs text-muted-foreground">
                        Exibir indicador numérico ao lado de pastas com páginas aninhadas.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={showSubpageCount}
                      onChange={(val) => {
                        setShowSubpageCount(val);
                        localStorage.setItem("nexus_show_subpages", String(val));
                        toast.success(val ? "Contador de subpáginas ativado" : "Contador desativado");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Recolhimento Automático em Telas Pequenas</Label>
                      <p className="text-xs text-muted-foreground">
                        Ocultar a barra lateral automaticamente em telas mobile para maximizar espaço.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={autoCollapseMobile}
                      onChange={(val) => {
                        setAutoCollapseMobile(val);
                        localStorage.setItem("nexus_auto_collapse_mobile", String(val));
                        toast.success(val ? "Recolhimento automático ativo" : "Recolhimento desativado");
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EDITOR PREFERENCES */}
            {activeTab === "editor" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("editorTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("editorSubtitle")}
                  </p>
                </div>

                {/* Font Size Selector */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" />
                    Tamanho do Texto no Editor
                  </Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "small", title: "Compacto", desc: "14px" },
                      { id: "medium", title: "Padrão", desc: "16px" },
                      { id: "large", title: "Confortável", desc: "18px" },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => {
                          setEditorFontSize(sz.id);
                          localStorage.setItem("nexus_editor_font_size", sz.id);
                          toast.success(`Tamanho da fonte: ${sz.title}`);
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-left transition",
                          editorFontSize === sz.id
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{sz.title}</span>
                          {editorFontSize === sz.id && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{sz.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y border rounded-lg bg-card">
                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>{t("fullWidthLabel")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t("fullWidthDesc")}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={fullWidth}
                      onChange={(val) => {
                        setFullWidth(val);
                        localStorage.setItem("nexus_full_width", String(val));
                        toast.success(val ? "Largura total ativada" : "Largura padrão ativada");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>{t("spellCheckLabel")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t("spellCheckDesc")}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={spellCheck}
                      onChange={(val) => {
                        setSpellCheck(val);
                        localStorage.setItem("nexus_spellcheck", String(val));
                        toast.success(val ? "Corretor ortográfico ativo" : "Corretor desativado");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>{t("wordCountLabel")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t("wordCountDesc")}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={wordCount}
                      onChange={(val) => {
                        setWordCount(val);
                        localStorage.setItem("nexus_word_count", String(val));
                        toast.success(val ? "Contador de palavras ativo" : "Contador desativado");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>{t("autoSaveLabel")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t("autoSaveDesc")}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={autoSaveBadge}
                      onChange={(val) => {
                        setAutoSaveBadge(val);
                        toast.success(
                          val
                            ? "Indicador de salvamento ativo"
                            : "Indicador desativado"
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-muted/40 rounded-lg border text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>{t("autoSaveNote")}</span>
                </div>
              </div>
            )}

            {/* TAB: PRIVACY & SECURITY */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("tabPrivacy", "Privacidade e Segurança")}</h3>
                  <p className="text-sm text-muted-foreground">
                    Controle de permissões, proteção de dados locais e comportamento de segurança.
                  </p>
                </div>

                <div className="divide-y border rounded-lg bg-card">
                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        Modo Somente Leitura por Padrão
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Evite edições involuntárias em notas já existentes ao navegar.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={readOnlyByDefault}
                      onChange={(val) => {
                        setReadOnlyByDefault(val);
                        localStorage.setItem("nexus_read_only", String(val));
                        toast.success(val ? "Modo somente leitura ativo" : "Modo edição livre ativo");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Confirmar Antes de Enviar para a Lixeira</Label>
                      <p className="text-xs text-muted-foreground">
                        Exibir aviso de confirmação antes de arquivar uma nota ou pasta.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={confirmDelete}
                      onChange={(val) => {
                        setConfirmDelete(val);
                        localStorage.setItem("nexus_confirm_delete", String(val));
                        toast.success(val ? "Confirmação de exclusão ativa" : "Confirmação desativada");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>Limpeza Automática de Lixeira</Label>
                      <p className="text-xs text-muted-foreground">
                        Excluir permanentemente itens na lixeira com mais de 30 dias.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={autoPurgeTrash}
                      onChange={(val) => {
                        setAutoPurgeTrash(val);
                        localStorage.setItem("nexus_auto_purge_trash", String(val));
                        toast.success(val ? "Limpeza de 30 dias ativa" : "Limpeza automática desativada");
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Privacidade 100% Local Garantida</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Seus dados permanecem armazenados estritamente na memória e no armazenamento local do seu navegador. O Nexus não envia rastreadores, cookies de terceiros nem analisa o conteúdo dos seus documentos.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: DATA & STORAGE */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("dataTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("dataSubtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 border rounded-xl bg-card space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {t("activePages")}
                    </span>
                    <p className="text-2xl font-bold text-primary">
                      {allDocuments?.length ?? 2}
                    </p>
                  </div>

                  <div className="p-4 border rounded-xl bg-card space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {t("trashItems")}
                    </span>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {trashDocuments?.length ?? 0}
                    </p>
                  </div>

                  <div className="p-4 border rounded-xl bg-card space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {t("formatType")}
                    </span>
                    <p className="text-2xl font-bold flex items-center gap-1.5 text-foreground">
                      <HardDrive className="h-5 w-5 text-muted-foreground" />
                      JSON
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Export Backup */}
                  <div className="p-4 border rounded-lg bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold">
                        {t("exportBackupTitle")}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t("exportBackupDesc")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExportBackup}
                      className="shrink-0 gap-1.5"
                    >
                      <Download className="h-4 w-4" />
                      {t("exportBtn")}
                    </Button>
                  </div>

                  {/* Import Backup */}
                  <div className="p-4 border rounded-lg bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold">
                        Importar e Restaurar Backup
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Carregue um arquivo JSON de backup do Nexus para recuperar suas notas.
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".json,application/json"
                        ref={fileInputRef}
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 gap-1.5"
                      >
                        <Upload className="h-4 w-4" />
                        Carregar Backup
                      </Button>
                    </div>
                  </div>

                  {/* Empty Trash Button */}
                  {trashDocuments && trashDocuments.length > 0 && (
                    <div className="p-4 border rounded-lg bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold">
                          Esvaziar Lixeira Agora
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Exclua permanentemente os {trashDocuments.length} item(ns) arquivados.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleClearTrash}
                        className="shrink-0 gap-1.5 text-amber-600 dark:text-amber-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Esvaziar Lixeira
                      </Button>
                    </div>
                  )}

                  {/* Reset Sample Data */}
                  <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-destructive">
                        {t("resetDataTitle")}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t("resetDataDesc")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleResetData}
                      className="shrink-0 gap-1.5"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("resetBtn")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("notifTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("notifSubtitle")}
                  </p>
                </div>

                <div className="divide-y border rounded-lg bg-card">
                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>{t("toastAlertsLabel")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t("toastAlertsDesc")}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={notifications}
                      onChange={(val) => {
                        setNotifications(val);
                        localStorage.setItem("nexus_notifications", String(val));
                        toast.success(val ? "Avisos flutuantes ativados" : "Avisos desativados");
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label>{t("soundFxLabel")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t("soundFxDesc")}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={soundEnabled}
                      onChange={(val) => {
                        setSoundEnabled(val);
                        localStorage.setItem("nexus_sound_enabled", String(val));
                        toast.success(
                          val ? "Efeitos sonoros ativados" : "Sons silenciados"
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-card space-y-3">
                  <Label>{t("keyboardShortcuts")}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-muted/40">
                      <span className="text-muted-foreground">
                        {t("searchShortcut")}
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">
                        Ctrl / ⌘ + K
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/40">
                      <span className="text-muted-foreground">
                        {t("newNoteShortcut")}
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">
                        Botão &quot;+&quot;
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/40">
                      <span className="text-muted-foreground">
                        Recolher Barra Lateral
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">
                        Ícone Chevron
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/40">
                      <span className="text-muted-foreground">
                        Menu Slash de Blocos
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">
                        / (no editor)
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
