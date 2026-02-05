import { useState, useCallback, useEffect, useMemo } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import "../styles/custom.css";

// Types
interface WidgetSettings {
    whatsappEnabled: boolean;
    whatsappNumber: string;
    whatsappPosition: string;
    whatsappColor: string;
    whatsappSize: string;
    whatsappTooltip: string;
    whatsappShowTooltip: boolean;
    notificationEnabled: boolean;
    notificationPosition: string;
    notificationBgColor: string;
    notificationTextColor: string;
    notificationAccentColor: string;
    notificationCtaText: string;
    notificationTimeText: string;
    notificationInterval: number;
    notificationDuration: number;
    notificationDelay: number;
    notificationProducts: string | null;
    notificationDisplayLogic: string;
    notificationThemeColor: string;
    notificationSize: string;
    // EDD Settings
    eddEnabled: boolean;
    eddMinHandlingDays: number;
    eddMaxHandlingDays: number;
    eddMinShippingDays: number;
    eddMaxShippingDays: number;
    eddCutoffHour: number;
    eddShowTimeline: boolean;
    eddThemeColor: string;
    eddCustomText: string;
    eddBgColor: string;
    eddCountry: string;
}

interface Product {
    id: string;
    title: string;
    handle: string;
    featuredImage?: { url: string } | null;
}

// Loader
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);

    let settings = await db.widgetSettings.findUnique({
        where: { shop: session.shop },
    });

    if (!settings) {
        settings = await db.widgetSettings.create({
            data: { shop: session.shop },
        });
    }

    return { settings, shop: session.shop };
};

// Action
export const action = async ({ request }: ActionFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const formData = await request.formData();

    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("whatsapp") || key.startsWith("notification") || key.startsWith("edd")) {
            if (["whatsappEnabled", "whatsappShowTooltip", "notificationEnabled", "eddEnabled", "eddShowTimeline"].includes(key)) {
                data[key] = value === "true";
            } else if (["notificationInterval", "notificationDuration", "notificationDelay", "eddMinHandlingDays", "eddMaxHandlingDays", "eddMinShippingDays", "eddMaxShippingDays", "eddCutoffHour"].includes(key)) {
                data[key] = parseInt(value.toString(), 10) || 0;
            } else {
                data[key] = value.toString();
            }
        }
    }

    try {
        const settings = await db.widgetSettings.upsert({
            where: { shop: session.shop },
            update: data,
            create: { shop: session.shop, ...data },
        });
        return { success: true, settings };
    } catch (error: any) {
        console.error("Save error:", error);
        return { success: false, error: error.message };
    }
};

