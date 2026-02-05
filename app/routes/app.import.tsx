import { useState, useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { PRODUCTS, COLLECTION_TYPES } from "../data/products";
import "../styles/custom.css";

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
    "Electronics": "📱",
    "Garden & Outdoors": "🌿",
    "Gifts": "🎁",
    "Health & Beauty": "💄",
    "Home & Kitchen": "🏠",
    "Home Decor": "🖼️",
    "Home Improvement": "🔧",
    "Mobile Accessories": "📲",
    "Office Products": "📎",
    "Toys & Games": "🎮"
};

// Fixed collections that will be created
const FIXED_COLLECTIONS = [
    { title: "Electrical Lighting", icon: "💡", description: "Lamps, lighting fixtures & LED products" },
    { title: "Home Decor", icon: "🖼️", description: "Wall art, decorative items & accessories" },
    { title: "Best Selling", icon: "⭐", description: "Top performing products" },
    { title: "Trending", icon: "🔥", description: "Currently popular items" },
    { title: "Accessories", icon: "👜", description: "Fashion & lifestyle accessories" }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return {
        totalProducts: PRODUCTS.length,
        collections: FIXED_COLLECTIONS,
        productsByType: COLLECTION_TYPES.map(c => ({
            type: c.title,
            productType: c.productType,
            count: PRODUCTS.filter(p => p.productType === c.productType).length,
            icon: CATEGORY_ICONS[c.title] || "📦"
        }))
    };
};

