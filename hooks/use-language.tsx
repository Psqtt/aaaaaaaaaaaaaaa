"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type LanguageCode = "pt-BR" | "en-US" | "es-ES" | "fr-FR" | "de-DE";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "pt-BR",
    name: "Português",
    nativeName: "Português (Brasil)",
    flag: "🇧🇷",
    region: "Brasil",
  },
  {
    code: "en-US",
    name: "English",
    nativeName: "English (United States)",
    flag: "🇺🇸",
    region: "United States",
  },
  {
    code: "es-ES",
    name: "Español",
    nativeName: "Español",
    flag: "🇪🇸",
    region: "España / Latinoamérica",
  },
  {
    code: "fr-FR",
    name: "Français",
    nativeName: "Français",
    flag: "🇫🇷",
    region: "France",
  },
  {
    code: "de-DE",
    name: "Deutsch",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    region: "Deutschland",
  },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  "pt-BR": {
    settingsTitle: "Configurações",
    settingsSubtitle: "Personalize seu Nexus",
    tabAccount: "Conta e Perfil",
    tabAppearance: "Aparência",
    tabLanguage: "Idioma e Região",
    tabSidebar: "Barra Lateral e Pastas",
    tabEditor: "Editor de Notas",
    tabPrivacy: "Privacidade e Segurança",
    tabData: "Dados e Armazenamento",
    tabNotifications: "Notificações",
    // Language Tab
    langHeader: "Idioma e Localização",
    langSubheader: "Selecione o idioma de exibição para a interface e menus do Nexus.",
    chooseLang: "Idioma da Interface",
    activeBadge: "Ativo",
    dateFormatTitle: "Formato de Data",
    dateFormatDesc: "Padrão de exibição das datas em documentos e notas.",
    timeFormatTitle: "Relógio 24 Horas",
    timeFormatDesc: "Exibir horários no formato 24h em vez de AM/PM.",
    langSuccessToast: "Idioma alterado para Português (Brasil)",
    // Account Tab
    accountTitle: "Conta e Espaço de Trabalho",
    accountSubtitle: "Gerencie suas informações de perfil e identificação do workspace.",
    workspaceNameLabel: "Nome do Espaço de Trabalho",
    workspaceNameDesc: "Este nome é exibido no cabeçalho e na barra de navegação.",
    saveBtn: "Salvar",
    sessionStatus: "Status de Autenticação",
    connectedStatus: "Conectado",
    storageMode: "Modo de Armazenamento",
    freePlan: "Plano Individual Gratuito",
    // Appearance Tab
    appearanceTitle: "Aparência do Nexus",
    appearanceSubtitle: "Ajuste o tema visual, paleta de cores e estilo visual do aplicativo.",
    themeLabel: "Tema de Cores",
    themeLight: "Claro",
    themeDark: "Escuro",
    themeSystem: "Sistema",
    typographyLabel: "Estilo de Tipografia",
    typographyDesc: "Escolha a fonte preferida para leitura e redação de documentos.",
    fontModern: "Moderno",
    fontEditorial: "Editorial",
    fontTechnical: "Técnico",
    smoothTransitions: "Transições Suaves de Tema",
    smoothTransitionsDesc: "Animação fluida ao alternar entre os modos claro e escuro.",
    // Editor Tab
    editorTitle: "Preferências do Editor",
    editorSubtitle: "Configure a experiência de escrita e layout das suas notas.",
    fullWidthLabel: "Modo de Largura Total",
    fullWidthDesc: "Expanda o editor para preencher todo o espaço horizontal da tela.",
    spellCheckLabel: "Verificação Ortográfica",
    spellCheckDesc: "Destacar automaticamente erros gramaticais e ortográficos.",
    wordCountLabel: "Contador de Palavras e Caracteres",
    wordCountDesc: "Exibir estatísticas de leitura e volume de texto na página.",
    autoSaveLabel: "Indicador de Salvamento Automático",
    autoSaveDesc: "Confirmar visualmente quando o conteúdo for sincronizado.",
    autoSaveNote: "Todas as edições no editor do Nexus são salvas automaticamente em tempo real.",
    // Data Tab
    dataTitle: "Armazenamento e Dados",
    dataSubtitle: "Consulte estatísticas locais, exporte backups e gerencie o banco de notas.",
    activePages: "Páginas Ativas",
    trashItems: "Itens na Lixeira",
    formatType: "Formato",
    exportBackupTitle: "Exportar Backup Completo",
    exportBackupDesc: "Baixe todas as suas notas, blocos e mídias em um único arquivo JSON.",
    exportBtn: "Exportar JSON",
    resetDataTitle: "Redefinir Dados de Exemplo",
    resetDataDesc: "Restaura as notas originais do Nexus e limpa o armazenamento local.",
    resetBtn: "Redefinir",
    // Notifications Tab
    notifTitle: "Alertas e Notificações",
    notifSubtitle: "Controle avisos na tela e preferências de feedback sonoro.",
    toastAlertsLabel: "Avisos de Confirmação (Toast)",
    toastAlertsDesc: "Exibir alertas flutuantes ao criar, salvar ou excluir documentos.",
    soundFxLabel: "Sons de Interface",
    soundFxDesc: "Efeitos sonoros sutis ao interagir com menus e atalhos.",
    keyboardShortcuts: "Atalhos Globais do Teclado",
    searchShortcut: "Abrir Busca",
    newNoteShortcut: "Criar Nova Nota",
    // General
    searchNotes: "Buscar notas...",
  },
  "en-US": {
    settingsTitle: "Settings",
    settingsSubtitle: "Customize your Nexus",
    tabAccount: "Account & Profile",
    tabAppearance: "Appearance",
    tabLanguage: "Language & Region",
    tabSidebar: "Sidebar & Folders",
    tabEditor: "Note Editor",
    tabPrivacy: "Privacy & Security",
    tabData: "Data & Storage",
    tabNotifications: "Notifications",
    // Language Tab
    langHeader: "Language & Region",
    langSubheader: "Select your preferred language for Nexus interface and menus.",
    chooseLang: "Interface Language",
    activeBadge: "Active",
    dateFormatTitle: "Date Format",
    dateFormatDesc: "Display format for dates in documents and notes.",
    timeFormatTitle: "24-Hour Clock",
    timeFormatDesc: "Display times in 24-hour format instead of AM/PM.",
    langSuccessToast: "Language changed to English (US)",
    // Account Tab
    accountTitle: "Account & Workspace",
    accountSubtitle: "Manage your profile details and workspace identification.",
    workspaceNameLabel: "Workspace Name",
    workspaceNameDesc: "This name is displayed in the header and navigation bar.",
    saveBtn: "Save",
    sessionStatus: "Auth Status",
    connectedStatus: "Connected",
    storageMode: "Storage Mode",
    freePlan: "Free Individual Plan",
    // Appearance Tab
    appearanceTitle: "Nexus Appearance",
    appearanceSubtitle: "Adjust color theme, typography style, and visual presentation.",
    themeLabel: "Color Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    typographyLabel: "Typography Style",
    typographyDesc: "Select the preferred font for reading and drafting documents.",
    fontModern: "Modern",
    fontEditorial: "Editorial",
    fontTechnical: "Technical",
    smoothTransitions: "Smooth Theme Transitions",
    smoothTransitionsDesc: "Fluid animation when switching between light and dark modes.",
    // Editor Tab
    editorTitle: "Editor Preferences",
    editorSubtitle: "Configure writing experience and document layout.",
    fullWidthLabel: "Full Width Mode",
    fullWidthDesc: "Expand editor to fill the full horizontal width of the screen.",
    spellCheckLabel: "Spell Check",
    spellCheckDesc: "Automatically highlight grammar and spelling errors.",
    wordCountLabel: "Word and Character Counter",
    wordCountDesc: "Display reading statistics and text volume on page.",
    autoSaveLabel: "Auto-Save Badge",
    autoSaveDesc: "Visually confirm when changes have been synced.",
    autoSaveNote: "All edits in Nexus are automatically saved in real-time as you type.",
    // Data Tab
    dataTitle: "Data & Storage",
    dataSubtitle: "View local stats, export backups, and manage note storage.",
    activePages: "Active Pages",
    trashItems: "Items in Trash",
    formatType: "Format",
    exportBackupTitle: "Export Full Backup",
    exportBackupDesc: "Download all your notes, blocks, and media in a single JSON file.",
    exportBtn: "Export JSON",
    resetDataTitle: "Reset Demo Data",
    resetDataDesc: "Restore original Nexus sample notes and clear local storage.",
    resetBtn: "Reset",
    // Notifications Tab
    notifTitle: "Alerts & Notifications",
    notifSubtitle: "Control on-screen notifications and audio feedback.",
    toastAlertsLabel: "Confirmation Toasts",
    toastAlertsDesc: "Show floating alerts when creating, saving, or deleting documents.",
    soundFxLabel: "Interface Sounds",
    soundFxDesc: "Subtle sound effects when interacting with menus and shortcuts.",
    keyboardShortcuts: "Global Keyboard Shortcuts",
    searchShortcut: "Open Search",
    newNoteShortcut: "Create New Note",
    // General
    searchNotes: "Search notes...",
  },
  "es-ES": {
    settingsTitle: "Configuración",
    settingsSubtitle: "Personaliza tu Nexus",
    tabAccount: "Cuenta y Perfil",
    tabAppearance: "Apariencia",
    tabLanguage: "Idioma y Región",
    tabSidebar: "Barra Lateral y Carpetas",
    tabEditor: "Editor de Notas",
    tabPrivacy: "Privacidad y Seguridad",
    tabData: "Datos y Almacenamiento",
    tabNotifications: "Notificaciones",
    // Language Tab
    langHeader: "Idioma y Región",
    langSubheader: "Selecciona el idioma para la interfaz y los menús de Nexus.",
    chooseLang: "Idioma de la Interfaz",
    activeBadge: "Activo",
    dateFormatTitle: "Formato de Fecha",
    dateFormatDesc: "Formato de visualización de fechas en documentos y notas.",
    timeFormatTitle: "Reloj de 24 Horas",
    timeFormatDesc: "Mostrar horas en formato 24h en lugar de AM/PM.",
    langSuccessToast: "Idioma cambiado a Español",
    // Account Tab
    accountTitle: "Cuenta y Espacio de Trabajo",
    accountSubtitle: "Administra tu perfil e identificación del espacio de trabajo.",
    workspaceNameLabel: "Nombre del Espacio de Trabajo",
    workspaceNameDesc: "Este nombre se muestra en el encabezado y en la barra lateral.",
    saveBtn: "Guardar",
    sessionStatus: "Estado de Sesión",
    connectedStatus: "Conectado",
    storageMode: "Modo de Almacenamiento",
    freePlan: "Plan Individual Gratuito",
    // Appearance Tab
    appearanceTitle: "Apariencia de Nexus",
    appearanceSubtitle: "Ajusta el tema visual, colores y estilo tipográfico.",
    themeLabel: "Tema de Color",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
    typographyLabel: "Estilo Tipográfico",
    typographyDesc: "Elige la fuente preferida para leer y redactar documentos.",
    fontModern: "Moderno",
    fontEditorial: "Editorial",
    fontTechnical: "Técnico",
    smoothTransitions: "Transiciones Suaves",
    smoothTransitionsDesc: "Animación fluida al alternar entre modos claro y oscuro.",
    // Editor Tab
    editorTitle: "Preferencias del Editor",
    editorSubtitle: "Configura la experiencia de escritura y el diseño de notas.",
    fullWidthLabel: "Modo de Ancho Completo",
    fullWidthDesc: "Expande el editor para llenar todo el ancho horizontal.",
    spellCheckLabel: "Corrector Ortográfico",
    spellCheckDesc: "Destacar automáticamente errores gramaticales y ortográficos.",
    wordCountLabel: "Contador de Palabras",
    wordCountDesc: "Mostrar estadísticas de lectura y volumen de texto.",
    autoSaveLabel: "Indicador de Autoguardado",
    autoSaveDesc: "Confirmar visualmente cuando el contenido esté sincronizado.",
    autoSaveNote: "Todas las ediciones en Nexus se guardan automáticamente en tiempo real.",
    // Data Tab
    dataTitle: "Datos y Almacenamiento",
    dataSubtitle: "Consulta estadísticas locales, exporta copias y gestiona notas.",
    activePages: "Páginas Activas",
    trashItems: "Elementos en Papelera",
    formatType: "Formato",
    exportBackupTitle: "Exportar Copia de Seguridad",
    exportBackupDesc: "Descarga todas tus notas y medios en un único archivo JSON.",
    exportBtn: "Exportar JSON",
    resetDataTitle: "Restablecer Datos de Demostración",
    resetDataDesc: "Restaura las notas de muestra originales de Nexus.",
    resetBtn: "Restablecer",
    // Notifications Tab
    notifTitle: "Alertas y Notificaciones",
    notifSubtitle: "Controla avisos en pantalla y sonidos de la interfaz.",
    toastAlertsLabel: "Avisos Flotantes (Toast)",
    toastAlertsDesc: "Mostrar alertas al crear, guardar o eliminar notas.",
    soundFxLabel: "Efectos de Sonido",
    soundFxDesc: "Sonidos sutiles al interactuar con menús.",
    keyboardShortcuts: "Atajos de Teclado Globales",
    searchShortcut: "Abrir Búsqueda",
    newNoteShortcut: "Crear Nueva Nota",
    // General
    searchNotes: "Buscar notas...",
  },
  "fr-FR": {
    settingsTitle: "Paramètres",
    settingsSubtitle: "Personnalisez votre Nexus",
    tabAccount: "Compte & Profil",
    tabAppearance: "Apparence",
    tabLanguage: "Langue & Région",
    tabSidebar: "Barre Latérale & Dossiers",
    tabEditor: "Éditeur de Notes",
    tabPrivacy: "Confidentialité & Sécurité",
    tabData: "Données & Stockage",
    tabNotifications: "Notifications",
    // Language Tab
    langHeader: "Langue & Région",
    langSubheader: "Choisissez la langue pour l'interface et les menus de Nexus.",
    chooseLang: "Langue de l'Interface",
    activeBadge: "Actif",
    dateFormatTitle: "Format de Date",
    dateFormatDesc: "Format d'affichage des dates dans les documents.",
    timeFormatTitle: "Horloge 24 Heures",
    timeFormatDesc: "Afficher les heures au format 24h plutôt que AM/PM.",
    langSuccessToast: "Langue changée en Français",
    // Account Tab
    accountTitle: "Compte & Espace de Travail",
    accountSubtitle: "Gérez vos informations de profil et votre espace de travail.",
    workspaceNameLabel: "Nom de l'Espace de Travail",
    workspaceNameDesc: "Ce nom est affiché dans l'en-tête et la barre latérale.",
    saveBtn: "Enregistrer",
    sessionStatus: "Statut de Session",
    connectedStatus: "Connecté",
    storageMode: "Mode de Stockage",
    freePlan: "Plan Individuel Gratuit",
    // Appearance Tab
    appearanceTitle: "Apparence de Nexus",
    appearanceSubtitle: "Ajustez le thème de couleur, la typographie et le style visuel.",
    themeLabel: "Thème de Couleur",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
    typographyLabel: "Style Typographique",
    typographyDesc: "Choisissez la police pour la lecture et la rédaction.",
    fontModern: "Moderne",
    fontEditorial: "Éditorial",
    fontTechnical: "Technique",
    smoothTransitions: "Transitions Fluides",
    smoothTransitionsDesc: "Animation fluide lors du changement de thème.",
    // Editor Tab
    editorTitle: "Préférences de l'Éditeur",
    editorSubtitle: "Configurez l'expérience d'écriture et la mise en page.",
    fullWidthLabel: "Mode Pleine Largeur",
    fullWidthDesc: "Agrandissez l'éditeur pour remplir tout l'espace horizontal.",
    spellCheckLabel: "Correcteur Orthographique",
    spellCheckDesc: "Surligner automatiquement les fautes d'orthographe.",
    wordCountLabel: "Compteur de Mots",
    wordCountDesc: "Afficher les statistiques de lecture et le nombre de mots.",
    autoSaveLabel: "Badge de Sauvegarde Automatique",
    autoSaveDesc: "Confirmation visuelle de la synchronisation des notes.",
    autoSaveNote: "Toutes les modifications dans Nexus sont enregistrées en temps réel.",
    // Data Tab
    dataTitle: "Données & Stockage",
    dataSubtitle: "Consultez les statistiques, exportez des sauvegardes et gérez vos notes.",
    activePages: "Pages Actives",
    trashItems: "Éléments dans la Corbeille",
    formatType: "Format",
    exportBackupTitle: "Exporter la Sauvegarde",
    exportBackupDesc: "Téléchargez toutes vos notes et médias dans un fichier JSON.",
    exportBtn: "Exporter JSON",
    resetDataTitle: "Réinitialiser les Données",
    resetDataDesc: "Restaurer les notes d'exemple de Nexus.",
    resetBtn: "Réinitialiser",
    // Notifications Tab
    notifTitle: "Alertes & Notifications",
    notifSubtitle: "Contrôlez les notifications à l'écran et les retours sonores.",
    toastAlertsLabel: "Notifications Toast",
    toastAlertsDesc: "Afficher des alertes lors de la création ou suppression de notes.",
    soundFxLabel: "Effets Sonores",
    soundFxDesc: "Effets sonores subtils lors de l'interaction avec les menus.",
    keyboardShortcuts: "Raccourcis Clavier Globaux",
    searchShortcut: "Ouvrir la Recherche",
    newNoteShortcut: "Créer une Nouvelle Note",
    // General
    searchNotes: "Rechercher des notes...",
  },
  "de-DE": {
    settingsTitle: "Einstellungen",
    settingsSubtitle: "Passen Sie Ihr Nexus an",
    tabAccount: "Konto & Profil",
    tabAppearance: "Erscheinungsbild",
    tabLanguage: "Sprache & Region",
    tabSidebar: "Seitenleiste & Ordner",
    tabEditor: "Notizen-Editor",
    tabPrivacy: "Datenschutz & Sicherheit",
    tabData: "Daten & Speicher",
    tabNotifications: "Benachrichtigungen",
    // Language Tab
    langHeader: "Sprache & Region",
    langSubheader: "Wählen Sie die Anzeigesprache für die Benutzeroberfläche von Nexus.",
    chooseLang: "Oberflächensprache",
    activeBadge: "Aktiv",
    dateFormatTitle: "Datumsformat",
    dateFormatDesc: "Anzeigeformat für Daten in Dokumenten und Notizen.",
    timeFormatTitle: "24-Stunden-Uhr",
    timeFormatDesc: "Zeiten im 24-Stunden-Format anstelle von AM/PM anzeigen.",
    langSuccessToast: "Sprache auf Deutsch umgestellt",
    // Account Tab
    accountTitle: "Konto & Arbeitsbereich",
    accountSubtitle: "Verwalten Sie Profilinformationen und Arbeitsbereichsdetails.",
    workspaceNameLabel: "Name des Arbeitsbereichs",
    workspaceNameDesc: "Dieser Name wird in Kopfzeile und Navigation angezeigt.",
    saveBtn: "Speichern",
    sessionStatus: "Sitzungsstatus",
    connectedStatus: "Verbunden",
    storageMode: "Speichermodus",
    freePlan: "Kostenloser Einzelplan",
    // Appearance Tab
    appearanceTitle: "Nexus Erscheinungsbild",
    appearanceSubtitle: "Passen Sie Farbthema, Typografie und visuelles Design an.",
    themeLabel: "Farbdesign",
    themeLight: "Hell",
    themeDark: "Dunkel",
    themeSystem: "System",
    typographyLabel: "Typografiestil",
    typographyDesc: "Wählen Sie die bevorzugte Schriftart für das Lesen und Schreiben.",
    fontModern: "Modern",
    fontEditorial: "Editorial",
    fontTechnical: "Technisch",
    smoothTransitions: "Sanfte Übergänge",
    smoothTransitionsDesc: "Flüssige Animation beim Wechseln zwischen Hell und Dunkel.",
    // Editor Tab
    editorTitle: "Editor-Einstellungen",
    editorSubtitle: "Konfigurieren Sie Schreiberlebnis und Dokumentenlayout.",
    fullWidthLabel: "Volle Breite Modus",
    fullWidthDesc: "Editor auf die gesamte Bildschirmbreite erweitern.",
    spellCheckLabel: "Rechtschreibprüfung",
    spellCheckDesc: "Rechtschreib- und Grammatikfehler automatisch hervorheben.",
    wordCountLabel: "Wort- und Zeichenzähler",
    wordCountDesc: "Lesestatistiken und Textumfang auf der Seite anzeigen.",
    autoSaveLabel: "Automatisches Speichern Anzeige",
    autoSaveDesc: "Visuelle Bestätigung, wenn Inhalte synchronisiert sind.",
    autoSaveNote: "Alle Bearbeitungen in Nexus werden automatisch in Echtzeit gespeichert.",
    // Data Tab
    dataTitle: "Daten & Speicher",
    dataSubtitle: "Lokale Statistiken einsehen, Backups exportieren und Notizen verwalten.",
    activePages: "Aktive Seiten",
    trashItems: "Elemente im Papierkorb",
    formatType: "Format",
    exportBackupTitle: "Vollständiges Backup exportieren",
    exportBackupDesc: "Laden Sie alle Notizen und Medien in einer JSON-Datei herunter.",
    exportBtn: "JSON Exportieren",
    resetDataTitle: "Demodaten zurücksetzen",
    resetDataDesc: "Stellt die ursprünglichen Nexus-Beispielnotizen wieder her.",
    resetBtn: "Zurücksetzen",
    // Notifications Tab
    notifTitle: "Warnungen & Benachrichtigungen",
    notifSubtitle: "Steuern Sie Bildschirmnachrichten und Tonrückmeldungen.",
    toastAlertsLabel: "Toast-Benachrichtigungen",
    toastAlertsDesc: "Hinweise beim Erstellen, Speichern oder Löschen anzeigen.",
    soundFxLabel: "Oberflächengeräusche",
    soundFxDesc: "Dezente Soundeffekte bei Interaktionen mit Menüs.",
    keyboardShortcuts: "Globale Tastenkürzel",
    searchShortcut: "Suche Öffnen",
    newNoteShortcut: "Neue Notiz Erstellen",
    // General
    searchNotes: "Notizen durchsuchen...",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  currentOption: LanguageOption;
  dateFormat: string;
  setDateFormat: (fmt: string) => void;
  is24Hour: boolean;
  setIs24Hour: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "pt-BR",
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  currentOption: LANGUAGE_OPTIONS[0],
  dateFormat: "DD/MM/YYYY",
  setDateFormat: () => {},
  is24Hour: true,
  setIs24Hour: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<LanguageCode>("pt-BR");
  const [dateFormat, setDateFormatState] = useState("DD/MM/YYYY");
  const [is24Hour, setIs24HourState] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("nexus_language") as LanguageCode;
      if (
        savedLang &&
        LANGUAGE_OPTIONS.some((opt) => opt.code === savedLang)
      ) {
        setLanguageState(savedLang);
      }
      const savedDateFormat = localStorage.getItem("nexus_date_format");
      if (savedDateFormat) setDateFormatState(savedDateFormat);

      const saved24h = localStorage.getItem("nexus_24hour_clock");
      if (saved24h !== null) setIs24HourState(saved24h === "true");
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_language", newLang);
      const successMsg = translations[newLang]?.langSuccessToast || "Language updated";
      toast.success(successMsg);
    }
  };

  const setDateFormat = (fmt: string) => {
    setDateFormatState(fmt);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_date_format", fmt);
    }
  };

  const setIs24Hour = (val: boolean) => {
    setIs24HourState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_24hour_clock", String(val));
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) ||
    LANGUAGE_OPTIONS[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentOption,
        dateFormat,
        setDateFormat,
        is24Hour,
        setIs24Hour,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