// Component
export default function Dashboard() {
    const { settings: initialSettings, shop } = useLoaderData<typeof loader>();

    // Initialize settings with defaults
    const defaults: WidgetSettings = {
        ...(initialSettings as any),
        eddEnabled: (initialSettings as any).eddEnabled ?? false,
        eddMinHandlingDays: (initialSettings as any).eddMinHandlingDays ?? 1,
        eddMaxHandlingDays: (initialSettings as any).eddMaxHandlingDays ?? 3,
        eddMinShippingDays: (initialSettings as any).eddMinShippingDays ?? 7,
        eddMaxShippingDays: (initialSettings as any).eddMaxShippingDays ?? 12,
        eddCutoffHour: (initialSettings as any).eddCutoffHour ?? 17,
        eddShowTimeline: (initialSettings as any).eddShowTimeline ?? true,
        eddThemeColor: (initialSettings as any).eddThemeColor ?? "#000000",
        eddCustomText: (initialSettings as any).eddCustomText ?? "Order within",
        eddBgColor: (initialSettings as any).eddBgColor ?? "#ffffff",
        notificationDisplayLogic: (initialSettings as any).notificationDisplayLogic ?? "random",
        notificationThemeColor: (initialSettings as any).notificationThemeColor ?? "#ef4444",
        notificationBgColor: (initialSettings as any).notificationBgColor ?? "#ffffff",
        notificationSize: (initialSettings as any).notificationSize ?? "medium",
    };

    const [settings, setSettings] = useState<WidgetSettings>(defaults);
    const [savedSettings, setSavedSettings] = useState<WidgetSettings>(defaults); // Baseline for dirty check

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [savedSelectedProducts, setSavedSelectedProducts] = useState<Product[]>([]); // Baseline for products

    const [activeTab, setActiveTab] = useState<"whatsapp" | "delivery" | "notifications">("whatsapp");
    const [globalEnabled, setGlobalEnabled] = useState(true);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const fetcher = useFetcher();
    const shopify = useAppBridge();

    const isLoading = fetcher.state !== "idle";
    const storeName = shop.replace('.myshopify.com', '');

    // Load products from settings
    useEffect(() => {
        if (settings.notificationProducts) {
            try {
                const products = JSON.parse(settings.notificationProducts);
                setSelectedProducts(products);
                setSavedSelectedProducts(products);
            } catch (e) {
                console.error("Failed to parse products", e);
            }
        }
    }, []);

    // Show toast on save
    useEffect(() => {
        if (fetcher.data?.success) {
            shopify.toast.show("✓ Settings saved successfully!");
            setSavedSettings(settings); // Update baseline
            setSavedSelectedProducts(selectedProducts); // Update baseline
        } else if (fetcher.data?.error) {
            shopify.toast.show("Failed to save: " + fetcher.data.error, { isError: true });
        }
    }, [fetcher.data, shopify, settings, selectedProducts]);

    const updateSetting = useCallback((key: keyof WidgetSettings, value: any) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSave = useCallback(() => {
        const formData = new FormData();
        Object.entries(settings).forEach(([key, value]) => {
            if (key === "notificationProducts") {
                formData.append(key, JSON.stringify(selectedProducts));
            } else {
                formData.append(key, String(value));
            }
        });
        fetcher.submit(formData, { method: "post" });
    }, [settings, selectedProducts, fetcher]);

    const handleSelectProducts = useCallback(async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: "product",
                action: "select",
                multiple: true,
                selectionIds: selectedProducts.map((p) => ({ id: p.id })),
            });
            if (selected) {
                const products = selected.map((product: any) => ({
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    featuredImage: product.images?.[0] ? { url: product.images[0].originalSrc } : null,
                }));
                setSelectedProducts(products);
            }
        } catch (error) {
            console.error("Product picker error:", error);
        }
    }, [shopify, selectedProducts]);

    const removeProduct = useCallback((productId: string) => {
        setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    }, []);

    // Calculate delivery dates for preview
    const calculateDeliveryDates = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const startDay = currentHour < settings.eddCutoffHour ? 0 : 1;

        // Order ready dates (handling time)
        const minReady = new Date(now);
        minReady.setDate(minReady.getDate() + startDay + settings.eddMinHandlingDays);

        const maxReady = new Date(now);
        maxReady.setDate(maxReady.getDate() + startDay + settings.eddMaxHandlingDays);

        // Delivery dates (handling + shipping time)
        const minDelivery = new Date(now);
        minDelivery.setDate(minDelivery.getDate() + startDay + settings.eddMinHandlingDays + settings.eddMinShippingDays);

        const maxDelivery = new Date(now);
        maxDelivery.setDate(maxDelivery.getDate() + startDay + settings.eddMaxHandlingDays + settings.eddMaxShippingDays);

        const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const formatShortDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const timeUntilCutoff = () => {
            const cutoffToday = new Date(now);
            cutoffToday.setHours(settings.eddCutoffHour, 0, 0, 0);
            if (now > cutoffToday) {
                cutoffToday.setDate(cutoffToday.getDate() + 1);
            }
            const diff = cutoffToday.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            return { hours, mins, secs, formatted: `${hours}h ${mins}m` };
        };

        const countdown = timeUntilCutoff();

        return {
            min: formatDate(minDelivery),
            max: formatDate(maxDelivery),
            minShort: formatShortDate(minDelivery),
            maxShort: formatShortDate(maxDelivery),
            readyMin: formatShortDate(minReady),
            readyMax: formatShortDate(maxReady),
            orderedDate: formatShortDate(now),
            timeLeft: countdown.formatted,
            hours: countdown.hours.toString().padStart(2, '0'),
            mins: countdown.mins.toString().padStart(2, '0'),
            secs: countdown.secs.toString().padStart(2, '0')
        };
    };

    // Real-time countdown state
    const [deliveryDates, setDeliveryDates] = useState(calculateDeliveryDates());

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            setDeliveryDates(calculateDeliveryDates());
        }, 1000);
        return () => clearInterval(timer);
    }, [settings.eddCutoffHour, settings.eddMinHandlingDays, settings.eddMaxHandlingDays, settings.eddMinShippingDays, settings.eddMaxShippingDays]);

    // Check for unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        const current = { ...settings, notificationProducts: undefined };
        const saved = { ...savedSettings, notificationProducts: undefined };

        console.log('Dirty Check:', {
            settingsChanged: JSON.stringify(current) !== JSON.stringify(saved),
            productsChanged: JSON.stringify(selectedProducts) !== JSON.stringify(savedSelectedProducts),
            currentLen: JSON.stringify(current).length,
            savedLen: JSON.stringify(saved).length
        });

        const settingsChanged = JSON.stringify(current) !== JSON.stringify(saved);
        const productsChanged = JSON.stringify(selectedProducts) !== JSON.stringify(savedSelectedProducts);

        return settingsChanged || productsChanged;
    }, [settings, savedSettings, selectedProducts, savedSelectedProducts]);

    const handleTabChange = (tab: "whatsapp" | "delivery" | "notifications") => {
        if (hasUnsavedChanges) {
            const confirm = window.confirm("⚠️ You have unsaved changes!\n\nClick OK to DISCARD changes and switch tabs.\nClick Cancel to STAY and save your work.");
            if (!confirm) return;
        }
        setActiveTab(tab);
    };

    return (
        <div className="dashboard-container">
            {/* Header Bar */}
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="header-title">Social Boost</h1>
                        <p className="header-subtitle">{storeName}</p>
                    </div>
                </div>
                <div className="header-right">
                    <label className="master-toggle">
                        <span>Enable on Storefront</span>
                        <button
                            className={`toggle-btn ${globalEnabled ? 'active' : ''}`}
                            onClick={() => setGlobalEnabled(!globalEnabled)}
                        >
                            <span className="toggle-thumb" />
                        </button>
                    </label>
                    {(hasUnsavedChanges || isLoading) && (
                        <button
                            className="save-btn"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "💾 Save Changes"}
                        </button>
                    )}
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="tab-nav">
                <button
                    className={`tab-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
                    onClick={() => handleTabChange('whatsapp')}
                >
                    <span className="tab-icon">💬</span>
                    <span>WhatsApp Widget</span>
                    <span className={`tab-status ${settings.whatsappEnabled ? 'active' : ''}`}>
                        {settings.whatsappEnabled ? '● Active' : '○ Inactive'}
                    </span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
                    onClick={() => handleTabChange('delivery')}
                >
                    <span className="tab-icon">🚚</span>
                    <span>Delivery Estimator</span>
                    <span className={`tab-status ${settings.eddEnabled ? 'active' : ''}`}>
                        {settings.eddEnabled ? '● Active' : '○ Inactive'}
                    </span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => handleTabChange('notifications')}
                >
                    <span className="tab-icon">🔔</span>
                    <span>Sales Notifications</span>
                    <span className={`tab-status ${settings.notificationEnabled ? 'active' : ''}`}>
                        {settings.notificationEnabled ? '● Active' : '○ Inactive'}
                    </span>
                </button>
            </nav>

            {/* Split Screen Layout */}
            <main className="split-layout">
                {/* Left Panel - Controls */}
                <div className="controls-panel">
                    {activeTab === 'whatsapp' && (
                        <div>
                            {/* Enable Toggle Card */}
                            <div className="settings-card">
                                <div className="card-header">
                                    <h3>WhatsApp Chat Widget</h3>
                                    <button
                                        className={`toggle-btn ${settings.whatsappEnabled ? 'active' : ''}`}
                                        onClick={() => updateSetting('whatsappEnabled', !settings.whatsappEnabled)}
                                    >
                                        <span className="toggle-thumb" />
                                    </button>
                                </div>
                                <p className="card-description">
                                    Let customers start a WhatsApp conversation with one click.
                                </p>
                            </div>

                            {/* Phone Number Card */}
                            <div className="settings-card">
                                <h3>Contact Details</h3>
                                <div className="form-group">
                                    <label>WhatsApp Number</label>
                                    <div className="phone-input-wrapper" style={{ position: 'relative' }}>
                                        <span className="country-flag-prefix" style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            pointerEvents: 'none',
                                            zIndex: 1
                                        }}>
                                            {(() => {
                                                const num = settings.whatsappNumber || '';
                                                const cleanNum = num.replace(/[^0-9]/g, '');
                                                let countryCode = 'globe';

                                                if (cleanNum.startsWith('91')) countryCode = 'in';
                                                else if (cleanNum.startsWith('1')) countryCode = 'us';
                                                else if (cleanNum.startsWith('44')) countryCode = 'gb';
                                                else if (cleanNum.startsWith('61')) countryCode = 'au';
                                                else if (cleanNum.startsWith('49')) countryCode = 'de';
                                                else if (cleanNum.startsWith('33')) countryCode = 'fr';
                                                else if (cleanNum.startsWith('81')) countryCode = 'jp';
                                                else if (cleanNum.startsWith('86')) countryCode = 'cn';
                                                else if (cleanNum.startsWith('971')) countryCode = 'ae';
                                                else if (cleanNum.startsWith('55')) countryCode = 'br';
                                                else if (cleanNum.startsWith('7')) countryCode = 'ru';

                                                if (countryCode === 'globe') return '🌍';

                                                return (
                                                    <img
                                                        src={`https://flagcdn.com/w40/${countryCode}.png`}
                                                        alt={countryCode}
                                                        style={{ width: '24px', height: 'auto', borderRadius: '2px' }}
                                                    />
                                                );
                                            })()}
                                        </span>
                                        <input
                                            type="text"
                                            value={settings.whatsappNumber || ''}
                                            onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                                            placeholder="919876543210"
                                            className="form-input"
                                            style={{ paddingLeft: '48px' }}
                                        />
                                    </div>
                                    <p className="form-help">Include country code without + (e.g., 91 for India)</p>
                                    <div className="form-group">
                                        <label>Tooltip Message</label>
                                        <input
                                            type="text"
                                            value={settings.whatsappTooltip || ''}
                                            onChange={(e) => updateSetting('whatsappTooltip', e.target.value)}
                                            placeholder="Chat with us!"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Design Card */}
                            <div className="settings-card">
                                <h3>Design</h3>

                                {/* Icon Size Selection */}
                                <div className="form-group">
                                    <label>Icon Size</label>
                                    <div className="size-selector">
                                        {[
                                            { value: 'small', label: 'S', size: 32 },
                                            { value: 'medium', label: 'M', size: 48 },
                                            { value: 'large', label: 'L', size: 60 },
                                            { value: 'xl', label: 'XL', size: 72 }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                className={`size-option ${settings.whatsappSize === opt.value ? 'active' : ''}`}
                                                onClick={() => updateSetting('whatsappSize', opt.value)}
                                            >
                                                <div
                                                    className="size-icon-preview"
                                                    style={{
                                                        width: opt.size * 0.6,
                                                        height: opt.size * 0.6,
                                                        backgroundColor: settings.whatsappColor || '#25D366'
                                                    }}
                                                >
                                                    <svg viewBox="0 0 32 32" fill="white" style={{ width: '60%', height: '60%' }}>
                                                        <path d="M16.004 0h-.008C7.174 0 .004 7.176.004 16c0 3.5 1.128 6.744 3.048 9.38L.552 31.2l6.064-2.448A15.87 15.87 0 0 0 16.004 32C24.828 32 32 24.82 32 16S24.828 0 16.004 0Zm9.312 22.596c-.388 1.096-1.936 2.004-3.176 2.268-.848.18-1.956.324-5.684-1.22-4.776-1.976-7.844-6.836-8.08-7.152-.228-.316-1.908-2.544-1.908-4.852s1.208-3.44 1.636-3.912c.352-.388.932-.564 1.488-.564.18 0 .34.008.484.016.428.02.644.044.928.72.356.844 1.224 2.984 1.328 3.2.108.22.22.512.072.816-.14.308-.26.496-.464.74-.2.24-.42.536-.6.72-.2.216-.408.452-.176.884.232.428 1.032 1.704 2.216 2.76 1.524 1.36 2.804 1.784 3.204 1.98.316.156.692.116.884-.076.328-.332.756-.892 1.188-1.44.316-.4.704-.452 1.064-.316.364.132 2.312 1.092 2.708 1.292.396.2.66.296.756.464.1.168.1.968-.288 2.064Z" />
                                                    </svg>
                                                </div>
                                                <span className="size-label">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Button Color</label>
                                        <div className="color-picker-row">
                                            <input
                                                type="color"
                                                value={settings.whatsappColor || '#25D366'}
                                                onChange={(e) => updateSetting('whatsappColor', e.target.value)}
                                                className="color-input"
                                            />
                                            <span className="color-value">{settings.whatsappColor || '#25D366'}</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Position</label>
                                        <select
                                            value={settings.whatsappPosition}
                                            onChange={(e) => updateSetting('whatsappPosition', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="bottom-right">Bottom Right</option>
                                            <option value="bottom-left">Bottom Left</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.whatsappShowTooltip}
                                            onChange={(e) => updateSetting('whatsappShowTooltip', e.target.checked)}
                                        />
                                        Show tooltip on hover
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'delivery' && (
                        <>
                            {/* Enable Toggle Card */}
                            <div className="settings-card">
                                <div className="card-header">
                                    <h3>Delivery Estimator</h3>
                                    <button
                                        className={`toggle-btn ${settings.eddEnabled ? 'active' : ''}`}
                                        onClick={() => updateSetting('eddEnabled', !settings.eddEnabled)}
                                    >
                                        <span className="toggle-thumb" />
                                    </button>
                                </div>
                                <p className="card-description">
                                    Show estimated delivery dates on product pages.
                                </p>
                            </div>

                            {/* Processing Time Card */}
                            <div className="settings-card">
                                <h3>📦 Processing Time (Order Ready)</h3>
                                <p className="card-description">How long to prepare the order for shipping.</p>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Min Days</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.eddMinHandlingDays}
                                            onChange={(e) => updateSetting('eddMinHandlingDays', parseInt(e.target.value) || 0)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Days</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.eddMaxHandlingDays}
                                            onChange={(e) => updateSetting('eddMaxHandlingDays', parseInt(e.target.value) || 0)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Time Card */}
                            <div className="settings-card">
                                <h3>🚚 Shipping Time (In Transit)</h3>
                                <p className="card-description">How long delivery takes after shipping.</p>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Min Days</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.eddMinShippingDays}
                                            onChange={(e) => updateSetting('eddMinShippingDays', parseInt(e.target.value) || 0)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Days</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.eddMaxShippingDays}
                                            onChange={(e) => updateSetting('eddMaxShippingDays', parseInt(e.target.value) || 0)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Theme Appearance Card */}
                            <div className="settings-card">
                                <h3>🎨 Theme Appearance</h3>
                                <p className="card-description">Customize colors and text for the delivery widget.</p>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Theme Color</label>
                                        <div className="color-picker-row">
                                            <input
                                                type="color"
                                                value={settings.eddThemeColor || '#000000'}
                                                onChange={(e) => updateSetting('eddThemeColor', e.target.value)}
                                                className="color-input"
                                            />
                                            <span className="color-value">{settings.eddThemeColor || '#000000'}</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Background Color</label>
                                        <div className="color-picker-row">
                                            <input
                                                type="color"
                                                value={settings.eddBgColor || '#ffffff'}
                                                onChange={(e) => updateSetting('eddBgColor', e.target.value)}
                                                className="color-input"
                                            />
                                            <span className="color-value">{settings.eddBgColor || '#ffffff'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Target Country</label>
                                        <select
                                            value={settings.eddCountry || 'IN'}
                                            onChange={(e) => updateSetting('eddCountry', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="IN">🇮🇳 India</option>
                                            <option value="US">🇺🇸 United States</option>
                                            <option value="GB">🇬🇧 United Kingdom</option>
                                            <option value="CA">🇨🇦 Canada</option>
                                            <option value="AU">🇦🇺 Australia</option>
                                            <option value="DE">🇩🇪 Germany</option>
                                            <option value="FR">🇫🇷 France</option>
                                            <option value="JP">🇯🇵 Japan</option>
                                            <option value="BR">🇧🇷 Brazil</option>
                                            <option value="AE">🇦🇪 UAE</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Custom Text</label>
                                        <input
                                            type="text"
                                            value={settings.eddCustomText || 'Order within'}
                                            onChange={(e) => updateSetting('eddCustomText', e.target.value)}
                                            className="form-input"
                                            placeholder="Order within"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cutoff Time Card */}
                            <div className="settings-card">
                                <h3>⏰ Daily Cutoff Time</h3>
                                <p className="card-description">Orders after this time ship the next business day.</p>
                                <div className="form-group">
                                    <label>Cutoff Hour (24h format)</label>
                                    <select
                                        value={settings.eddCutoffHour}
                                        onChange={(e) => updateSetting('eddCutoffHour', parseInt(e.target.value))}
                                        className="form-select"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {i.toString().padStart(2, '0')}:00 ({i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.eddShowTimeline}
                                            onChange={(e) => updateSetting('eddShowTimeline', e.target.checked)}
                                        />
                                        Show visual timeline graphic
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            {/* Enable Toggle Card */}
                            <div className="settings-card">
                                <div className="card-header">
                                    <h3>Sales Notifications</h3>
                                    <button
                                        className={`toggle-btn ${settings.notificationEnabled ? 'active' : ''}`}
                                        onClick={() => updateSetting('notificationEnabled', !settings.notificationEnabled)}
                                    >
                                        <span className="toggle-thumb" />
                                    </button>
                                </div>
                                <p className="card-description">
                                    Show social proof popups with featured products.
                                </p>
                            </div>

                            {/* Product Selection Card */}
                            <div className="settings-card">
                                <h3>📦 Featured Products</h3>
                                <p className="card-description">Select products to show in notifications.</p>

                                <button className="select-products-btn" onClick={handleSelectProducts}>
                                    <span className="btn-icon">+</span>
                                    Select Products or Collections
                                </button>

                                {selectedProducts.length === 0 ? (
                                    <div className="empty-state-mini">
                                        <span className="empty-icon">📦</span>
                                        <p>No products selected yet.</p>
                                        <p className="empty-hint">Click the button above to add products.</p>
                                    </div>
                                ) : (
                                    <div className="selected-products-list">
                                        {selectedProducts.map((product) => (
                                            <div key={product.id} className="product-item">
                                                <div
                                                    className="product-thumb"
                                                    style={{
                                                        backgroundImage: product.featuredImage ? `url(${product.featuredImage.url})` : 'none'
                                                    }}
                                                />
                                                <span className="product-name">{product.title}</span>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeProduct(product.id)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Timing Card */}
                            <div className="settings-card">
                                <h3>⏱️ Timing</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Display (sec)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={settings.notificationDuration}
                                            onChange={(e) => updateSetting('notificationDuration', parseInt(e.target.value) || 5)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Interval (sec)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={settings.notificationInterval}
                                            onChange={(e) => updateSetting('notificationInterval', parseInt(e.target.value) || 8)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Initial Delay</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.notificationDelay}
                                            onChange={(e) => updateSetting('notificationDelay', parseInt(e.target.value) || 3)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Theme Appearance Card */}
                            <div className="settings-card">
                                <h3>🎨 Notification Theme</h3>
                                <p className="card-description">Customize the notification popup colors.</p>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Accent Color</label>
                                        <div className="color-picker-row">
                                            <input
                                                type="color"
                                                value={settings.notificationThemeColor || '#ef4444'}
                                                onChange={(e) => updateSetting('notificationThemeColor', e.target.value)}
                                                className="color-input"
                                            />
                                            <span className="color-value">{settings.notificationThemeColor || '#ef4444'}</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Background Color</label>
                                        <div className="color-picker-row">
                                            <input
                                                type="color"
                                                value={settings.notificationBgColor || '#ffffff'}
                                                onChange={(e) => updateSetting('notificationBgColor', e.target.value)}
                                                className="color-input"
                                            />
                                            <span className="color-value">{settings.notificationBgColor || '#ffffff'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Size</label>
                                        <select
                                            value={settings.notificationSize || 'medium'}
                                            onChange={(e) => updateSetting('notificationSize', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>
                                    <div className="form-group"></div>
                                </div>
                                <div className="form-group">
                                    <label>Notification Text</label>
                                    <input
                                        type="text"
                                        value={settings.notificationCtaText || 'Trending Now'}
                                        onChange={(e) => updateSetting('notificationCtaText', e.target.value)}
                                        className="form-input"
                                        placeholder="Trending Now"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Live Preview */}
                <div className="preview-panel">
                    {/* Device Toggle Toolbar */}
                    <div className="device-toolbar">
                        <span className="toolbar-title">Live Preview</span>
                        <div className="device-toggle">
                            <button
                                type="button"
                                className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`}
                                onClick={() => setPreviewMode('desktop')}
                            >
                                🖥️ Desktop
                            </button>
                            <button
                                type="button"
                                className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`}
                                onClick={() => setPreviewMode('mobile')}
                            >
                                📱 Mobile
                            </button>
                        </div>

                        {/* Live Store Button */}
                        <button
                            onClick={() => window.open(`https://${shop}`, '_blank')}
                            className="live-store-btn"
                        >
                            🌐 Open Live Store
                        </button>
                    </div>

                    {/* Preview Container */}
                    <div className="preview-canvas">
                        {/* Desktop Frame */}
                        {previewMode === 'desktop' && (
                            <div className="desktop-frame">
                                {/* Browser Header */}
                                <div className="browser-header">
                                    <div className="browser-dots">
                                        <span className="dot red" />
                                        <span className="dot yellow" />
                                        <span className="dot green" />
                                    </div>
                                    <div className="browser-url">
                                        <span className="url-icon">🔒</span>
                                        <span>{shop}</span>
                                    </div>
                                    <div className="browser-actions">
                                        <button
                                            onClick={() => window.open(`https://${shop}`, '_blank')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                            title="Open store in new tab"
                                        >
                                            ↗️
                                        </button>
                                    </div>
                                </div>
                                {/* Simulated Store Content */}
                                <div className="frame-content" style={{ position: 'relative' }}>
                                    {/* Mock Store Header */}
                                    <div className="mock-store-header">
                                        <div className="mock-store-logo">🛒 {shop?.split('.')[0] || 'Your Store'}</div>
                                        <div className="mock-store-nav">
                                            <span>Home</span>
                                            <span>Products</span>
                                            <span>About</span>
                                            <span>Contact</span>
                                        </div>
                                        <div className="mock-store-cart">🛒</div>
                                    </div>

                                    {/* Mock Product Page */}
                                    <div className="mock-product-page">
                                        <div className="mock-product-gallery">
                                            <div className="mock-main-image">
                                                <span style={{ fontSize: '48px' }}>📦</span>
                                                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Product Image</p>
                                            </div>
                                        </div>
                                        <div className="mock-product-details">
                                            <h2 className="mock-product-title">Sample Product Name</h2>
                                            <div className="mock-product-rating">⭐⭐⭐⭐⭐ (128 reviews)</div>
                                            <div className="mock-product-price">
                                                <span className="mock-current-price">₹1,299</span>
                                                <span className="mock-compare-price">₹1,999</span>
                                                <span className="mock-discount-badge">35% OFF</span>
                                            </div>
                                            <p className="mock-product-desc">This is a sample product description that shows how your store will look with widgets enabled.</p>

                                            {/* EDD Widget Preview - Exact Design Match */}
                                            {activeTab === 'delivery' && (
                                                <div className="edd-widget" style={{ marginTop: '16px' }}>
                                                    {/* Top Banner */}
                                                    <div className="edd-banner" style={{ borderColor: settings.eddThemeColor || '#e5e7eb' }}>
                                                        <p className="edd-shipping-line">
                                                            Free Shipping to <span className="edd-flag">
                                                                {{
                                                                    'IN': '🇮🇳', 'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
                                                                    'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'BR': '🇧🇷', 'AE': '🇦🇪'
                                                                }[settings.eddCountry || 'IN']}
                                                            </span> <strong>
                                                                {{
                                                                    'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
                                                                    'DE': 'Germany', 'FR': 'France', 'JP': 'Japan', 'BR': 'Brazil', 'AE': 'UAE'
                                                                }[settings.eddCountry || 'IN']}
                                                            </strong>
                                                        </p>
                                                        <p className="edd-timer-line">
                                                            Order within the next <strong style={{ color: settings.eddThemeColor || '#000' }}>{deliveryDates.hours}Hours {deliveryDates.mins}Minutes {deliveryDates.secs}Seconds</strong> for dispatch today, and you'll receive your package between <strong>{deliveryDates.minShort}</strong> and <strong>{deliveryDates.maxShort}</strong>
                                                        </p>
                                                    </div>

                                                    {/* Progress Steps */}
                                                    {settings.eddShowTimeline && (
                                                        <div className="edd-progress-row">
                                                            {/* Step 1: Ordered */}
                                                            <div className="edd-step-box">
                                                                <svg className="edd-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                                <div className="edd-step-label">Ordered</div>
                                                                <div className="edd-step-date">{deliveryDates.orderedDate}</div>
                                                            </div>

                                                            {/* Arrow 1 */}
                                                            <div className="edd-arrow">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>

                                                            {/* Step 2: Order Ready */}
                                                            <div className="edd-step-box">
                                                                <svg className="edd-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <path d="M8 7h12l-2 13H6L4 7H2M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                                    <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
                                                                </svg>
                                                                <div className="edd-step-label">Order Ready</div>
                                                                <div className="edd-step-date">{deliveryDates.readyMin} - {deliveryDates.readyMax}</div>
                                                            </div>

                                                            {/* Arrow 2 */}
                                                            <div className="edd-arrow">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>

                                                            {/* Step 3: Delivered */}
                                                            <div className="edd-step-box">
                                                                <svg className="edd-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                                    <circle cx="12" cy="9" r="2.5" />
                                                                </svg>
                                                                <div className="edd-step-label">Delivered</div>
                                                                <div className="edd-step-date">{deliveryDates.minShort} - {deliveryDates.maxShort}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <button className="mock-add-to-cart">Add to Cart</button>
                                            <button className="mock-buy-now">Buy Now</button>
                                        </div>
                                    </div>

                                    {/* WhatsApp Button */}
                                    {activeTab === 'whatsapp' && (
                                        <a
                                            href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`whatsapp-preview ${settings.whatsappPosition} size-${settings.whatsappSize || 'medium'}`}
                                            style={{ backgroundColor: 'transparent', cursor: 'pointer', textDecoration: 'none', padding: 0 }}
                                            title={`Open WhatsApp: ${settings.whatsappNumber || 'No number set'}`}
                                        >
                                            <img
                                                src="/whatsapp-icon.png"
                                                alt="Chat with us on WhatsApp"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                            {settings.whatsappShowTooltip && (
                                                <span className="tooltip-preview">{settings.whatsappTooltip || 'Chat with us!'}</span>
                                            )}
                                        </a>
                                    )}
                                    {/* Notification Popup */}
                                    {activeTab === 'notifications' && (
                                        <div className={`notification-preview social-boost-notification--${settings.notificationSize || 'medium'}`} style={{
                                            borderLeft: `4px solid ${settings.notificationThemeColor || '#ef4444'}`,
                                            backgroundColor: settings.notificationBgColor || '#ffffff'
                                        }}>
                                            <div className="notif-image">
                                                {selectedProducts[0]?.featuredImage ? (
                                                    <img src={selectedProducts[0].featuredImage.url} alt="" />
                                                ) : (
                                                    <div className="notif-placeholder" style={{ background: settings.notificationThemeColor || '#ef4444' }}>🔥</div>
                                                )}
                                            </div>
                                            <div className="notif-content">
                                                <span className="notif-badge" style={{ background: settings.notificationThemeColor || '#ef4444' }}>{settings.notificationCtaText || 'Trending Now'}</span>
                                                <p className="notif-title">{selectedProducts[0]?.title || 'Sample Product'}</p>
                                                <span className="notif-time">{settings.notificationTimeText || 'Just now'}</span>
                                            </div>
                                            <button className="notif-close">×</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile Frame - iPhone */}
                        {previewMode === 'mobile' && (
                            <div className="iphone-frame">
                                {/* iPhone Notch */}
                                <div className="iphone-notch">
                                    <div className="notch-speaker" />
                                    <div className="notch-camera" />
                                </div>
                                {/* iPhone Content */}
                                <div className="iphone-screen">
                                    <div className="iphone-status-bar">
                                        <span>9:41</span>
                                        <div className="status-icons">
                                            <span>📶</span>
                                            <span>🔋</span>
                                        </div>
                                    </div>
                                    {/* Simulated Mobile Store Content */}
                                    <div style={{ flex: 1, position: 'relative', overflow: 'auto', background: '#fff' }}>
                                        {/* Mobile Product Page */}
                                        <div className="mock-mobile-product">
                                            <div className="mock-mobile-image">
                                                <span style={{ fontSize: '36px' }}>📦</span>
                                            </div>
                                            <div className="mock-mobile-details">
                                                <h3 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Sample Product</h3>
                                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>⭐⭐⭐⭐⭐ (128)</div>
                                                <div style={{ marginBottom: '8px' }}>
                                                    <span style={{ fontWeight: '700', color: '#16a34a' }}>₹1,299</span>
                                                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '11px', marginLeft: '6px' }}>₹1,999</span>
                                                </div>

                                                {/* EDD Widget */}
                                                {activeTab === 'delivery' && (
                                                    <div className="edd-card" style={{ backgroundColor: settings.eddBgColor || '#ffffff', padding: '8px', fontSize: '11px' }}>
                                                        <div className="edd-countdown-text">
                                                            Order in <strong style={{ color: settings.eddThemeColor || '#000000' }}>{deliveryDates.hours}h {deliveryDates.mins}m</strong> for dispatch today
                                                        </div>
                                                    </div>
                                                )}

                                                <button style={{ width: '100%', padding: '8px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', marginTop: '8px' }}>Add to Cart</button>
                                            </div>
                                        </div>

                                        {/* WhatsApp Widget */}
                                        {activeTab === 'whatsapp' && (
                                            <div
                                                className={`whatsapp-preview ${settings.whatsappPosition} size-${settings.whatsappSize || 'medium'}`}
                                                style={{ backgroundColor: settings.whatsappColor || '#25D366' }}
                                            >
                                                <svg viewBox="0 0 32 32" fill="white">
                                                    <path d="M16.004 0h-.008C7.174 0 .004 7.176.004 16c0 3.5 1.128 6.744 3.048 9.38L.552 31.2l6.064-2.448A15.87 15.87 0 0 0 16.004 32C24.828 32 32 24.82 32 16S24.828 0 16.004 0Zm9.312 22.596c-.388 1.096-1.936 2.004-3.176 2.268-.848.18-1.956.324-5.684-1.22-4.776-1.976-7.844-6.836-8.08-7.152-.228-.316-1.908-2.544-1.908-4.852s1.208-3.44 1.636-3.912c.352-.388.932-.564 1.488-.564.18 0 .34.008.484.016.428.02.644.044.928.72.356.844 1.224 2.984 1.328 3.2.108.22.22.512.072.816-.14.308-.26.496-.464.74-.2.24-.42.536-.6.72-.2.216-.408.452-.176.884.232.428 1.032 1.704 2.216 2.76 1.524 1.36 2.804 1.784 3.204 1.98.316.156.692.116.884-.076.328-.332.756-.892 1.188-1.44.316-.4.704-.452 1.064-.316.364.132 2.312 1.092 2.708 1.292.396.2.66.296.756.464.1.168.1.968-.288 2.064Z" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Notification Popup */}
                                        {activeTab === 'notifications' && (
                                            <div className={`notification-preview mobile social-boost-notification--${settings.notificationSize || 'medium'}`} style={{
                                                borderLeft: `4px solid ${settings.notificationThemeColor || '#ef4444'}`,
                                                backgroundColor: settings.notificationBgColor || '#ffffff'
                                            }}>
                                                <div className="notif-image">
                                                    <div className="notif-placeholder" style={{ background: settings.notificationThemeColor || '#ef4444' }}>🔥</div>
                                                </div>
                                                <div className="notif-content">
                                                    <span className="notif-badge" style={{ background: settings.notificationThemeColor || '#ef4444' }}>{settings.notificationCtaText || 'Trending'}</span>
                                                    <p className="notif-title">{selectedProducts[0]?.title || 'Product'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Home Indicator */}
                                <div className="iphone-home-indicator" />
                            </div>
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
}