export default function ImportPage() {
    const { totalProducts, collections } = useLoaderData<typeof loader>();
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importResults, setImportResults] = useState<any>(null);
    const fetcher = useFetcher();
    const shopify = useAppBridge();

    useEffect(() => {
        if (isImporting && !importResults) {
            const interval = setInterval(() => {
                setImportProgress(prev => {
                    if (prev >= 95) return prev;
                    return prev + Math.random() * 10;
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isImporting, importResults]);

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            setIsImporting(false);
            setImportProgress(100);
            setImportResults(fetcher.data);

            if (fetcher.data.summary) {
                const { imported, skipped, failed, collectionsCreated } = fetcher.data.summary;
                shopify.toast.show(`✅ Imported: ${imported}, ⏭️ Skipped: ${skipped}, 📂 Collections: ${collectionsCreated || 0}`);
            } else if (fetcher.data.error) {
                shopify.toast.show(fetcher.data.error, { isError: true });
            }
        }
    }, [fetcher.state, fetcher.data, shopify]);

    const handleImportAll = () => {
        setIsImporting(true);
        setImportProgress(0);
        setImportResults(null);

        const formData = new FormData();
        formData.append("action", "import-all");
        fetcher.submit(formData, { method: "POST", action: "/api/import-products" });
    };

    return (
        <s-page heading="">
            <s-button
                slot="primary-action"
                onClick={handleImportAll}
                {...(isImporting ? { loading: true, disabled: true } : {})}
            >
                🚀 Import All Products
            </s-button>

            {/* Hero Section */}
            <div className="import-hero animate-fade-in">
                <div className="import-count">{totalProducts}</div>
                <div className="import-label">Products Ready to Import</div>
                <p style={{
                    marginTop: '16px',
                    opacity: 0.9,
                    maxWidth: '500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    padding: '0 16px'
                }}>
                    Import all products to your Shopify store with a single click.
                    Collections are created automatically!
                </p>
            </div>

            {/* Progress Section */}
            {(isImporting || importResults) && (
                <div className="feature-card animate-fade-in mb-lg">
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 600 }}>
                            {importResults ? '✅ Import Complete!' : '⏳ Importing Products...'}
                        </h3>
                        {importResults && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <span className="stat-badge enabled">{importResults.summary?.imported || 0} Imported</span>
                                <span className="stat-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                                    {importResults.summary?.skipped || 0} Skipped
                                </span>
                                {(importResults.summary?.collectionsCreated || 0) > 0 && (
                                    <span className="stat-badge" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea' }}>
                                        {importResults.summary?.collectionsCreated} Collections
                                    </span>
                                )}
                                {(importResults.summary?.failed || 0) > 0 && (
                                    <span className="stat-badge disabled">{importResults.summary?.failed} Failed</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="progress-container">
                        <div
                            className={`progress-bar ${isImporting && !importResults ? 'loading' : ''}`}
                            style={{ width: `${importProgress}%` }}
                        />
                    </div>

                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '12px 0 0 0' }}>
                        {isImporting && !importResults
                            ? 'Please wait, this may take a few minutes...'
                            : `Processed ${totalProducts} products`}
                    </p>

                    {importResults?.results?.collections?.length > 0 && (
                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            background: 'rgba(147, 51, 234, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(147, 51, 234, 0.15)'
                        }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#7c3aed', marginBottom: '8px' }}>
                                📂 Collections Created:
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {importResults.results.collections.map((name: string) => (
                                    <span key={name} style={{
                                        background: 'white',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {importResults?.results?.failed?.length > 0 && (
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
                                View failed products ({importResults.results.failed.length})
                            </summary>
                            <ul style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                                {importResults.results.failed.slice(0, 5).map((f: any) => (
                                    <li key={f.handle} style={{ marginBottom: '4px' }}>
                                        <strong>{f.handle}</strong>: {f.error}
                                    </li>
                                ))}
                                {importResults.results.failed.length > 5 && (
                                    <li>...and {importResults.results.failed.length - 5} more</li>
                                )}
                            </ul>
                        </details>
                    )}
                </div>
            )}

            <s-layout>
                <s-layout-section>
                    {/* Collections That Will Be Created */}
                    <div className="feature-card">
                        <h3 style={{ margin: '0 0 8px 0', fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 600 }}>
                            📂 Collections Created on Import
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
                            These 5 collections will be automatically created when you import products:
                        </p>

                        <div className="category-grid">
                            {collections.map((collection) => (
                                <div key={collection.title} className="category-card" style={{
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div className="category-emoji" style={{ fontSize: '32px', marginBottom: '8px' }}>
                                        {collection.icon}
                                    </div>
                                    <div className="category-name" style={{
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        color: '#1e293b',
                                        marginBottom: '4px'
                                    }}>
                                        {collection.title}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                        {collection.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="feature-card" style={{ marginTop: '16px' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 600 }}>
                            ✨ What's Included
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>🖼️</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>Product Images</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>High-quality images</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>📝</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>Descriptions</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Ready-to-use copy</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>💰</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>Pricing</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Compare at prices</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>📂</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>Collections</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Auto-created</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </s-layout-section>

                <s-layout-section secondary>
                    {/* How It Works */}
                    <div className="sidebar-card">
                        <h4 className="sidebar-title">📖 How It Works</h4>
                        <ol className="step-list">
                            <li className="step-item">
                                <span className="step-number">1</span>
                                <span className="step-text">Click <strong>Import All</strong></span>
                            </li>
                            <li className="step-item">
                                <span className="step-number">2</span>
                                <span className="step-text">Wait for import to complete</span>
                            </li>
                            <li className="step-item">
                                <span className="step-number">3</span>
                                <span className="step-text">Collections created automatically</span>
                            </li>
                            <li className="step-item">
                                <span className="step-number">4</span>
                                <span className="step-text">Use in notification widgets!</span>
                            </li>
                        </ol>
                    </div>

                    {/* Important Notes */}
                    <div className="sidebar-card" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '12px' }}>
                            ⚠️ Important Notes
                        </h4>
                        <ul style={{ fontSize: '12px', color: '#a16207', margin: 0, paddingLeft: '16px', lineHeight: 1.7 }}>
                            <li>Duplicates are auto-skipped</li>
                            <li>Import may take a few minutes</li>
                            <li>Products set to Active status</li>
                            <li>Collections created with products</li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="sidebar-card">
                        <h4 className="sidebar-title">🔗 Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <a href="/app" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#667eea', textDecoration: 'none' }}>
                                ← Back to Dashboard
                            </a>
                        </div>
                    </div>
                </s-layout-section>
            </s-layout>
        </s-page>
    );
}
